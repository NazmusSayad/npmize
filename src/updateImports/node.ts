import { Statement } from '@babel/types'
import { findNestedItems, isOkString, parseString } from './utils'

const TSImportType = (parsed: Statement[]) => {
  return findNestedItems(parsed, 'type', 'TSImportType')
    .filter((node) => isOkString(node.argument))
    .map((node) => parseString(node.argument))
}

const ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration = (
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

const CallExpressionImport = (parsed: Statement[]) => {
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

const CallExpressionRequire = (parsed: Statement[]) => {
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

export function getImports(parsed: Statement[]) {
  return [
    ...CallExpressionImport(parsed),
    ...TSImportType(parsed),
    ...ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(parsed),
  ]
}

export function getRequires(parsed: Statement[]) {
  return CallExpressionRequire(parsed)
}
