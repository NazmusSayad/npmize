import path from 'path'
import * as utils from './utils'
import { NodeType } from './types.t'
import * as babel from '@babel/parser'
import { Worker } from 'worker_threads'
import { Statement } from '@babel/types'
import { getImports, getRequires } from './node'
import { resolveImportPath } from '../scripts/tsconfig'

export default async function (
  cwd: string,
  filePath: string,
  compiledText: string,
  moduleType: 'cjs' | 'mjs',
  tsconfigBaseUrl: string | undefined,
  tsconfigPaths: Record<string, string[]> | undefined
) {
  const ext = '.' + moduleType
  const fileDirPath = path.dirname(filePath)

  const parsedBody = babel.parse(compiledText, {
    sourceType: 'module',
    plugins: ['typescript'],
    sourceFilename: filePath,
  }).program.body

  const isModuleJs = filePath.endsWith('.ts') || moduleType === 'mjs'
  const foundImportPaths = isModuleJs
    ? getImports(parsedBody)
    : getRequires(parsedBody)

  function updateRelativeImports(node: NodeType) {
    const shortPath = node.value.replace(/\.js$/i, '')
    const fullPath = path.join(fileDirPath, node.value)

    const isExists = utils.isFileExists(fullPath)
    return isExists ? shortPath + ext : shortPath + '/index' + ext
  }

  function updateResolvedPath(baseUrl: string, resolvedPath: string) {
    const relativeToCurrentOutDir = path.join(
      cwd,
      path.relative(baseUrl, resolvedPath)
    )

    const shortPath = path.relative(
      path.dirname(filePath),
      relativeToCurrentOutDir
    )

    const shortestPathWithExt =
      path.dirname(shortPath) + '/' + path.parse(shortPath).name + ext

    const posixSortPathWithExt = path
      .normalize(shortestPathWithExt)
      .replace(/\\/g, '/')

    if (posixSortPathWithExt.startsWith('.')) return posixSortPathWithExt
    return './' + posixSortPathWithExt
  }

  const updatedData = utils.getUpdatedData(
    compiledText,
    foundImportPaths,
    (node: NodeType) => {
      if (node.value.startsWith('.')) {
        return updateRelativeImports(node)
      }

      if (!tsconfigBaseUrl || !tsconfigPaths) return
      const resolvedPath = resolveImportPath(
        tsconfigBaseUrl,
        node.value,
        tsconfigPaths
      )

      return resolvedPath && updateResolvedPath(tsconfigBaseUrl, resolvedPath)
    }
  )

  const newFilePath = utils.getNewFilePath(filePath, moduleType)
  return [newFilePath, updatedData] as const
}

function getRequiredStatements(type: 'import' | 'require', body: Statement[]) {
  return new Promise<NodeType[]>((resolve) => {
    const worker = new Worker(path.join(__dirname, './nodeWorker.js'))
    worker.postMessage({ type, body })
    worker.on('message', (message) => {
      resolve(message)
    })
  })
}
