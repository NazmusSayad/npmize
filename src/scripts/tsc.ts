import shelljs from 'shelljs'

export default function (cwd: string, args: string[]) {
  shelljs.cd(cwd).exec(['npx tsc', ...args].join(' '))
}
