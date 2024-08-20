import fs from 'fs'
import { writeFileSync } from '../utils'

const varName =
  '_____VGhpcyBuYW1lIGlzIHVzZWQgdG8gZW5hYmxlIF9fZGlybmFtZSBhbmQgX19maWxlbmFtZSDwn5iK_____'
const urlModule = `import{fileURLToPath as ${varName}}from'url';`
const filename = `var __filename=${varName}(import.meta.url);`
const dirname = `var __dirname=${varName}(new URL('.',import.meta.url));`
const nodeCode = `/* START: AUTO-GENERATED CODE */
/**
 * This code snippets enables '__dirname' and '__filename' in ES modules.
 * It will only work in "Node.js" environment.
 * It is will cause an error in the "Browser".
 * It is not needed in "CommonJS" modules.
 */
${urlModule}${filename}${dirname}
/* END: AUTO-GENERATED CODE */
`

export default (...files: string[]) => {
  files.forEach((file) => {
    if (file.endsWith('ts')) return
    let data = fs.readFileSync(file, 'utf-8')
    if (!(data.includes('__dirname') || data.includes('__filename'))) return

    if (data.startsWith('#!')) {
      const dataLines = data.split('\n')
      dataLines.splice(1, 0, nodeCode)
      data = dataLines.join('\n')
    } else {
      data = nodeCode + data
    }

    writeFileSync(file, data)
  })
}
