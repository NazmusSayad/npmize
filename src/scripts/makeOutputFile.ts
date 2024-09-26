import fs from 'fs'
import path from 'path'
import pushNodeCode from './getNodeCode'
import updateImports from '../updateImports'
import { autoCreateDir } from '../utils/fs'

type MakeOutputOptions = {
  tempOutDir: string
  finalOutDir: string
  moduleType: 'cjs' | 'mjs'
  pushNodeCode: boolean
  tsConfig: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}
export default function (filePath: string, options: MakeOutputOptions) {
  const [tempFilePath, newFileContent] = updateImports(
    options.tempOutDir,
    filePath,
    options.moduleType,
    options.tsConfig?.baseUrl,
    options.tsConfig?.paths
  )

  const newFilePath = path.join(
    options.finalOutDir,
    path.relative(options.tempOutDir, tempFilePath)
  )

  const contentWithNodeCode =
    options.pushNodeCode && options.moduleType === 'cjs'
      ? pushNodeCode(newFilePath, newFileContent) + newFileContent
      : newFileContent

  autoCreateDir(path.dirname(newFilePath))
  fs.writeFileSync(newFilePath, contentWithNodeCode)

  return newFilePath
}
