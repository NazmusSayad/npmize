import path from 'path'
import { NodeType } from './types.t'
import * as babel from '@babel/parser'
import { getImports, getRequires } from './node'
import { resolveImportPath } from '../scripts/tsconfig'
import { getUpdatedData, resolveJsFilePath } from './helpers'

export default async function (
  cwd: string,
  filePath: string,
  compiledText: string,
  moduleType: 'cjs' | 'mjs',
  tsconfigBaseUrl: string | undefined,
  tsconfigPaths: Record<string, string[]> | undefined
) {
  const newExt = '.' + moduleType
  const isModuleJs = filePath.endsWith('.ts') || moduleType === 'mjs'
  const parsedBody = babel.parse(compiledText, {
    sourceType: 'module',
    plugins: ['typescript'],
    sourceFilename: filePath,
  }).program.body

  const foundImportPaths = isModuleJs
    ? getImports(parsedBody)
    : getRequires(parsedBody)

  function updateRelativeImports(node: NodeType) {
    const fileDir = path.dirname(filePath)
    const resolvedPath = resolveJsFilePath(path.join(fileDir, node.value))
    if (!resolvedPath) return

    const noExtPath = resolvedPath.replace(/\.\w+$/i, newExt)
    const relativePath = path.relative(fileDir, noExtPath).replace(/\\/g, '/')
    return relativePath.startsWith('.') ? relativePath : './' + relativePath
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
      path.dirname(shortPath) + '/' + path.parse(shortPath).name + newExt

    const posixSortPathWithExt = path
      .normalize(shortestPathWithExt)
      .replace(/\\/g, '/')

    if (posixSortPathWithExt.startsWith('.')) return posixSortPathWithExt
    return './' + posixSortPathWithExt
  }

  return getUpdatedData(compiledText, foundImportPaths, (node: NodeType) => {
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
  })
}
