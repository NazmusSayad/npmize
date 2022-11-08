import argv from '../argv.js'
import { getPackageData, getPackagePath, writeJOSN } from '../utils/utils.js'

export default (): void => {
  const pkgData = getPackageData()
  const isOnlyBinMode = argv.flag['only-bin']
  const addBin = isOnlyBinMode || argv.flag['bin']

  pkgData.scripts ||= {}
  pkgData.dev = 'npm-ez dev'
  pkgData.build = 'npm-ez build'

  if (addBin) {
    pkgData.bin = {
      [pkgData.name || 'your-command']: './dist-cjs/bin/index.js',
    }
  }

  if (isOnlyBinMode) {
    pkgData.main = './dist-cjs/bin/index.js'
    pkgData.types = './dist-cjs/bin/index.d.js'
  } else {
    pkgData.main = './dist-mjs/index.js'
    pkgData.types = './dist-mjs/index.d.js'
    pkgData.exports = {
      '.': {
        require: './dist-cjs/index.js',
        import: './dist-mjs/index.js',
      },
    }
  }

  writeJOSN(getPackagePath(), pkgData)
}
