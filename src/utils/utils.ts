import fs from 'fs'
import path from 'path'

export const getPackagePath = () => {
  return path.resolve('./package.json')
}

export const getPackageData = () => {
  const pkgPath = getPackagePath()

  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, '{}')
    return {}
  }

  return JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
}

export const writeJOSN = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, '\t'))
}
