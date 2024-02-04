import path from 'path'

const data = require(path.resolve('./package.json'))

export default {
  name: data.name as Lowercase<string>,
  description: data.description as string,
  tempBuildDir: './.npmize/build',
  defaultOutDir: './dist',
}
