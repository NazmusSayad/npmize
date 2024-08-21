import path from 'path'
import config from './config'
import dev from './program/dev'
import NoArg, { t } from 'noarg'
import init from './program/init'
import build from './program/build'
import tsconfigJSON from './scripts/tsconfigJSON'
import { getVersion } from './utils'

const app = NoArg.create(config.name, {
  description: config.description,

  flags: {
    version: t.boolean().aliases('v').description('Show the version'),
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
        type: t
          .string()
          .description('Name of the package')
          .ask("What's the name of the package?")
          .default('.'),
      },
    ],

    flags: {
      pkg: t.boolean().default(true).description("Write 'package.json'"),
      install: t.boolean().default(true).description('Install TypeScript'),
      tsconfig: t.boolean().default(true).description('Write "tsconfig.json"'),
      demo: t.boolean().default(true).description('Write a sample file'),
      workflow: t.boolean().default(true).description('Write a workflow file'),

      ignore: t
        .boolean()
        .default(true)
        .description("Write '.gitignore' and '.npmignore'"),
      npmignore: t.boolean().default(true).description("Write '.npmignore'"),
      gitignore: t.boolean().default(true).description("Write '.gitignore'"),
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

const devAndBuild = {
  optionalArguments: [
    {
      name: 'root',
      type: t.string().description('Root directory'),
    },
  ],

  flags: {
    module: t
      .string('cjs', 'mjs')
      .aliases('m')
      .description("Output module's type"),

    outDir: t.string().aliases('o').description('Output directory'),

    tsc: t
      .array(t.string())
      .aliases('t')
      .default([])
      .description("TypeScript's options"),

    node: t
      .boolean()
      .aliases('n')
      .default(false)
      .description('Enable __dirname and __filename in ES modules'),
  },
}

app
  .create('dev', {
    description: 'Start a development',
    ...devAndBuild,
  })
  .on(([rootArg = '.'], options) => {
    const rootPath = path.resolve(rootArg as string)
    dev(rootPath, {
      ...options,
      outDir: options.outDir
        ? path.join(rootPath, options.outDir)
        : path.join(
            rootPath,
            tsconfigJSON.read(rootPath)?.compilerOptions?.outDir ??
              config.defaultOutDir
          ),
    })
  })

app
  .create('build', {
    description: 'Build the package for production',
    ...devAndBuild,
  })
  .on(([rootArg = '.'], options) => {
    const rootPath = path.resolve(rootArg as string)
    build(rootPath, {
      ...options,
      outDir: options.outDir
        ? path.join(rootPath, options.outDir)
        : path.join(
            rootPath,
            tsconfigJSON.read(rootPath)?.compilerOptions?.outDir ??
              config.defaultOutDir
          ),
    })
  })

export default app
