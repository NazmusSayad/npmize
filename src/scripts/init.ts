import argv from '../argv.js'
import { writeJOSN, readJOSN } from '../utils/utils.js'
import {
  defaultTSConfigPath,
  packageJsonPath,
  userTSConfigPath,
} from '../config.js'

export const writeTSConfig = (): void => {
  const finalConf = readJOSN(userTSConfigPath)

  Object.assign(
    (finalConf.compilerOptions ??= {}),
    readJOSN(defaultTSConfigPath).compilerOptions ?? {}
  )
  finalConf.include = argv.isLegacy
    ? ['src']
    : ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx']

  writeJOSN(userTSConfigPath, finalConf)
}

const writePackageJSON = (): void => {
  const pkgData = readJOSN(packageJsonPath)
  const cjsRoot = argv.isLegacy ? './dist-cjs/index.js' : './dist-cjs/index.cjs'
  const mjsRoot = argv.isLegacy ? './dist-mjs/index.js' : './dist-mjs/index.mjs'
  const typesRoot = argv.isLegacy
    ? './dist-cjs/index.d.ts'
    : './dist-cjs/index.d.cts'

  pkgData.scripts ||= {}
  pkgData.scripts.dev = 'npm-ez dev'
  pkgData.scripts.build = 'npm-ez build'

  pkgData.exports = {
    '.': {
      require: cjsRoot,
      import: mjsRoot,
      types: typesRoot,
    },
  }

  pkgData.main = cjsRoot
  pkgData.module = mjsRoot

  if (argv.flag['bin']) {
    pkgData.bin = argv.isLegacy ? './dist-cjs/bin.js' : './dist-cjs/bin.cjs'
  }

  writeJOSN(packageJsonPath, { ...pkgData })
}

export default (): void => {
  writeTSConfig()
  writePackageJSON()
}
