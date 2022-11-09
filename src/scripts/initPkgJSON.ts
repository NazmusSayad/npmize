import argv from '../argv.js'
import { getPackagePath, writeJOSN, readJOSN } from '../utils/utils.js'

export default (): void => {
  const pkgData = readJOSN(getPackagePath())
  const isOnlyBinMode = argv.flag['bin-mode']
  const addBin = isOnlyBinMode || argv.flag['bin']

  pkgData.scripts ||= {}
  pkgData.scripts.dev = 'npm-ez dev'
  pkgData.scripts.build = 'npm-ez build'

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
