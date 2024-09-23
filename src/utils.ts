import fs from 'fs'
import path from 'path'
import crossSpawn from 'cross-spawn'
import packageJSON from './scripts/packageJSON'
import config from './config'

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

export function getNodeModulesTempDir(baseDir: string, suffix: string) {
  const nodeModulesDir = path.join(baseDir, './node_modules/' + config.name)
  const outDir = './.temp-dist-' + suffix

  if (fs.existsSync(nodeModulesDir)) {
    return path.join(nodeModulesDir, outDir)
  } else {
    const nodeModulesDir = path.join(baseDir, './node_modules')
    if (fs.existsSync(nodeModulesDir)) {
      return path.join(nodeModulesDir, outDir)
    }
  }

  throw new Error('Could not find node_modules directory')
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
  const nodeVersion = crossSpawn.sync('node', ['-v']).stdout.toString().trim()
  if (nodeVersion) {
    return Number.parseInt(nodeVersion.replace('v', ''))
  }
}

export function getAllFiles(dir: string): string[] {
  const getTarget = (target: string): string[] => {
    if (fs.statSync(target).isFile()) return [target]

    return fs
      .readdirSync(target)
      .flatMap((file) => getTarget(path.join(target, file)))
  }

  return getTarget(dir)
}
