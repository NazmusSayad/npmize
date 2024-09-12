import NoArg from 'noarg'
import config from './config'
import { getVersion } from './utils'
import ansiColors from 'ansi-colors'

export const app = NoArg.create(config.name, {
  description: config.description,
  flags: {
    version: NoArg.boolean().aliases('v').description('Show the version'),
  },
}).on((_, flags) => {
  if (flags.version) {
    console.log(getVersion())
  } else app.renderHelp()
})

export const init = app.create('init', {
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
    npmignore: NoArg.boolean().default(true).description("Write '.npmignore'"),
    gitignore: NoArg.boolean().default(true).description("Write '.gitignore'"),
  },
})

const devAndBuild = NoArg.defineConfig({
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

    node: NoArg.boolean()
      .aliases('n')
      .default(false)
      .description('Enable __dirname and __filename in ES modules'),
  },

  trailingArguments: '--tsc',

  notes: [
    `Arguments after "${ansiColors.yellow(
      '--tsc'
    )}" will be passed to ${ansiColors.yellow('TypeScript')} compiler.`,

    ['--project', '--module', '--outDir', '--watch']
      .map((flag) => ansiColors.yellow(flag))
      .join(', ') + ' and their aliases are ignored.',
  ],
})

export const dev = app.create('dev', {
  description: 'Start a development',
  ...devAndBuild,
})

export const build = app.create('build', {
  description: 'Build the package for production',
  ...devAndBuild,
})
