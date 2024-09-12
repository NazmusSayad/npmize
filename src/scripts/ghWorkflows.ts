import fs from 'fs'
import path from 'path'
import ansiColors from 'ansi-colors'
import { confirmDir, getNodeVersion } from '../utils'

function publishWorkflowTemplate(nodeVersion = 'latest') {
  return `name: Publish to NPM

on:
  workflow_dispatch:
  push:
    paths:
      - package.json

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: ${nodeVersion}

      - name: Install dependencies
        run: npm install

      - name: Run tests (If exists)
        run: |
          if [[ ! -z $(npm show . scripts.test) ]]; then
            npm run test
          fi

      - name: Build the project
        run: npm run build

      - name: Set Npm Token
        run: npm config set //registry.npmjs.org/:_authToken=\${{ secrets.NPM_AUTH_TOKEN }}

      - name: Publish package to NPM
        run: npm publish || true

      - name: Unset Npm Token
        run: npm config delete //registry.npmjs.org/:_authToken
`
}

export default function (baseDir: string) {
  const workflowDir = confirmDir(baseDir, './.github/workflows')
  const publishWorkflowPath = path.join(workflowDir, 'npm-publish.yml')

  fs.writeFileSync(
    publishWorkflowPath,
    publishWorkflowTemplate(getNodeVersion()?.toString())
  )

  console.log(
    ansiColors.bgGreen(' INFO: '),
    `Set '${ansiColors.yellow(
      'NPM_AUTH_TOKEN'
    )}' secret in your repository settings to publish to NPM.`
  )
}
