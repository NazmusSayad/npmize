import path from 'path'

export const mjsOutDir = path.resolve('./dist-mjs')
export const cjsOutDir = path.resolve('./dist-cjs')

export const userTSConfigPath = path.resolve('./tsconfig.json')
export const defaultTSConfigPath = path.join(
  __dirname,
  '../lib/tsconfig-default.json'
)

export const srcPath = path.resolve('./src')


export const tscOptPrefix = 'tsc'