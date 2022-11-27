import fs from 'fs'
import runCmd from './runCmd'
import { mjsOutDir } from '../config'
import { writeTSConfig } from '../scripts/init'
import argv from '../argv'
import nodeCode from './nodeCode'

export const dev = (): void => {
  writeTSConfig()

  runCmd('cjs')

  if (fs.existsSync(mjsOutDir)) {
    fs.rmSync(mjsOutDir, { recursive: true })
  }
}

export const build = (): void => {
  writeTSConfig()

  runCmd('cjs')
  runCmd('mjs')

  if (!argv.flag.node) return
  nodeCode()
}
