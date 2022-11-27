import fs from 'fs'
import runCmd from './runCmd'
import { mjsOutDir } from '../config'
import argv from '../argv'
import nodeCode from './nodeCode'
import writeTSConf from './writeTSConf'

export const dev = (): void => {
  writeTSConf()

  runCmd('cjs')

  if (fs.existsSync(mjsOutDir)) {
    fs.rmSync(mjsOutDir, { recursive: true })
  }
}

export const build = (): void => {
  writeTSConf()

  runCmd('cjs')
  runCmd('mjs')

  if (!argv.flag.node) return
  nodeCode()
}
