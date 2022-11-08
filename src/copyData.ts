import fs from 'fs'

export default (...targets) => {
  targets.forEach(({ path, lines }) => {
    if (!fs.existsSync(path)) {
      return fs.writeFileSync(path, lines.join('\n'))
    }

    const fileLines = fs
      .readFileSync(path, 'utf-8')
      .split('\n')
      .map((line) => line.trim())

    lines.forEach((line) => {
      if (fileLines.includes(line)) return
      fs.appendFileSync(path, '\n' + line + '\n')
    })
  })
}
