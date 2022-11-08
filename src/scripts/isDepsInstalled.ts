import shell from 'shelljs'
import { getPackageData } from '../utils/utils.js'

export default (targetDeps: string[]) => {
  const pkgData = getPackageData()

  const result = {}
  targetDeps.forEach((dep) => {
    result[dep] = Boolean(
      pkgData.dependencies[dep] || pkgData.devDependencies[dep]
    )
  })

  return result
}

export const installDevPackage = (pkgMng, ...packageNames: string[]) => {
  const installCmd = pkgMng === 'yarn' ? 'add' : 'install'
  shell.exec(`${pkgMng} ${installCmd} -D ${packageNames.join(' ')}`)
}
