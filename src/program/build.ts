import fs from 'fs'
import * as lskit from 'lskit'
import tsc from '../scripts/tsc'
import updateImports from '../updateImports'
import pushNodeCode from '../scripts/pushNodeCode'
import { cleanDir, getNodeModulesTempDir, moveFiles } from '../utils'

export default function (basePath: string, options: Options) {
  console.log(`Build started at ${basePath}`)
  console.log('')

  cleanDir(options.outDir)

  if (options.module) {
    runBuild(options.module, basePath, options)
  } else {
    runBuild('cjs', basePath, options)
    runBuild('mjs', basePath, options)
  }
}

function runBuild(
  moduleType: Exclude<Options['module'], undefined>,
  basePath: string,
  options: Omit<Options, 'module'>
) {
  console.log(`Building ${moduleType}...`)

  const tempDir = getNodeModulesTempDir(basePath)
  cleanDir(tempDir)

  tsc(basePath, [
    ...options.tsc,
    `--outDir ${tempDir}`,
    `--module ${moduleType === 'cjs' ? 'commonjs' : 'esnext'}`,
  ])

  const files = lskit.sync(tempDir)
  const updatedImports = updateImports(moduleType, files)
  const movedFiles = moveFiles(tempDir, options.outDir, updatedImports)

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

  cleanDir(tempDir, false)
  console.log('')
}

type Options = {
  tsc: string[]
  node: boolean
  outDir: string
  module?: 'cjs' | 'mjs'
}
