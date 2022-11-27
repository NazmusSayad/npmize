import fs from 'fs'
import path from 'path'
import { srcPath } from '../config'

const defaultCode = `console.log('Hello, world!');
export default 'Hello, world!';`

export default (): void => {
  const srcFileTsPath = path.join(srcPath, './index.ts')
  if (!fs.existsSync(srcPath)) fs.mkdirSync(srcPath, { recursive: true })

  if (
    fs.existsSync(path.join(srcPath, './index.js')) ||
    fs.existsSync(path.join(srcPath, './index.jsx')) ||
    fs.existsSync(path.join(srcPath, './index.tsx')) ||
    fs.existsSync(srcFileTsPath)
  ) {
    return
  }

  fs.writeFileSync(srcFileTsPath, defaultCode)
}
