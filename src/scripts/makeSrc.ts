import fs from 'fs'
import path from 'path'

const defaultCode = `console.log('Hello, world!');
export default 'Hello, world!';`

export default (): void => {
  const srcPath = path.resolve('./src')
  const srcFileJsPath = path.join(srcPath, './index.ts')
  const srcFileTsPath = path.join(srcPath, './index.ts')

  const srcExists = fs.existsSync(srcPath)
  const srcFileJsExists = fs.existsSync(srcFileJsPath)
  const srcFileTsExists = fs.existsSync(srcFileTsPath)

  if (!srcExists) {
    fs.mkdirSync(srcPath, { recursive: true })
    return fs.writeFileSync(srcFileTsPath, defaultCode)
  }

  if (!srcFileJsExists || !srcFileTsExists) {
    fs.writeFileSync(srcFileTsPath, defaultCode)
  }
}
