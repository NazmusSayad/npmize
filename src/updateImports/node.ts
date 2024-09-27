import { NodeType } from './helpers'
import { Statement } from '@babel/types'

function parseString(str: any): NodeType {
  return {
    start: str.start,
    end: str.end,
    value: str.value,
  }
}

function isOkString(node: any) {
  return Boolean(node && node.type === 'StringLiteral')
}

function findNestedItems(entireObj: Statement[], valToFind: unknown) {
  const foundObj: any[] = []
  JSON.stringify(entireObj, (_, nestedValue) => {
    const found = nestedValue && nestedValue.type === valToFind
    found && foundObj.push(nestedValue)
    return nestedValue
  })
  return foundObj
}

export function TSImportType(parsed: Statement[]) {
  return findNestedItems(parsed, 'TSImportType')
    .filter((node) => isOkString(node.argument))
    .map((node) => parseString(node.argument))
}

export function ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(parsed: Statement[]) {
  return [
    findNestedItems(parsed, 'ImportDeclaration'),
    findNestedItems(parsed, 'ExportDeclaration'),
    findNestedItems(parsed, 'ExportNamedDeclaration'),
    findNestedItems(parsed, 'ExportAllDeclaration'),
  ]
    .flat()
    .filter((node) => isOkString(node.source))
    .map((node) => parseString(node.source))
}

export function CallExpressionImport(parsed: Statement[]) {
  return findNestedItems(parsed, 'CallExpression')
    .filter(
      (node) =>
        node && node.callee && node.callee.type === 'Import' && isOkString(node.arguments[0])
    )
    .map((node) => parseString(node.arguments[0]))
}

export function CallExpressionRequire(parsed: Statement[]) {
  return findNestedItems(parsed, 'CallExpression')
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
