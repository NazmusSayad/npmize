const shelljs = require('shelljs')
const fs = require('fs')

fs.rmSync('./dist', { recursive: true, force: true })
shelljs.exec('tsc')
