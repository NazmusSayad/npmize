import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'

export function cleanDir(dir: string, create = true) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  if (create) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function moveFiles(baseDir: string, outDir: string, files: string[]) {
  return files.map((filePath) => {
    const relativePath = path.relative(baseDir, filePath)
    const outDirFilePath = path.join(outDir, '/' + relativePath)

    if (!fs.existsSync(outDirFilePath)) {
      fs.mkdirSync(path.dirname(outDirFilePath), { recursive: true })
    }

    fs.renameSync(filePath, outDirFilePath)
    return outDirFilePath
  })
}

export function writeFileSync(filePath: string, data: string) {
  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  }
  fs.writeFileSync(filePath, data)
}

export function confirmDir(...paths: string[]) {
  const exactPath = path.join(...paths)

  if (!fs.existsSync(exactPath)) {
    fs.mkdirSync(exactPath, { recursive: true })
  }

  return exactPath
}

export function getNodeVersion() {
  const nodeVersion = shelljs.exec('node -v', { silent: true }).stdout.trim()
  if (nodeVersion) {
    return Number.parseInt(nodeVersion.replace('v', ''))
  }
}
