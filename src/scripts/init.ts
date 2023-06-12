import {
  defaultTSConfigPath,
  packageJsonPath,
  userTSConfigPath,
} from '../config'
import argv from '../argv'
import { writeJOSN, readJOSN, getDirName } from '../utils/utils'

export const writeTSConfig = (): void => {
  const finalConf = readJOSN(userTSConfigPath)

  Object.assign(
    (finalConf.compilerOptions ??= {}),
    readJOSN(defaultTSConfigPath).compilerOptions ?? {}
  )
  finalConf.include = ['src']

  writeJOSN(userTSConfigPath, finalConf)
}

const getPath = (path, ext, type) => path + '.' + (argv.isLegacy ? ext : type)
const writePackageJSON = (): void => {
  const pkgData = readJOSN(packageJsonPath)
  const cjsRoot = getPath('./dist-cjs/index', 'js', 'cjs')
  const mjsRoot = getPath('./dist-mjs/index', 'js', 'mjs')
  const typesRoot = getPath('./dist-mjs/index', 'ts', 'mts')

  pkgData.name ??= getDirName()
  pkgData.version ??= '0.0.0'

  pkgData.scripts ??= {}
  pkgData.scripts.dev = 'npmkit dev'
  pkgData.scripts.build = 'npmkit build'

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

  writeJOSN(packageJsonPath, pkgData)
}

export default (): void => {
  writeTSConfig()
  writePackageJSON()
}
