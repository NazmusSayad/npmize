import fs from 'fs'
import path from 'path'
import ac from 'ansi-colors'

export const writeJOSN = (path: string, data: {}): void => {
  fs.writeFileSync(path, JSON.stringify(data, null, '\t'))
}
export const readJOSN = (path: string): any => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (err: any) {
    if (err.name === 'SyntaxError') {
      console.error(ac.red(`Invalid json input ${path}`))
      process.exit(1)
    }

    return {}
  }
}

export const deleteDir = (dir) => {
  if (!fs.existsSync(dir)) return
  fs.rmSync(dir, { recursive: true })
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

export const findNestedItems = (
  entireObj: any,
  keyToFind: string,
  valToFind: string | number | unknown
) => {
  let foundObj: any[] = []

  JSON.stringify(entireObj, (_, nestedValue) => {
    const found = nestedValue && nestedValue[keyToFind] === valToFind
    found && foundObj.push(nestedValue)
    return nestedValue
  })

  return foundObj
}
