import fs from 'fs'
import path from 'path'
import shell from 'shelljs'

export default (targetDeps: string[]) => {
  const pkgPath = path.resolve('./package.json')
  if (!fs.existsSync(pkgPath)) return false

  const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

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
