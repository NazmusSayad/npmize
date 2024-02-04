import fs from 'fs'
import path from 'path'
import * as babel from '@babel/parser'
import * as utils from './utils'
import * as node from './node'
import { writeFileSync } from '../utils'

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

export default (type: 'cjs' | 'mjs', files: any[]) => {
  const ext = '.' + type

  return files.map((filePath) => {
    const dirPath = path.dirname(filePath)
    const data = fs.readFileSync(filePath, 'utf-8')
    const parsedBody = babel.parse(data, {
      sourceType: 'module',
      plugins: ['typescript'],
      sourceFilename: filePath,
    }).program.body

    const foundFilePaths =
      filePath.endsWith('.ts') || type === 'mjs'
        ? getImports(parsedBody)
        : getRequires(parsedBody)

    const updatedData = utils.getUpdatedData(
      data,
      foundFilePaths,
      (node: any) => {
        const shortPath = node.value.replace(/\.js$/i, '')
        const fullPath = path.join(dirPath, node.value)

        const isExists = utils.isFileExists(files, fullPath)
        return isExists ? shortPath + ext : shortPath + '/index' + ext
      }
    )

    fs.rmSync(filePath)
    const newFilePath = utils.getNewFilePath(filePath, type)
    writeFileSync(newFilePath, updatedData)
    return newFilePath
  })
}
