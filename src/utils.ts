import fs from 'fs'
import path from 'path'

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
