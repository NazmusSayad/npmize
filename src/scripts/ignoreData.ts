import fs, { readFileSync } from 'fs'
const heading = '# npmkit'
const ignoreTexts = [
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

function writeNewFile({ path, lines }) {
  const text = [heading, ...lines].join('\n')
  fs.writeFileSync(path, text)
}

function updateIgnoreFile({ path, lines }) {
  const fileStr = readFileSync(path, 'utf-8')
  const fileData = fileStr
    .split('\n')
    .filter(Boolean)
    .map((str) => str.trim())

  const missingLines = lines.filter((line) => !fileData.includes(line))
  if (!missingLines.length) return

  const missingTexts = [heading, ...missingLines].join('\n')
  const text = (fileStr + '\n\n' + missingTexts).trim()
  fs.writeFileSync(path, text)
}

export default (): void => {
  ignoreTexts.forEach((info) => {
    fs.existsSync(info.path) ? updateIgnoreFile(info) : writeNewFile(info)
  })
}
