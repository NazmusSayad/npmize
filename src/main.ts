import path from 'path'
import config from './config'
import NoArg, { t } from 'noarg'
import init from './program/init'
import dev from './program/dev'
import build from './program/build'
import tsconfig from './scripts/tsconfig'

const app = new NoArg(
  config.name,
  { description: config.description },

  () => {}
)

app.create(
  'init',
  {
    description: 'Initialize a new npm package',
    options: {
      name: t.string().default('.').description("The package's name"),
      pkg: t.boolean().default(true).description("Write 'package.json'"),
      install: t.boolean().default(true).description('Install TypeScript'),
      tsconfig: t.boolean().default(true).description('Write "tsconfig.json"'),
      demo: t.boolean().default(true).description('Write a sample file'),

      ignore: t
        .boolean()
        .default(true)
        .description("Write '.gitignore' and '.npmignore'"),
      npmignore: t.boolean().default(true).description("Write '.npmignore'"),
      gitignore: t.boolean().default(true).description("Write '.gitignore'"),
    },
  },

  (_, options) => {
    const root = path.resolve(options.name)
    init(root, {
      writeSample: options.demo,
      writePackageJSON: options.pkg,
      installPackages: options.install,
      writeGitIgnore: options.ignore && options.gitignore,
      writeNpmIgnore: options.ignore && options.npmignore,
      writeTSConfig: options.tsconfig,
    })
  }
)

app.create(
  'dev',
  {
    description: 'Start a development',
    options: {
      root: t.string().default('.').aliases('r').description('Root directory'),

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
    },
  },

  (_, options) => {
    const rootPath = path.resolve(options.root)
    dev(rootPath, {
      ...options,
      outDir: options.outDir
        ? path.join(rootPath, options.outDir)
        : path.join(
            rootPath,
            tsconfig.read(rootPath)?.compilerOptions?.outDir ??
              config.defaultOutDir
          ),
    })
  }
)

app.create(
  'build',
  {
    description: 'Build the package for production',
    options: {
      root: t.string().default('.').aliases('r').description('Root directory'),

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
  },

  (_, options) => {
    const rootPath = path.resolve(options.root)
    build(rootPath, {
      ...options,
      outDir: options.outDir
        ? path.join(rootPath, options.outDir)
        : path.join(
            rootPath,
            tsconfig.read(rootPath)?.compilerOptions?.outDir ??
              config.defaultOutDir
          ),
    })
  }
)

// app.run()

console.clear()
app.run(['init', '--name', '../npmize-test'])
app.run(['build', '--root', '../npmize-test', '-n'])
