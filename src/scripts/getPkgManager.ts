import { existsSync } from 'fs'
import path from 'path'

export default () => {
  const nodeModules = path.resolve('./node_modules')
  const npmLock = existsSync(path.join(nodeModules, '.package-lock.json'))
  const pnpmLock = existsSync(path.join(nodeModules, '.modules.yaml'))
  const yarnLock = existsSync(path.join(nodeModules, '.yarn-integrity'))

  if (+npmLock + +pnpmLock + +yarnLock > 1) {
    throw new Error('Unable to get package manager.')
  }

  return npmLock ? 'npm' : yarnLock ? 'yarn' : pnpmLock ? 'pnpm' : null
}
