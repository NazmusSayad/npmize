import * as fs from 'fs'
import path from 'path'

function read(basePath: string): Record<string, any> {
  try {
    const filePath = path.join(basePath, './tsconfig.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err: any) {
    if (err.code === 'ENOENT') return {}
    throw err
  }
}

function write(basePath: string, data: Record<string, any>) {
  const filePath = path.join(basePath, './tsconfig.json')
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export default { read, write }
