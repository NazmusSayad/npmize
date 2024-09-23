import crossSpawn from 'cross-spawn'

export default function (cwd: string, args: string[], async = false) {
  crossSpawn.sync('npx', ['tsc', ...args], {
    cwd,
    stdio: 'inherit',
  })
}
