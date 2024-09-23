import fs from 'fs'
import path from 'path'
import * as node from './node'
import * as utils from './utils'
import { NodeType } from './types.t'
import * as babel from '@babel/parser'
import { Statement } from '@babel/types'
import { resolveImportPath } from '../scripts/tsconfig'

const getImports = (parsed: Statement[]) => {
  return [
    ...node.CallExpressionImport(parsed),
    ...node.TSImportType(parsed),
    ...node.ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(
      parsed
    ),
  ]
}

const getRequires = (parsed: Statement[]) => {
  return node.CallExpressionRequire(parsed)
}

export default (
  cwd: string,
  filePath: string,
  moduleType: 'cjs' | 'mjs',
  tsconfigBaseUrl: string | undefined,
  tsconfigPaths: Record<string, string[]> | undefined
) => {
  const ext = '.' + moduleType
  const dirPath = path.dirname(filePath)
  const data = fs.readFileSync(filePath, 'utf-8')

  const parsedBody = babel.parse(data, {
    sourceType: 'module',
    plugins: ['typescript'],
    sourceFilename: filePath,
  }).program.body

  const foundImportPaths =
    filePath.endsWith('.ts') || moduleType === 'mjs'
      ? getImports(parsedBody)
      : getRequires(parsedBody)

  function updateRelativeImports(node: NodeType) {
    const shortPath = node.value.replace(/\.js$/i, '')
    const fullPath = path.join(dirPath, node.value)

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
    data,
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
