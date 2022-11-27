import shell from 'shelljs'
import argv from '../argv'
import writeType from './writeType'
import { getCommands } from '../utils/utils'
import { mjsOutDir, cjsOutDir, tscOptPrefix } from '../config'

const tscOptions: string[] = []
for (let key in argv.flag) {
  const value = argv.flag[key]
  if (!key.startsWith(tscOptPrefix)) continue

  const tscKey = key.slice(tscOptPrefix.length)
  tscKey && tscOptions.push(tscKey, value)
}

export default (type: 'cjs' | 'mjs'): void => {
  const watch = argv.cmd === 'dev'
  const outDir = type === 'cjs' ? cjsOutDir : mjsOutDir
  writeType(outDir, type === 'cjs' ? 'commonjs' : 'module')

  const commands = getCommands(
    'tsc',
    ...tscOptions,
    '--project .',
    `--outDir ${outDir}`,
    `--module ${type === 'cjs' ? 'commonjs' : 'es6'}`,
    `--watch ${watch}`
  )

  shell.exec(commands, { async: watch })
}
