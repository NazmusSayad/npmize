import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'
import config from '../config'
import ansiColors from 'ansi-colors'
import packageJSON from '../scripts/packageJSON'
import { writeFileSync } from '../utils'
import ghWorkflows from '../scripts/ghWorkflows'
import { updateTSConfig } from '../scripts/tsconfig'

export default function (basePath: string, options: InitOptions) {
  console.log(`\x1b[1m\x1b[35m▓▒░ NPMIZE ░▒▓\x1b[0m\n`)

  if (options.writePackageJSON) {
    const data = packageJSON.read(basePath)

    data.name ??= path.basename(basePath)
    data.version ??= '0.0.0'

    data.scripts ??= {}
    data.scripts.dev = 'npmize dev'
    data.scripts.build = 'npmize build'

    delete data.main
    delete data.module
    delete data.exports

    data.main = './dist/index.cjs'
    data.module = './dist/index.mjs'
    data.exports = {
      '.': {
        require: './dist/index.cjs',
        import: './dist/index.mjs',
      },
    }

    packageJSON.write(basePath, data)
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'package.json is disabled')
  }

  if (options.installPackages) {
    shelljs.cd(basePath).exec('npm install npmize typescript --save-dev')
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'TypeScript is disabled')
  }

  if (options.writeTSConfig) {
    updateTSConfig(
      path.join(basePath, './tsconfig.json'),
      {
        compilerOptions: {
          baseUrl: './src',
          outDir: './dist',

          target: 'ES6' as any,
          skipLibCheck: true,

          declaration: true,
          inlineSourceMap: false,

          strict: true,
          pretty: true,
          removeComments: true,

          paths: {
            '@/*': ['./*'],
          },
        },

        include: ['./src'],
      },
      true
    )
  }

  if (options.writeGitIgnore) {
    updateIgnoreFile('./.gitignore', ['dist', '.npmize', 'node_modules'])
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'Gitignore is disabled')
  }

  if (options.writeNpmIgnore) {
    updateIgnoreFile('./.npmignore', [
      '*',
      '!lib/**',
      '!dist/**',
      '!README.md',
      '!package.json',
    ])
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'Npmignore is disabled')
  }

  if (options.writeSample) {
    const srcPath = path.join(basePath, './src')
    const srcExists = fs.existsSync(srcPath)

    if (srcExists) {
      console.log(
        ansiColors.bgYellow(' WARN: '),
        "'./src/index.ts' folder already exists"
      )
    } else {
      fs.mkdirSync(srcPath)
      writeFileSync(
        path.join(srcPath, './index.ts'),
        `console.log('Hello, world!')\nexport default 'Hello, world!'`
      )
    }
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'Sample is disabled')
  }

  if (options.ghWorkflow) {
    ghWorkflows(basePath)
  } else {
    console.log(ansiColors.bgGreen(' INFO: '), 'GitHub workflow is disabled')
  }
}

type InitOptions = {
  writeTSConfig: boolean
  writePackageJSON: boolean
  installPackages: boolean
  writeNpmIgnore: boolean
  writeGitIgnore: boolean
  writeSample: boolean
  ghWorkflow: boolean
}

function updateIgnoreFile(path: string, lines: string[]) {
  const fileExists = fs.existsSync(path)
  const fileStr = fileExists ? fs.readFileSync(path, 'utf-8') : ''
  const fileData = fileStr
    .split('\n')
    .filter(Boolean)
    .map((str) => str.trim())

  const missingLines = lines.filter((line) => !fileData.includes(line))
  if (!missingLines.length) return

  const missingTexts = ['# ' + config.name, ...missingLines].join('\n')
  const text = (fileStr + '\n\n' + missingTexts).trim()
  writeFileSync(path, text)
}
