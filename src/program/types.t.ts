import { readTSConfig } from '../scripts/tsconfig'

export type CompileOptions = {
  tsc: string[]
  node: boolean
  module?: 'cjs' | 'mjs'
  tsConfig: ReturnType<typeof readTSConfig> & { outDir: string }
}
