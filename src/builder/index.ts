import fs from 'fs'
import runCmd from './runCmd'
import { cjsOutDir, mjsOutDir } from '../config'
import argv from '../argv'
import nodeCode from './nodeCode'
import moduleExports from './moduleExports'

export const dev = (): void => {
  if (fs.existsSync(mjsOutDir)) {
    fs.rmSync(mjsOutDir, { recursive: true })
  }

  runCmd(cjsOutDir, 'cjs', { watch: true })
}

export const build = (): void => {
  const cjsFiles = runCmd(cjsOutDir, 'cjs')
  const mjsFiles = runCmd(mjsOutDir, 'mjs')

  if (argv.flag.node) {
    const js_mjs = mjsFiles.filter((file) => {
      return file.endsWith('.js') || file.endsWith('.mjs')
    })
    nodeCode(js_mjs)
  }

  if (!argv.flag['no-module-exports']) {
    const js = cjsFiles.filter((file) => file.endsWith('.js'))
    moduleExports(js)
  }
}
