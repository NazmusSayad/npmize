import fs from 'fs'
import path from 'path'

export default (dir: string, type: 'cjs' | 'mjs') => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const pkgJsonPath = path.join(dir, './package.json')
  const moduleType = type === 'cjs' ? 'commonjs' : 'module'

  fs.writeFileSync(pkgJsonPath, JSON.stringify({ type: moduleType }))
}
