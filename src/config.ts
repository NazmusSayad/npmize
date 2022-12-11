import path from 'path'

export const tscOptPrefix = 'tsc'

export const srcPath = path.resolve('./src')

// export const mainOutDir = path.resolve('./dist')
export const mjsOutDir = path.resolve('./dist-mjs')
export const cjsOutDir = path.resolve('./dist-cjs')
// export const typesOutDir = path.resolve('./dist-types')

export const packageJsonPath = path.resolve('./package.json')
export const userTSConfigPath = path.resolve('./tsconfig.json')
export const defaultTSConfigPath = path.join(
  __dirname,
  '../lib/tsconfig-default.json'
)
