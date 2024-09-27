import path from 'path'
import getNodeCode from './getNodeCode'
import updateImports from '../updateImports'
import { MakeOutputOptions } from './makeOutputFile'

export default async function (
  filePath: string,
  fileContent: string,
  options: MakeOutputOptions
) {
  const [tempFilePath, newFileContent] = await updateImports(
    options.tempOutDir,
    filePath,
    fileContent,
    options.moduleType,
    options.tsConfig?.baseUrl,
    options.tsConfig?.paths
  )

  const newFilePath = path.join(
    options.finalOutDir,
    path.relative(options.tempOutDir, tempFilePath)
  )

  const output =
    options.pushNodeCode && options.moduleType === 'cjs'
      ? getNodeCode(newFilePath, newFileContent) + newFileContent
      : newFileContent

  return [newFilePath, output] as const
}
