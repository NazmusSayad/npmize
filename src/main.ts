import path from 'path'
import * as app from './app'
import dev from './program/dev'
import init from './program/init'
import build from './program/build'
import { getVersion } from './utils'
import ansiColors from 'ansi-colors'
import { readTSConfig } from './scripts/tsconfig'

app.app.on((_, flags) => {
  if (flags.version) {
    console.log(getVersion())
  } else app.app.renderHelp()
})

app.init.on(([name = '.'], flags) => {
  const root = path.resolve(name)

  init(root, {
    writeSample: flags.sample,
    writePackageJSON: flags.pkg,
    installPackages: flags.install,
    writeGitIgnore: flags.ignore && flags.gitignore,
    writeNpmIgnore: flags.ignore && flags.npmignore,
    writeTSConfig: flags.tsconfig,
    ghWorkflow: flags.workflow,
  })
})

app.dev.on(([root = '.', railingArgs], options) => {
  const rootPath = path.resolve(root)
  const tsConfig = readTSConfig(rootPath)

  if (!tsConfig) {
    return console.log(
      ansiColors.bgRed(' ERROR: '),
      'Could not find "tsconfig.json"'
    )
  }

  if (!tsConfig?.outDir) {
    return console.log(
      ansiColors.bgRed(' ERROR: '),
      'The "outDir" option is required in "tsconfig.json"'
    )
  }

  dev(rootPath, {
    ...options,
    tsc: railingArgs,
    tsConfig: { ...tsConfig, outDir: tsConfig.outDir },
  })
})

app.build.on(([root = '.', railingArgs], options) => {
  const rootPath = path.resolve(root)
  const tsConfig = readTSConfig(rootPath)

  if (!tsConfig) {
    return console.log(
      ansiColors.bgRed(' ERROR: '),
      'Could not find "tsconfig.json"'
    )
  }

  if (!tsConfig?.outDir) {
    return console.log(
      ansiColors.bgRed(' ERROR: '),
      'The "outDir" option is required in "tsconfig.json"'
    )
  }

  build(rootPath, {
    ...options,
    tsc: railingArgs,
    tsConfig: { ...tsConfig, outDir: tsConfig.outDir },
  })
})
