import fs from 'fs'
import tsc from '../scripts/tsc'
import { CompileOptions } from './types.t'
import makeOutput from '../scripts/makeOutputFile'
import { getNodeModulesTempDir } from '../utils'
import { cleanDir, getAllFiles } from '../utils/fs'

export default function (rootPath: string, options: CompileOptions) {
  console.log(`Build started at ${rootPath}`)
  console.log('')

  cleanDir(options.tsConfig.outDir)

  if (options.module) {
    return runBuild(rootPath, options.tsConfig.outDir, options.module, options)
  }

  runBuild(rootPath, options.tsConfig.outDir, 'cjs', options)
  runBuild(rootPath, options.tsConfig.outDir, 'mjs', options)
}

function runBuild(
  rootPath: string,
  fullOutDir: string,
  moduleType: Exclude<CompileOptions['module'], undefined>,
  options: Omit<CompileOptions, 'module' | 'outDir'>
) {
  console.log(`Building ${moduleType}...`)

  const tempOutDir = getNodeModulesTempDir(rootPath, 'build-' + moduleType)
  cleanDir(tempOutDir)

  tsc(rootPath, [
    ...options.tsc,
    '--outDir',
    tempOutDir,
    '--module',
    moduleType === 'cjs' ? 'commonjs' : 'esnext',
  ])

  const newFiles = getAllFiles(tempOutDir).map((file) => {
    return makeOutput(file, {
      tempOutDir: tempOutDir,
      finalOutDir: fullOutDir,
      moduleType: moduleType,
      pushNodeCode: options.node,
      tsConfig: {
        paths: options.tsConfig?.paths,
        baseUrl: options.tsConfig?.baseUrl,
      },
    })
  })

  const fileSizes = newFiles
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
