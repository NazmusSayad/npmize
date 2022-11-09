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
    console.log('Unable to get package manager.')
    process.exit(1)
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
  if (!packageNames.length) return
  const installCmd = pkm === 'yarn' ? 'add' : 'install'
  shell.exec(`${pkm} ${installCmd} -D ${packageNames.join(' ')}`)
}

export const getMissingPkgs = (targetDeps: string[]): string[] => {
  const pkgData = getPackageData()

  return targetDeps.filter((dep) => {
    const installed = Boolean(
      (pkgData.dependencies && pkgData.dependencies[dep]) ||
        (pkgData.devDependencies && pkgData.devDependencies[dep])
    )

    return !installed
  })
}

export default (): void => {
  const missingPkgs = getMissingPkgs(requiredPackages)
  const pkm = getPkgManager()
  installDevPackage(pkm, ...missingPkgs)
}
