import Builder from './Builder.js'
import getPkgManager from './scripts/getPkgManager.js'
import isDepsInstalled, {
  installDevPackage,
} from './scripts/isDepsInstalled.js'
import copyData from './scripts/copyData.js'
import makeSrc from './scripts/makeSrc.js'
import initPkgJSON from './scripts/initPkgJSON.js'

const requiredPackages = ['typescript', '@types/node']

const pkgManager = getPkgManager()
const depsStatus = isDepsInstalled(requiredPackages)

if (depsStatus) {
  for (let key in depsStatus)
    depsStatus[key] || installDevPackage(pkgManager, key)
} else {
  installDevPackage(pkgManager, ...requiredPackages)
}

copyData(
  {
    path: './.gitignore',
    lines: ['dist-cjs', 'dist-mjs'],
  },
  {
    path: './.npmignore',
    lines: [
      '*',
      '!lib/**',
      '!dist-cjs/**',
      '!dist-mjs/**',
      '!package.json',
      '!README.md',
    ],
  }
)

makeSrc()

const builder = new Builder()
switch (process.argv[2]) {
  case 'init':
    initPkgJSON()
    break
  case 'dev':
  case 'start':
    builder.dev()
    break
  case 'build':
    builder.build()
    break
}
