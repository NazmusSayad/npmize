import { StdioOptions } from 'child_process'
import crossSpawn from 'cross-spawn'

export default function (
  cwd: string,
  args: string[],
  options: { async?: boolean; stdio?: StdioOptions } = {}
) {
  const runner = options.async ? crossSpawn : crossSpawn.sync
  runner('npx', ['tsc', ...args], {
    stdio: options.stdio || 'inherit',
    cwd,
  })
}
