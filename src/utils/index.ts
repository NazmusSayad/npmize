import fs from 'fs'
import path from 'path'
import crossSpawn from 'cross-spawn'
import packageJSON from '../scripts/packageJSON'
import config from '../config'

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

export function getNodeVersion() {
  const nodeVersion = crossSpawn.sync('node', ['-v']).stdout.toString().trim()
  if (nodeVersion) {
    return Number.parseInt(nodeVersion.replace('v', ''))
  }
}
