import { readJOSN, writeJOSN } from '../utils/utils'
import { userTSConfigPath } from '../config'

export default () => {
  const tsConf = readJOSN(userTSConfigPath)
  tsConf.include = ['src']
  writeJOSN(userTSConfigPath, tsConf)
}
