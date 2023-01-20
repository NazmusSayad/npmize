import argv from '../argv'
import { writeJOSN, readJOSN } from '../utils/utils'
import {
  defaultTSConfigPath,
  packageJsonPath,
  userTSConfigPath,
} from '../config'

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

  pkgData.scripts ??= {}
  pkgData.scripts.dev = 'npm-ez dev'
  pkgData.scripts.build = 'npm-ez build'

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
