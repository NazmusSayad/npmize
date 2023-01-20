import * as utils from './utils'
import * as mainUtils from '../utils/utils'

export const TSImportType = (parsed) => {
  return mainUtils
    .findNestedItems(parsed, 'type', 'TSImportType')
    .filter((node) => utils.isOkString(node.argument))
    .map((node) => utils.parseString(node.argument))
}

export const ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration = (
  parsed
) => {
  return [
    mainUtils.findNestedItems(parsed, 'type', 'ImportDeclaration'),
    mainUtils.findNestedItems(parsed, 'type', 'ExportDeclaration'),
    mainUtils.findNestedItems(parsed, 'type', 'ExportNamedDeclaration'),
    mainUtils.findNestedItems(parsed, 'type', 'ExportAllDeclaration'),
  ]
    .flat()
    .filter((node) => utils.isOkString(node.source))
    .map((node) => utils.parseString(node.source))
}

export const CallExpressionImport = (parsed) => {
  return mainUtils
    .findNestedItems(parsed, 'type', 'CallExpression')
    .filter(
      (node) =>
        node &&
        node.callee &&
        node.callee.type === 'Import' &&
        utils.isOkString(node.arguments[0])
    )
    .map((node) => utils.parseString(node.arguments[0]))
}

export const CallExpressionRequire = (parsed) => {
  return mainUtils
    .findNestedItems(parsed, 'type', 'CallExpression')
    .filter(
      (node) =>
        node &&
        node.callee &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        utils.isOkString(node.arguments[0])
    )
    .map((node) => utils.parseString(node.arguments[0]))
}
