import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import lsFiles from 'node-ls-files'
import { writeJOSN } from './utils/utils.js'

class Builder {
  #libDir = path.join(__dirname, '../lib')

  dev(): void {
    this.#runCmd('cjs', {
      watch: true,
    })
  }

  build(): void {
    this.#runCmd('cjs')

    const outputDir = this.#runCmd('mjs')
    const files = lsFiles.sync(outputDir, {
      filter: /\.m?js$/,
    })
    files.forEach((file) => this.#prependNodeCode(file))
  }

  #runCmd(type: 'cjs' | 'mjs', { watch = false } = {}): string {
    const outputDir = path.resolve(`./dist-${type}`)
    this.#cleanDir(outputDir)
    this.#addPackageData(outputDir, type)

    const projectPath = this.#createTSConfig(type)
    const cmdStr = `tsc -p ${projectPath} --rootDir src --baseUrl src --outDir dist-${type}${
      watch ? ' -w' : ''
    }`

    shell.exec(cmdStr, { async: watch })
    return outputDir
  }

  #createTSConfig(type: 'cjs' | 'mjs'): string {
    const fileName = `./tsconfig-${type}.json`
    const userTsconfPath = path.resolve(fileName)

    let userMjsTsConf: any = {}
    if (fs.existsSync(userTsconfPath)) {
      try {
        userMjsTsConf = JSON.parse(fs.readFileSync(userTsconfPath, 'utf-8'))
      } catch {}
    }

    if (!userMjsTsConf.include) userMjsTsConf.include = ['src']
    else if (!userMjsTsConf.include.includes('src')) {
      userMjsTsConf.include.unshift('src')
    }

    userMjsTsConf.extends = path.join(this.#libDir, fileName)

    writeJOSN(userTsconfPath, userMjsTsConf)
    return fileName
  }

  #cleanDir(dir: string): void {
    if (!fs.existsSync(dir)) return
    const list = fs.readdirSync(dir)
    list.forEach((item) => {
      fs.rmSync(path.join(dir, item), {
        recursive: true,
        force: true,
      })
    })
  }

  #addPackageData(dir: string, type: 'cjs' | 'mjs'): void {
    const content = {
      type: type === 'cjs' ? 'commonjs' : 'module',
    }

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const target = path.join(dir, './package.json')
    fs.writeFileSync(target, JSON.stringify(content))
  }

  #prependNodeCode(file: string): void {
    let data = fs.readFileSync(file, 'utf-8')
    const dirNameRegex = /('|")use __dirname('|");?/gm
    const fileNameRegex = /('|")use __filename('|");?/gm
    const isUsingAnything = dirNameRegex.test(data) || fileNameRegex.test(data)
    if (!isUsingAnything) return

    fs.writeFileSync(
      file,
      this.#__nodeCode +
        data
          .replace(dirNameRegex, this.#__nodeCode__dirname)
          .replace(fileNameRegex, this.#__nodeCode__filename)
    )
  }

  #__nodeCode = `import{fileURLToPath as ______fIlE___UrL___tO___pATh______}from'url';`
  #__nodeCode__filename = `let __filename=______fIlE___UrL___tO___pATh______(import.meta.url);`
  #__nodeCode__dirname = `let __dirname=______fIlE___UrL___tO___pATh______(new URL('.',import.meta.url));`
}

export default Builder
