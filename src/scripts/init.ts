import {
  defaultTSConfigPath,
  packageJsonPath,
  userTSConfigPath,
} from '../config'
import argv from '../argv'
import { writeJSON, readJSON, getDirName } from '../utils/utils'

export const writeTSConfig = (): void => {
  const finalConf = readJSON(userTSConfigPath)

  Object.assign(
    (finalConf.compilerOptions ??= {}),
    readJSON(defaultTSConfigPath).compilerOptions ?? {}
  )
  finalConf.include = ['src']

  writeJSON(userTSConfigPath, finalConf)
}

const getPath = (path, ext, type) => path + '.' + (argv.isLegacy ? ext : type)
const writePackageJSON = (): void => {
  const pkgData = readJSON(packageJsonPath)
  const cjsRoot = getPath('./dist-cjs/index', 'js', 'cjs')
  const mjsRoot = getPath('./dist-mjs/index', 'js', 'mjs')
  const typesRoot = getPath('./dist-mjs/index.d', 'ts', 'mts')

  pkgData.name ??= getDirName()
  pkgData.version ??= '0.0.0'

  pkgData.scripts ??= {}
  pkgData.scripts.dev = 'jspac dev'
  pkgData.scripts.build = 'jspac build'

  pkgData.main = cjsRoot
  pkgData.module = mjsRoot
  pkgData.exports = {
    '.': {
      require: cjsRoot,
      import: mjsRoot,
      types: typesRoot,
    },
  }

  if (argv.flag['bin']) {
    pkgData.bin = getPath('./dist-cjs/bin', 'js', 'cjs')
  }

  writeJSON(packageJsonPath, pkgData)
}

export default (): void => {
  writeTSConfig()
  writePackageJSON()
}
