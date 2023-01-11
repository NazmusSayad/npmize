import fs from 'fs'
import { getDataParts, getParsedBody } from './utils'
import * as node from './node.js'

const getImports = (filePath: string, fileData: string, cb) => {
  const parsed = getParsedBody(filePath, fileData)
  const found = [
    ...node.CallExpressionImport(parsed),
    ...node.TSImportType(parsed),
    ...node.ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(
      parsed
    ),
  ]
  return getDataParts(fileData, found, cb)
}

const getRequires = (filePath: string, fileData: string, cb) => {
  const parsed = getParsedBody(filePath, fileData)
  const found = node.CallExpressionRequire(parsed)
  return getDataParts(fileData, found, cb)
}

export default (type: 'm' | 'c', files: string[]) => {
  files.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, 'utf-8')
    const newFilePath = filePath.replace(/\.(js|ts)$/, (match) => {
      return match.replace(/js|ts/, (m) => {
        return type + m
      })
    })

    const newCodeParserFn =
      filePath.endsWith('.ts') || type === 'm' ? getImports : getRequires
    const newData = newCodeParserFn(filePath, fileData, (node) => {
      return 'Hello world!!!'
    })

    fs.rmSync(filePath)
    fs.writeFileSync(newFilePath, newData)
  })
}
