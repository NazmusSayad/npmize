import fs from 'fs'
import tsc from '../scripts/tsc'
import { CompileOptions } from './types.t'
import makeOutput from '../scripts/makeOutputFile'
import { getNodeModulesTempDir } from '../utils'
import { cleanDir, getAllFiles } from '../utils/fs'
import ansiColors from 'ansi-colors'

export default async function (rootPath: string, options: BuildOptions) {
  console.log(`Build started at ${rootPath}`)
  console.log('')

  cleanDir(options.tsConfig.outDir)

  if (options.module) {
    return runBuild(rootPath, options.tsConfig.outDir, options.module, options)
  }

  await runBuild(rootPath, options.tsConfig.outDir, 'cjs', options)
  await runBuild(rootPath, options.tsConfig.outDir, 'mjs', options)
}

async function runBuild(
  rootPath: string,
  fullOutDir: string,
  moduleType: Exclude<BuildOptions['module'], undefined>,
  options: Omit<BuildOptions, 'module' | 'outDir'>
) {
  console.log(`Building ${moduleType}...`)

  console.time('Build time')
  const tempOutDir = getNodeModulesTempDir(rootPath, 'build-' + moduleType)
  cleanDir(tempOutDir)

  tsc(rootPath, [
    ...options.tsc,
    '--outDir',
    tempOutDir,
    '--module',
    moduleType === 'cjs' ? 'commonjs' : 'esnext',
  ])

  const promisesOfFiles = getAllFiles(tempOutDir).map((file) => {
    return makeOutput(file, {
      tempOutDir: tempOutDir,
      finalOutDir: fullOutDir,
      moduleType: moduleType,
      useWorker: options.worker,
      pushNodeCode: options.node,
      tsConfig: {
        paths: options.tsConfig?.paths,
        baseUrl: options.tsConfig?.baseUrl,
      },
    })
  })

  const newFiles = await Promise.all(promisesOfFiles)
  console.timeEnd('Build time')

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
    `Built ${ansiColors.yellow(
      String(fileSizes.length)
    )} JavaScript files with a total size of ${ansiColors.yellow(
      (totalSize / 1024).toFixed(2)
    )} KB`
  )

  cleanDir(tempOutDir, false)
  console.log('')
}

export type BuildOptions = CompileOptions & {
  worker: boolean
}
