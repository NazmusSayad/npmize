import tsc from '../scripts/tsc'
import packageJSON from '../scripts/packageJSON'
import { cleanDir } from '../utils'

export default function (basePath: string, options: DevOptions) {
  const data = packageJSON.read(basePath)
  options.module ??= data.type === 'module' ? 'mjs' : 'cjs'

  cleanDir(options.outDir)
  tsc(basePath, [
    ...options.tsc.map((tsc) => `--${tsc}`),
    '--watch',
    `--outDir ${options.outDir}`,
    `--module ${options.module === 'cjs' ? 'commonjs' : 'esnext'}`,
  ])
}

type DevOptions = {
  module?: 'cjs' | 'mjs'
  outDir: string
  tsc: string[]
}
