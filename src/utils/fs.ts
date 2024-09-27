import fs from 'fs'
import path from 'path'

export function cleanDir(dir: string, createDir = true) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  if (createDir) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function writeFileSync(filePath: string, data: string) {
  autoCreateDir(path.dirname(filePath))
  fs.writeFileSync(filePath, data)
}

export function autoCreateDir(...paths: string[]) {
  const exactPath = path.join(...paths)

  if (!fs.existsSync(exactPath)) {
    fs.mkdirSync(exactPath, { recursive: true })
  }

  return exactPath
}

export function getAllFiles(dir: string): string[] {
  const getTarget = (target: string): string[] => {
    if (fs.statSync(target).isFile()) return [target]

    return fs.readdirSync(target).flatMap((file) => getTarget(path.join(target, file)))
  }

  return getTarget(dir)
}

export function getExistedFilePath(target: string) {
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target
}
