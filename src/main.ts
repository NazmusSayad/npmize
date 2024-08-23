import path from 'path'
import config from './config'
import dev from './program/dev'
import NoArg from 'noarg'
import init from './program/init'
import build from './program/build'
import { getVersion } from './utils'
import ansiColors from 'ansi-colors'
import { readTSConfig } from './scripts/tsconfig'

const app = NoArg.create(config.name, {
  description: config.description,
  flags: {
    version: NoArg.boolean().aliases('v').description('Show the version'),
  },
}).on((_, flags) => {
  if (flags.version) {
    console.log(getVersion())
  } else app.renderHelp()
})

app
  .create('init', {
    description: 'Initialize a new npm package',

    arguments: [
      {
        name: 'name',
        type: NoArg.string()
          .description('Name of the package')
          .ask("What's the name of the package?")
          .default('.'),
      },
    ],

    flags: {
      pkg: NoArg.boolean().default(true).description("Write 'package.json'"),
      install: NoArg.boolean().default(true).description('Install TypeScript'),
      tsconfig: NoArg.boolean()
        .default(true)
        .description('Write "tsconfig.json"'),
      demo: NoArg.boolean().default(true).description('Write a sample file'),
      workflow: NoArg.boolean()
        .default(true)
        .description('Write a workflow file'),

      ignore: NoArg.boolean()
        .default(true)
        .description("Write '.gitignore' and '.npmignore'"),
      npmignore: NoArg.boolean()
        .default(true)
        .description("Write '.npmignore'"),
      gitignore: NoArg.boolean()
        .default(true)
        .description("Write '.gitignore'"),
    },
  })
  .on(([nameArg = '.'], flags) => {
    const root = path.resolve(nameArg)

    init(root, {
      writeSample: flags.demo,
      writePackageJSON: flags.pkg,
      installPackages: flags.install,
      writeGitIgnore: flags.ignore && flags.gitignore,
      writeNpmIgnore: flags.ignore && flags.npmignore,
      writeTSConfig: flags.tsconfig,
      ghWorkflow: flags.workflow,
    })
  })

const devAndBuild = NoArg.createConfig({
  optionalArguments: [
    {
      name: 'root',
      type: NoArg.string().description('Root directory'),
    },
  ],

  flags: {
    module: NoArg.string('cjs', 'mjs')
      .aliases('m')
      .description("Output module's type"),

    outDir: NoArg.string().aliases('o').description('Output directory'),

    node: NoArg.boolean()
      .aliases('n')
      .default(false)
      .description('Enable __dirname and __filename in ES modules'),
  },

  config: {
    enableTrailingArgs: true,
    trailingArgsSeparator: '--tsc',
  },

  notes: [
    `Arguments after "${ansiColors.yellow(
      '--tsc'
    )}" will be passed to ${ansiColors.yellow('TypeScript')} compiler.`,

    ['--project', '--module', '--outDir', '--watch']
      .map((flag) => ansiColors.yellow(flag))
      .join(', ') + ' and their aliases are ignored.',
  ],
})

app
  .create('dev', {
    description: 'Start a development',
    ...devAndBuild,
  })
  .on(([rootArg = '.', railingArgs], options) => {
    const rootPath = path.resolve(rootArg)
    const tsConfig = readTSConfig(rootPath)

    dev(rootPath, {
      ...options,
      tsc: railingArgs,
      outDir: path.join(
        rootPath,
        options.outDir ?? tsConfig?.outDir ?? config.defaultOutDir
      ),
    })
  })

app
  .create('build', {
    description: 'Build the package for production',
    ...devAndBuild,
  })
  .on(([rootArg = '.', railingArgs], options) => {
    const rootPath = path.resolve(rootArg)
    const tsConfig = readTSConfig(rootPath)

    build(rootPath, {
      ...options,
      tsc: railingArgs,
      outDir: path.join(
        rootPath,
        options.outDir ?? tsConfig?.outDir ?? config.defaultOutDir
      ),
    })
  })

export default app
