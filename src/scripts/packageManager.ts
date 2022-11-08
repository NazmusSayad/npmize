import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import { getPackageData } from '../utils/utils.js'
const requiredPackages = ['typescript', '@types/node']

export const getPkgManager = (): 'npm' | 'yarn' | 'pnpm' => {
  const nodeModules = path.resolve('./node_modules')
  const npmLock = fs.existsSync(path.join(nodeModules, '.package-lock.json'))
  const pnpmLock = fs.existsSync(path.join(nodeModules, '.modules.yaml'))
  const yarnLock = fs.existsSync(path.join(nodeModules, '.yarn-integrity'))

  if (+npmLock + +pnpmLock + +yarnLock > 1) {
    throw new Error('Unable to get package manager.')
  }

  return npmLock ? 'npm' : yarnLock ? 'yarn' : pnpmLock ? 'pnpm' : 'npm'
}

export const installDevPackage = (pkm, ...packageNames: string[]): void => {
  const installCmd = pkm === 'yarn' ? 'add' : 'install'
  shell.exec(`${pkm} ${installCmd} -D ${packageNames.join(' ')}`)
}

export const isDepsInstalled = (targetDeps: string[]) => {
  const pkgData = getPackageData()

  const result = {}
  targetDeps.forEach((dep) => {
    result[dep] = Boolean(
      pkgData.dependencies[dep] || pkgData.devDependencies[dep]
    )
  })

  return result
}

export default (): void => {
  const depsStatus = isDepsInstalled(requiredPackages)
  const pkm = getPkgManager()

  if (depsStatus) {
    for (let key in depsStatus) depsStatus[key] || installDevPackage(pkm, key)
  } else {
    installDevPackage(pkm, ...requiredPackages)
  }
}
