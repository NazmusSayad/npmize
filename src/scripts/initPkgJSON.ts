import { getPackageData, getPackagePath, writeJOSN } from '../utils/utils.js'

export default () => {
  const pkgData = getPackageData()
  const isOnlyBinMode = process.argv[3] === 'bin'
  const addBin = isOnlyBinMode || process.argv[3] === '--bin'

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
