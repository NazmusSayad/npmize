import fs from 'fs'
import path from 'path'
import * as lskit from 'lskit'
import tsc from '../scripts/tsc'
import { CompileOptions } from './types.t'
import updateImports from '../updateImports'
import pushNodeCode from '../scripts/pushNodeCode'
import { cleanDir, getNodeModulesTempDir, moveFiles } from '../utils'

export default function (rootPath: string, options: CompileOptions) {
  console.log(`Build started at ${rootPath}`)
  console.log('')

  const outDir = path.resolve(options.tsConfig?.outDir!)
  cleanDir(outDir)

  if (options.module) {
    runBuild(rootPath, outDir, options.module, options)
  } else {
    runBuild(rootPath, outDir, 'cjs', options)
    runBuild(rootPath, outDir, 'mjs', options)
  }
}

function runBuild(
  rootPath: string,
  outDir: string,
  moduleType: Exclude<CompileOptions['module'], undefined>,
  options: Omit<CompileOptions, 'module' | 'outDir'>
) {
  console.log(`Building ${moduleType}...`)

  const tempOutDir = getNodeModulesTempDir(rootPath, 'build-' + moduleType)
  cleanDir(tempOutDir)

  tsc(rootPath, [
    ...options.tsc,
    `--outDir ${tempOutDir}`,
    `--module ${moduleType === 'cjs' ? 'commonjs' : 'esnext'}`,
  ])

  const files = lskit.sync(tempOutDir)
  const updatedImports = updateImports(
    rootPath,
    tempOutDir,
    options.tsConfig?.baseUrl,
    options.tsConfig?.paths,
    moduleType,
    files
  )

  const movedFiles = moveFiles(tempOutDir, outDir, updatedImports)
  if (moduleType === 'mjs' && options.node && movedFiles.length) {
    console.log('Enabling Node.js __dirname and __filename...')
    pushNodeCode(...movedFiles)
  }

  const fileSizes = movedFiles
    .filter((a) => a.endsWith('js'))
    .map((file) => {
      const stat = fs.statSync(file)
      return {
        file,
        size: stat.size,
      }
    })

  const totalSize = fileSizes.reduce((acc, { size }) => acc + size, 0)
  console.log(
    `Built ${fileSizes.length} JavaScript files with a total size of ${(
      totalSize / 1024
    ).toFixed(2)}KB`
  )

  cleanDir(tempOutDir, false)
  console.log('')
}
