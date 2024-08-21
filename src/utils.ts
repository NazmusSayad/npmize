import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'
import config from './config'
import packageJSON from './scripts/packageJSON'

export function cleanDir(dir: string, createDir = true) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  if (createDir) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getVersion() {
  return packageJSON.read(path.join(__dirname, '../')).version
}

export function getNodeModulesTempDir(baseDir: string) {
  const nodeModulesDir = path.join(baseDir, './node_modules/' + config.name)

  if (fs.existsSync(nodeModulesDir)) {
    return path.join(nodeModulesDir, config.tempOutDir)
  } else {
    const nodeModulesDir = path.join(baseDir, './node_modules')
    if (fs.existsSync(nodeModulesDir)) {
      return path.join(nodeModulesDir, config.tempOutDir)
    }
  }

  return path.join(baseDir, config.tempOutDir)
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
