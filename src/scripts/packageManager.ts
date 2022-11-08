import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import { getPackageData } from '../utils/utils.js'
const requiredPackages = ['typescript', '@types/node']

const checkPackageManager = (
  npm,
  yarn,
  pnpm
): 'npm' | 'yarn' | 'pnpm' | false => {
  const npmRef = fs.existsSync(npm)
  const yarnRef = fs.existsSync(yarn)
  const pnpmRef = fs.existsSync(pnpm)

  if (+npmRef + +pnpmRef + +yarnRef > 1) {
    throw new Error('Unable to get package manager.')
  }

  return npmRef ? 'npm' : yarnRef ? 'yarn' : pnpmRef ? 'pnpm' : false
}

export const getPkgManager = (): 'npm' | 'yarn' | 'pnpm' => {
  const nodeModules = path.resolve('./node_modules')

  return (
    checkPackageManager(
      path.join(nodeModules, '.package-lock.json'),
      path.join(nodeModules, '.yarn-integrity'),
      path.join(nodeModules, '.modules.yaml')
    ) ||
    checkPackageManager(
      path.resolve('package-lock.json'),
      path.resolve('yarn.lock'),
      path.resolve('pnpm-lock.yaml')
    ) ||
    'npm'
  )
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
