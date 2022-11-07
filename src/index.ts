#!/usr/bin/env node

import Builder from './Builder.js'
const builder = new Builder()

switch (process.argv[2]) {
  case undefined:
  case 'dev':
    builder.dev()
    break
  case 'build':
    builder.build()
    break
}
