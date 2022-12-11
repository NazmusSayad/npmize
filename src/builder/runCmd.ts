import shell from 'shelljs'
import ls from 'node-ls-files'
import { tscOptions } from '../argv'
import { cleanDir, getCommands } from '../utils/utils'
import writePkgJson from './writePkgJson'

type Options = { [index: string]: any }
export default (
  outDir: string,
  type: 'cjs' | 'mjs',
  { watch = false, clean = true, writePkg = true }: Options = {}
): string[] => {
  clean && cleanDir(outDir)
  writePkg && writePkgJson(outDir, type)

  const commands = getCommands(
    'tsc',
    ...tscOptions,
    '--project .',
    `--outDir ${outDir}`,
    `--module ${type === 'cjs' ? 'commonjs' : 'es6'}`,
    watch && '--watch'
  )

  shell.exec(commands, { async: watch })
  return watch ? [] : ls.sync(outDir)
}
