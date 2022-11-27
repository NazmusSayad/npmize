import fs from 'fs'
import path from 'path'

export const getPackagePath = () => {
  return path.resolve('./package.json')
}

export const writeJOSN = (path: string, data: {}): void => {
  fs.writeFileSync(path, JSON.stringify(data, null, '\t'))
}
export const readJOSN = (path: string): any => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch {
    return {}
  }
}

export const cleanDir = (dir: string): void => {
  if (!fs.existsSync(dir)) return
  const list = fs.readdirSync(dir)
  list.forEach((item) => {
    fs.rmSync(path.join(dir, item), {
      recursive: true,
      force: true,
    })
  })
}

export const getCommands = (...args: any[]): string => {
  return args.filter((i) => i).join(' ')
}
