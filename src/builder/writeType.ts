import fs from 'fs'
import path from 'path'
import { cleanDir } from '../utils/utils'

export default (dir, type) => {
  if (fs.existsSync(dir)) {
    cleanDir(dir)
  } else {
    fs.mkdirSync(dir, { recursive: true })
  }

  const pkgJsonPath = path.join(dir, './package.json')
  fs.writeFileSync(pkgJsonPath, JSON.stringify({ type }))
}
