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

  runCmd(m === 'cjs' ? cjsOutDir : mjsOutDir, m, {
    watch: true,
    writePkg: true,
  })
}

export const build = (): void => {
  const cjsFiles = runCmd(cjsOutDir, 'cjs', {
    writePkg: argv.isLegacy,
    files: true,
  })
  const mjsFiles = runCmd(mjsOutDir, 'mjs', {
    writePkg: argv.isLegacy,
    files: true,
  })

  if (argv.flag.node) {
    nodeCode(
      mjsFiles.filter((file) => {
        return file.endsWith('.js') || file.endsWith('.mjs')
      })
    )
  }

  if (!argv.isLegacy) {
    updateImports('cjs', cjsFiles)
    updateImports('mjs', mjsFiles)
  }
}
