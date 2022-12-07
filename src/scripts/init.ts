import argv from '../argv.js'
import { getPackagePath, writeJOSN, readJOSN } from '../utils/utils.js'
import { defaultTSConfigPath, userTSConfigPath } from '../config.js'

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
  const pkgData = readJOSN(getPackagePath())
  const isOnlyBinMode = argv.flag['bin-only']
  const addBin = isOnlyBinMode || argv.flag['bin']

  pkgData.scripts ||= {}
  pkgData.scripts.dev = 'npm-ez dev'
  pkgData.scripts.build = 'npm-ez build'

  if (addBin) {
    pkgData.bin = './dist-cjs/bin.js'
  }

  if (isOnlyBinMode) {
    pkgData.main = './dist-cjs/bin.js'
    pkgData.module = './dist-mjs/bin.js'
    pkgData.types = './dist-cjs/bin.d.js'
  } else {
    pkgData.main = './dist-mjs/index.js'
    pkgData.module = './dist-mjs/index.js'
    pkgData.types = './dist-mjs/index.d.js'

    pkgData.exports = {
      '.': {
        require: {
          path: './dist-mjs/index.js',
          type: 'commonjs',
        },
        import: {
          path: './dist-mjs/index.js',
          type: 'module',
        },
      },
    }
  }

  writeJOSN(getPackagePath(), pkgData)
}

export default (): void => {
  writeTSConfig()
  writePackageJSON()
}
