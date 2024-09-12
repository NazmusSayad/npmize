import fs from 'fs'
import path from 'path'
import tsc from '../scripts/tsc'
import { CompileOptions } from './types.t'
import updateImports from '../updateImports'
import pushNodeCode from '../scripts/pushNodeCode'
import { cleanDir, getNodeModulesTempDir, moveFiles } from '../utils'

export default function (rootPath: string, options: CompileOptions) {
  options.module ??= 'cjs'

  const finalOutDir = path.resolve(options.tsConfig?.outDir!)
  cleanDir(finalOutDir)

  const tempOutDir = getNodeModulesTempDir(rootPath, 'dev-' + options.module)
  cleanDir(tempOutDir)

  function makeOutFiles(filename: string, outModule: 'cjs' | 'mjs') {
    const fullPath = path.join(tempOutDir, filename)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const updatedImports = updateImports(
        rootPath,
        tempOutDir,
        options.tsConfig?.baseUrl,
        options.tsConfig?.paths,
        outModule,
        [fullPath]
      )

      const [movedFile] = moveFiles(tempOutDir, finalOutDir, updatedImports)
      if (outModule === 'mjs' && options.node) pushNodeCode(movedFile)
    }
  }

  fs.watch(tempOutDir, { recursive: true }, (event, filename) => {
    if (event !== 'change' || !filename) return
    if (!(filename.endsWith('.js') || filename.endsWith('.ts'))) return
    makeOutFiles(filename, options.module!)
  })

  tsc(
    rootPath,
    [
      ...options.tsc,
      `--outDir ${tempOutDir}`,
      `--module ${options.module === 'cjs' ? 'commonjs' : 'esnext'}`,
      '--watch',
    ],
    true
  )
}
