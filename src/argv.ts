import path from 'path'

const argvList = [...process.argv]
const argv: {} | any = {
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
