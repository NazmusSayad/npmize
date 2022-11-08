import argv from './argv.js'
import Builder from './Builder.js'
import initPkgJSON from './scripts/initPkgJSON.js'
import ignoreData from './scripts/ignoreData.js'
import makeSrc from './scripts/makeSrc.js'
import packageManager from './scripts/packageManager.js'

argv.flag['no-install'] || packageManager()
argv.flag['no-ignore'] || ignoreData()
argv.flag['no-src'] || makeSrc()

const builder = new Builder()

switch (argv.cmd) {
  case 'init':
    initPkgJSON()
    break

  case 'dev':
    builder.dev()
    break

  case 'build':
    builder.build()
    break

  case '':
    console.log('No command found')
    process.exit(1)

  default:
    console.log('Unknown command')
    process.exit(1)
}
