import shell from 'shelljs'
import ls from 'node-ls-files'
import { tscOptions } from '../argv'
import { cleanDir, getCommands } from '../utils/utils'
import writePkgJson from './writePkgJson'

type Options = {
  watch?: boolean
  writePkg?: boolean
  files?: boolean
}

export default (
  outDir: string,
  type: 'cjs' | 'mjs',
  { watch = false, writePkg, files }: Options = {}
): string[] => {
  cleanDir(outDir)
  writePkg && writePkgJson(outDir, type)

  const commands = getCommands(
    'tsc',
    ...tscOptions,
    '--project .',
    `--outDir ${outDir}`,
    `--module ${type === 'cjs' ? 'CommonJS' : 'ESNext'}`,
    watch && '--watch'
  )

  shell.exec(commands, { async: watch })
  return (files && ls.sync(outDir)) as any
}
