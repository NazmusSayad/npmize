import fs from 'fs'
const fileInfo = [
  {
    path: './.gitignore',
    lines: ['dist-cjs', 'dist-mjs'],
  },
  {
    path: './.npmignore',
    lines: [
      '*',
      '!lib/**',
      '!dist-cjs/**',
      '!dist-mjs/**',
      '!package.json',
      '!README.md',
    ],
  },
]

export default (): void => {
  fileInfo.forEach(({ path, lines }) => {
    const text = '\n# Added by npm-ez\n' + lines.join('\n') + '\n'

    if (!fs.existsSync(path)) {
      return fs.writeFileSync(path, text)
    }

    const fileLines = fs.readFileSync(path, 'utf-8')
    fileLines.includes(text) || fs.appendFileSync(path, text)
  })
}
