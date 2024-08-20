import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'

export function cleanDir(dir: string, createDir = true) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  if (createDir) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getVersion() {
  try {
    const packageJSON = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
    )
    return 'v' + packageJSON.version
  } catch {
    return 'Something went wrong!'
  }
}

export function moveFiles(
  baseDir: string,
  outDir: string,
  data: Record<string, string>
) {
  const newPaths = [] as string[]

  for (const key in data) {
    const oldRelative = path.relative(baseDir, key)
    const outPath = path.join(outDir, oldRelative)

    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
    }

    fs.writeFileSync(outPath, data[key])
    newPaths.push(outPath)
  }

  return newPaths
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
