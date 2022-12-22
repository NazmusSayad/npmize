import ac from 'ansi-colors'
import runCmd from './runCmd'
import { cjsOutDir, mjsOutDir } from '../config'
import argv from '../argv'
import nodeCode from './nodeCode'
import { deleteDir } from '../utils/utils'

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
  runCmd(cjsOutDir, 'cjs')
  const mjsFiles = runCmd(mjsOutDir, 'mjs', { files: true })

  if (argv.flag.node) {
    const js_mjs = mjsFiles.filter((file) => {
      return file.endsWith('.js') || file.endsWith('.mjs')
    })
    nodeCode(js_mjs)
  }
}
