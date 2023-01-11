import fs from 'fs'
import * as babel from '@babel/parser'
import { getDataParts, NodeType } from './utils'
import * as node from './node.js'

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

export default (type: 'm' | 'c', files: string[]) => {
  files.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, 'utf-8')
    const newFilePath = filePath.replace(/\.(js|ts)$/, (match) => {
      return match.replace(/js|ts/, (m) => {
        return type + m
      })
    })

    const parsedBody = babel.parse(fileData, {
      sourceType: 'module',
      plugins: ['typescript'],
      sourceFilename: filePath,
    }).program.body

    const found: NodeType[] = (
      filePath.endsWith('.ts') || type === 'm' ? getImports : getRequires
    )(parsedBody)

    const dataParts = getDataParts(fileData, found, (node: NodeType) => {
      const ext = `.${type}js`
      const jsRegex = /\.js$/gim

      return jsRegex.test(node.value)
        ? node.value.replace(jsRegex, ext)
        : node.value + ext
    })

    fs.rmSync(filePath)
    fs.writeFileSync(newFilePath, dataParts.join(''))
  })
}
