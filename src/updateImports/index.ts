import fs from 'fs'
import path from 'path'
import * as babel from '@babel/parser'
import * as utils from './utils'
import * as node from './node'

const getImports = (parsed) => {
  return [
    ...node.CallExpressionImport(parsed),
    ...node.TSImportType(parsed),
    ...node.ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(
      parsed
    ),
  ]
}

const getRequires = (parsed) => {
  return node.CallExpressionRequire(parsed)
}

export default (type, files) => {
  const ext = '.' + type

  files.forEach((filePath) => {
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

    const updatedData = utils.getUpdatedData(data, foundFilePaths, (node) => {
      const shortPath = node.value.replace(/\.js$/i, '')
      const fullPath = path.join(dirPath, node.value)

      const isExists = utils.isFileExists(files, fullPath)
      return isExists ? shortPath + ext : shortPath + '/index' + ext
    })

    fs.rmSync(filePath)
    fs.writeFileSync(utils.getNewFilePath(filePath, type), updatedData)
  })
}
