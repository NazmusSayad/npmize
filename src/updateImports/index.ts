import fs from 'fs'
import * as babel from '@babel/parser'
import * as node from './node.js'
import { getUpdatedData, NodeType } from './utils'

const getImports = (parsed: any) => {
  return [
    ...node.CallExpressionImport(parsed),
    ...node.TSImportType(parsed),
    ...node.ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(
      parsed
    ),
  ]
}

const getRequires = (parsed: any) => {
  return node.CallExpressionRequire(parsed)
}

export default (type: 'mjs' | 'cjs', files: string[]) => {
  files.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, 'utf-8')

    const parsedBody = babel.parse(fileData, {
      sourceType: 'module',
      plugins: ['typescript'],
      sourceFilename: filePath,
    }).program.body

    const found: NodeType[] = (
      filePath.endsWith('.ts') || type === 'mjs' ? getImports : getRequires
    )(parsedBody)

    const dataParts = getUpdatedData(fileData, found, (node: NodeType) => {
      const ext = `.${type[0]}js`
      const jsRegex = /\.js$/gim

      return jsRegex.test(node.value)
        ? node.value.replace(jsRegex, ext)
        : node.value + ext
    })

    const newFilePath = filePath.replace(/\.(js|ts)$/, (match) => {
      return match.replace(/js|ts/, (m) => type[0] + m)
    })

    fs.rmSync(filePath)
    fs.writeFileSync(newFilePath, dataParts)
  })
}
