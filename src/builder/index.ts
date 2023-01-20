import ac from 'ansi-colors'
import runCmd from './runCmd'
import { cjsOutDir, mjsOutDir } from '../config'
import argv from '../argv'
import nodeCode from './nodeCode'
import { deleteDir } from '../utils/utils'
import updateImports from '../updateImports'

export const dev = (): void => {
  deleteDir(cjsOutDir)
  deleteDir(mjsOutDir)

  const m = argv.flag.module ?? 'cjs'
  if (m !== 'cjs' && m !== 'mjs') {
    console.warn(ac.yellow(`Invalid module '${m}'`))
    process.exit(1)
  }

  runCmd(m === 'cjs' ? cjsOutDir : mjsOutDir, m, { watch: true })
}

export const build = (): void => {
  const options = { files: true, writePkg: argv.isLegacy }
  const cjsFiles = runCmd(cjsOutDir, 'cjs', options)
  const mjsFiles = runCmd(mjsOutDir, 'mjs', options)

  if (argv.flag.node) {
    const jsMjs = mjsFiles.filter((file) => {
      return file.endsWith('.js') || file.endsWith('.mjs')
    })
    nodeCode(jsMjs)
  }

  if (!argv.isLegacy) {
    updateImports('cjs', cjsFiles)
    updateImports('mjs', mjsFiles)
  }
}
