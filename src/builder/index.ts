 import runCmd from './runCmd'
import { cjsOutDir, mjsOutDir } from '../config'
import argv from '../argv'
import nodeCode from './nodeCode'
import { deleteDir, getModule } from '../utils/utils'
import updateImports from '../updateImports'

export const dev = (): void => {
  deleteDir(cjsOutDir)
  deleteDir(mjsOutDir)

  const m = getModule('cjs')
  runCmd(m === 'cjs' ? cjsOutDir : mjsOutDir, m, { watch: true })
}

export const build = (): void => {
  const options = { files: true, writePkg: argv.isLegacy }
  const moduleType = getModule()

  function buildCJS() {
    const cjsOutput = runCmd(cjsOutDir, 'cjs', options)
    if (!argv.isLegacy) {
      updateImports('cjs', cjsOutput)
    }
  }

  function buildMJS() {
    const mjsOutput = runCmd(mjsOutDir, 'mjs', options)

    if (argv.flag.node) {
      const jsMjs = mjsOutput.filter((file) => {
        return file.endsWith('.js') || file.endsWith('.mjs')
      })
      nodeCode(jsMjs)
    }

    if (!argv.isLegacy) {
      updateImports('mjs', mjsOutput)
    }
  }

  if (moduleType === 'cjs') buildCJS()
  else if (moduleType === 'mjs') buildMJS()
  else {
    buildCJS()
    buildMJS()
  }
}
