import fs from 'fs'
import path from 'path'
import { srcPath } from '../config'

const defaultCode = `console.log('Hello, world!');
export default 'Hello, world!';`

export default (): void => {
  const srcFileJsPath = path.join(srcPath, './index.js')
  const srcFileTsPath = path.join(srcPath, './index.ts')

  if (!fs.existsSync(srcPath)) fs.mkdirSync(srcPath, { recursive: true })
  if (fs.existsSync(srcFileJsPath) || fs.existsSync(srcFileTsPath)) return

  fs.writeFileSync(srcFileTsPath, defaultCode)
}
