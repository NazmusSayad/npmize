import fs from 'fs'
const fileInfo = [
  {
    path: './.gitignore',
    lines: ['node_modules', 'dist-cjs', 'dist-mjs'],
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
    let text = '# Added by npm-ez\n' + lines.join('\n') + '\n'

    if (fs.existsSync(path)) {
      const fileLines = fs.readFileSync(path, 'utf-8')
      if (fileLines.includes(text)) return
      text = fileLines.trim() + '\n\n' + text
    }

    fs.writeFileSync(path, text)
  })
}
