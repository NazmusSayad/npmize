import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import argv from '../argv.js'
import { readJOSN, getPackagePath } from '../utils/utils.js'
const requiredPackages = ['typescript']

const getPkgManagerCore = (
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

const getPkgManager = (): 'npm' | 'yarn' | 'pnpm' => {
  const nodeModules = path.resolve('./node_modules')

  return (
    getPkgManagerCore(
      path.join(nodeModules, '.package-lock.json'),
      path.join(nodeModules, '.yarn-integrity'),
      path.join(nodeModules, '.modules.yaml')
    ) ||
    getPkgManagerCore(
      path.resolve('package-lock.json'),
      path.resolve('yarn.lock'),
      path.resolve('pnpm-lock.yaml')
    ) ||
    'npm'
  )
}

const manageLocalPackage = (): void => {
  const packageData = readJOSN(getPackagePath())
  const missingPackages = requiredPackages.filter((dep) => {
    return !Boolean(
      (packageData.dependencies && packageData.dependencies[dep]) ||
        (packageData.devDependencies && packageData.devDependencies[dep])
    )
  })
  if (!missingPackages.length) return

  const pkm = getPkgManager()
  const installCmd = pkm === 'yarn' ? 'add' : 'install'
  const packagesList = missingPackages.join(' ')
  shell.exec(`${pkm} ${installCmd} -D ${packagesList}`)
}

const manageGlobalPackage = (): void => {
  const res = shell
    .exec(`npm ls -g --depth=0 --json`, { silent: true })
    .toString()
  const installedPkgs = Object.keys(JSON.parse(res).dependencies || {})
  const missingPackages = requiredPackages.filter((pkg) => {
    return !installedPkgs.includes(pkg)
  })
  if (!missingPackages.length) return

  const packagesList = missingPackages.join(' ')
  shell.exec(`npm install -g ${packagesList}`)
}

export default (): void => {
  if (argv.isLocal) {
    manageLocalPackage()
  } else {
    manageGlobalPackage()
  }
}
