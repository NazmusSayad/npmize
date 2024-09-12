import { Statement } from '@babel/types'
import { findNestedItems, isOkString, parseString } from './utils'

export const TSImportType = (parsed: Statement[]) => {
  return findNestedItems(parsed, 'type', 'TSImportType')
    .filter((node) => isOkString(node.argument))
    .map((node) => parseString(node.argument))
}

export const ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration = (
  parsed: Statement[]
) => {
  return [
    findNestedItems(parsed, 'type', 'ImportDeclaration'),
    findNestedItems(parsed, 'type', 'ExportDeclaration'),
    findNestedItems(parsed, 'type', 'ExportNamedDeclaration'),
    findNestedItems(parsed, 'type', 'ExportAllDeclaration'),
  ]
    .flat()
    .filter((node) => isOkString(node.source))
    .map((node) => parseString(node.source))
}

export const CallExpressionImport = (parsed: Statement[]) => {
  return findNestedItems(parsed, 'type', 'CallExpression')
    .filter(
      (node) =>
        node &&
        node.callee &&
        node.callee.type === 'Import' &&
        isOkString(node.arguments[0])
    )
    .map((node) => parseString(node.arguments[0]))
}

export const CallExpressionRequire = (parsed: Statement[]) => {
  return findNestedItems(parsed, 'type', 'CallExpression')
    .filter(
      (node) =>
        node &&
        node.callee &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        isOkString(node.arguments[0])
    )
    .map((node) => parseString(node.arguments[0]))
}
