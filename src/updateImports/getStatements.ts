import {
  TSImportType,
  CallExpressionImport,
  CallExpressionRequire,
  ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration,
} from './node'
import { Statement } from '@babel/types'

export function getImports(parsed: Statement[]) {
  return [
    ...TSImportType(parsed),
    ...CallExpressionImport(parsed),
    ...ImportDeclaration_ExportNamedDeclaration_ExportAllDeclaration(parsed),
  ]
}

export function getRequires(parsed: Statement[]) {
  return CallExpressionRequire(parsed)
}
