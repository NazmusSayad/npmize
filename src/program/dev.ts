import fs from 'fs'
import path from 'path'
import config from '../config'
import tsc from '../scripts/tsc'
import updateImports from '../updateImports'
import { cleanDir, moveFiles } from '../utils'
import packageJSON from '../scripts/packageJSON'
import pushNodeCode from '../scripts/pushNodeCode'

export default function (basePath: string, options: DevOptions) {
  const data = packageJSON.read(basePath)
  if (data.type) {
    options.module ??= data.type === 'module' ? 'mjs' : 'cjs'
  }

  const tempDir = path.join(basePath, config.tempBuildDir)
  cleanDir(tempDir)
  cleanDir(options.outDir)

  function makeOutFiles(filename: string, outModule: 'cjs' | 'mjs') {
    const fullPath = path.join(tempDir, filename)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const updatedImports = updateImports(outModule, [fullPath])
      const [movedFile] = moveFiles(tempDir, options.outDir, updatedImports)
      if (outModule === 'mjs' && options.node) pushNodeCode(movedFile)
    }
  }

  fs.watch(tempDir, { recursive: true }, (event, filename) => {
    if (event !== 'change') return
    if (!(filename.endsWith('.js') || filename.endsWith('.ts'))) return

    if (options.module) {
      makeOutFiles(filename, options.module)
    } else {
      makeOutFiles(filename, 'cjs')
      makeOutFiles(filename, 'mjs')
    }
  })

  tsc(
    basePath,
    [
      ...options.tsc.map((tsc) => `--${tsc}`),
      `--outDir ${tempDir}`,
      `--module ${options.module === 'cjs' ? 'commonjs' : 'esnext'}`,
      '--watch',
    ],
    true
  )
}

type DevOptions = {
  module?: 'cjs' | 'mjs'
  node?: boolean
  outDir: string
  tsc: string[]
}
