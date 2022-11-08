import fs from 'fs'
import path from 'path'

export default (): void => {
  const srcPath = path.resolve('./src')
  const srcFilePath = path.join(srcPath, './index.ts')

  const srcExists = fs.existsSync(srcPath)
  const srcFileExists = fs.existsSync(srcFilePath)

  if (!srcExists) {
    fs.mkdirSync(srcPath, { recursive: true })
    return fs.writeFileSync(srcFilePath, '')
  }

  if (!srcFileExists) {
    fs.writeFileSync(srcFilePath, '')
  }
}
