const crossSpawn = require('cross-spawn')
const fs = require('fs')

fs.rmSync('./dist', { recursive: true, force: true })
crossSpawn.sync('tsc', { stdio: 'inherit' })
