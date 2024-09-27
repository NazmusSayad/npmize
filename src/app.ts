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
      description: 'Name of the package',
      type: NoArg.string().default('.').ask("What's the name of the package?"),
    },
  ],

  flags: {
    pkg: NoArg.boolean().default(true).description('Make package.json with needed fields'),
    tsconfig: NoArg.boolean().default(true).description('Write "tsconfig.json"'),
    workflow: NoArg.boolean().default(true).description('Write a workflow file'),
    install: NoArg.boolean().default(true).description('Install needed npm packages'),
    sample: NoArg.boolean().default(true).description('Write a sample file ./src/index.ts'),
    ignore: NoArg.boolean().default(true).description("Write '.gitignore' and '.npmignore'"),

    npmignore: NoArg.boolean().default(true).description('Write .npmignore'),
    gitignore: NoArg.boolean().default(true).description('Write .gitignore'),
  },
})

const devAndBuild = NoArg.defineConfig({
  optionalArguments: [
    {
      name: 'root',
      description: 'Root directory of the package',
      type: NoArg.string().description('Root directory'),
    },
  ],

  flags: {
    module: NoArg.string('cjs', 'mjs').aliases('m').description('Output module type .cjs or .mjs'),

    node: NoArg.boolean()
      .aliases('n')
      .default(false)
      .description('Enable __dirname and __filename in ES modules'),
  },

  notes: [
    `Arguments after "${ansiColors.yellow(
      '--tsc'
    )}" will be passed to ${ansiColors.yellow('TypeScript')} compiler.`,

    ['--project', '--module', '--outDir', '--watch']
      .map((flag) => ansiColors.yellow(flag))
      .join(', ') + ' and their aliases are ignored.',
  ],

  trailingArguments: '--tsc',
  customRenderHelp: { helpUsageTrailingArgsLabel: '[TypeScript Args]' },
})

export const dev = app.create('dev', {
  ...devAndBuild,
  description: 'Start the development compiler',
  flags: {
    ...devAndBuild.flags,
    focus: NoArg.string('cjs', 'mjs')
      .aliases('f')
      .default('mjs')
      .description('Focus the typescript compilation process of a specific module'),
  },
})

export const build = app.create('build', {
  ...devAndBuild,
  description: 'Build the package for production',
  flags: {
    ...devAndBuild.flags,
    worker: NoArg.boolean()
      .aliases('w')
      .default(false)
      .description('Run the build process in a worker thread'),
  },
})
