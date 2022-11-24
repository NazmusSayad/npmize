import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import lsFiles from 'node-ls-files'
import argv from './argv.js'
import { readJOSN, writeJOSN, cleanDir } from './utils/utils.js'

class Builder {
  #libDir = path.join(__dirname, '../lib')
  #defaultTsconfig = path.join(this.#libDir, './tsconfig-default.json')
  #tempTSConfig = path.join(this.#libDir, './tsconfig.json')
  #rootDir = path.resolve('./src')

  dev(): void {
    this.#writeTempTsonfig()
    this.#runCmd('cjs', {
      watch: true,
    })
  }

  build(): void {
    console.log('Build started...')

    this.#writeTempTsonfig()
    this.#runCmd('cjs')

    const outputDir = this.#runCmd('mjs')
    // fs.rmSync(this.#tempTSConfig)

    // @ts-ignore
    if (!argv.flag.node) return

    const files = lsFiles.sync(outputDir, {
      filter: /\.m?js$/,
    })
    files.forEach((file) => this.#prependNodeCode(file))
  }

  #runCmd(type: 'cjs' | 'mjs', { watch = false } = {}): string {
    const outDir = path.resolve(`./dist-${type}`)
    const outputModule = type === 'cjs' ? 'commonjs' : 'es6'

    cleanDir(outDir)
    this.#addPackageData(outDir, type === 'cjs' ? 'commonjs' : 'module')

    const command = [
      'tsc',
      `--project ${this.#tempTSConfig}`,
      `--rootDir ${this.#rootDir}`,
      `--baseUrl ${this.#rootDir}`,
      `--outDir ${outDir}`,
      `--module ${outputModule}`,
      watch && '--watch',
    ]

    const optimizeCommand = command.filter((o) => o).join(' ')
    shell.exec(optimizeCommand, { async: watch })
    return outDir
  }

  #addPackageData(outDir: string, type: 'commonjs' | 'module'): void {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    writeJOSN(path.join(outDir, './package.json'), { type })
  }

  #prependNodeCode(file: string): void {
    let data: string = fs.readFileSync(file, 'utf-8')

    if (data.startsWith('#!')) {
      const dataLines = data.split('\n')
      dataLines.splice(1, 0, this.#__nodeCode)
      data = dataLines.join('\n')
    } else {
      data = this.#__nodeCode + data
    }

    fs.writeFileSync(file, data)
  }

  #writeTempTsonfig() {
    const { compilerOptions = {} } = readJOSN(path.resolve('./tsconfig.json'))
    const userTypeRoots = compilerOptions.typeRoots ?? []

    const tempTsConf = {
      extends: this.#defaultTsconfig,
      include: [this.#rootDir],
      compilerOptions: {
        ...compilerOptions,
        typeRoots: [
          path.resolve('./node_modules/@types'),
          ...userTypeRoots.map((tr) => path.resolve(tr)),
        ],
      },
    }
    writeJOSN(this.#tempTSConfig, tempTsConf)
  }

  #__var =
    'VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop'
  #__import = `import{fileURLToPath as ${this.#__var}}from'url';`
  #__filename = `let __filename=${this.#__var}(import.meta.url);`
  #__dirname = `let __dirname=${this.#__var}(new URL('.',import.meta.url));`
  #__nodeCode = this.#__import + this.#__dirname + this.#__filename + '\n'
}

export default Builder
