import fs from 'fs'

const varName =
  'VGhpcyBuYW1lIGlzIGFscmVhZHkgdXNlZCB0byBlbmFibGUgX19kaXJuYW1lIGFuZCBfX2ZpbGVuYW1lIDop'
const urlModule = `import{fileURLToPath as ${varName}}from'url';`
const filename = `let __filename=${varName}(import.meta.url);`
const dirname = `let __dirname=${varName}(new URL('.',import.meta.url));`
const nodeCode = urlModule + filename + dirname + '\n'

export default (files: string[]) => {
  files.forEach((file) => {
    let data: string = fs.readFileSync(file, 'utf-8')

    if (data.startsWith('#!')) {
      const dataLines = data.split('\n')
      dataLines.splice(1, 0, nodeCode)
      data = dataLines.join('\n')
    } else {
      data = nodeCode + data
    }

    fs.writeFileSync(file, data)
  })
}
