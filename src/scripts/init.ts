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
  finalConf.include = ['src']

  writeJOSN(userTSConfigPath, finalConf)
}

const writePackageJSON = (): void => {
  const pkgData = readJOSN(packageJsonPath)

  pkgData.scripts ||= {}
  pkgData.type = 'commonjs'
  pkgData.scripts.dev = 'npm-ez dev'
  pkgData.scripts.build = 'npm-ez build'

  pkgData.types = './dist-cjs/index.d.ts'
  pkgData.main = './dist-cjs/index.js'
  pkgData.module = './dist-mjs/index.js'

  if (argv.flag['bin']) {
    pkgData.bin = './dist-cjs/bin.js'
  }

  pkgData.exports = {
    '.': {
      require: './dist-cjs/index.js',
      import: './dist-mjs/index.js',
    },
  }

  writeJOSN(packageJsonPath, pkgData)
}

export default (): void => {
  writeTSConfig()
  writePackageJSON()
}
