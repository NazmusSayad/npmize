import path from 'path'
import { tscOptPrefix } from './config'

const argvList = [...process.argv]
const argv: {
  node?: string
  script?: string
  cmd: string
  isLocal: boolean
  flag
  sFlag
} = {
  node: argvList.shift(),
  script: argvList.shift(),
  isLocal: process.argv[1].startsWith(path.resolve('./node_modules')),
  cmd: '',
  flag: {},
  sFlag: {},
}

const parseFlag = (arg: string): void => {
  const [key, value = true] = arg.split('=')
  argv.flag[key] = value
}

const parseSFlag = (arg: string): void => {
  const [key, value = true] = arg.split('=')
  argv.sFlag[key] = value
}

argvList.forEach((arg) => {
  if (arg.startsWith('--')) return parseFlag(arg.replace('--', ''))
  if (arg.startsWith('-')) return parseSFlag(arg.replace('-', ''))
  argv.cmd = arg
})

export default argv
export const tscOptions: string[] = []

for (let key in argv.flag) {
  const value = argv.flag[key]
  if (!key.startsWith(tscOptPrefix)) continue

  const tscKey = key.slice(tscOptPrefix.length)
  tscKey && tscOptions.push(tscKey, value)
}
