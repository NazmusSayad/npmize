import shelljs from 'shelljs'

export default function (cwd: string, args: string[], async = false) {
  shelljs.exec(['npx', 'tsc', ...args].join(' '), { cwd, async })
}
