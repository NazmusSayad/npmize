#!/usr/bin/env node

import getPkgManager from './getPkgManager.js'
import Builder from './Builder.js'
import isDepsInstalled, { installDevPackage } from './isDepsInstalled.js'
import copyData from './copyData.js'
import makeSrc from './makeSrc.js'

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
  case 'dev':
    builder.dev()
    break
  case 'build':
    builder.build()
    break
}
