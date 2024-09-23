import fs from 'fs'
import path from 'path'
import tsc from '../scripts/tsc'
import { CompileOptions } from './types.t'
import updateImports from '../updateImports'
import pushNodeCode from '../scripts/pushNodeCode'
import { cleanDir, getNodeModulesTempDir, moveFiles } from '../utils'

export default function (rootPath: string, options: CompileOptions) {
  const outDir = options.tsConfig?.outDir
  if (!outDir) throw new Error('tsConfig.outDir is required')

  if (options.module) {
    return runDev(rootPath, outDir, options.module, options)
  }

  runDev(rootPath, outDir, 'cjs', options)
  runDev(rootPath, outDir, 'mjs', options)
}

function runDev(
  rootPath: string,
  shortOutDir: string,
  moduleType: Exclude<CompileOptions['module'], undefined>,
  options: Omit<CompileOptions, 'module' | 'outDir'>
) {
  const finalOutDir = path.resolve(shortOutDir)
  cleanDir(finalOutDir)

  const tempOutDir = getNodeModulesTempDir(rootPath, 'dev-' + moduleType)
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
    makeOutFiles(filename, moduleType)
  })

  tsc(
    rootPath,
    [
      ...options.tsc,
      '--outDir',
      tempOutDir,
      '--module',
      moduleType === 'cjs' ? 'commonjs' : 'esnext',
      '--watch',
    ],
    true
  )
}
