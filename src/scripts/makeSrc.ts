import fs from 'fs'
import path from 'path'
import { srcDir } from '../config'

const defaultCode = `console.log('Hello, world!');
export default 'Hello, world!';`

export default (): void => {
  const srcFileTsPath = path.join(srcDir, './index.ts')
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true })

  if (
    fs.existsSync(path.join(srcDir, './index.js')) ||
    fs.existsSync(path.join(srcDir, './index.jsx')) ||
    fs.existsSync(path.join(srcDir, './index.tsx')) ||
    fs.existsSync(srcFileTsPath)
  ) {
    return
  }

  fs.writeFileSync(srcFileTsPath, defaultCode)
}
