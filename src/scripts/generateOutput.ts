import getNodeCode from './getNodeCode'
import updateImports from '../updateImports'
import { MakeOutputOptions } from './makeOutputFile'

export default async function (filePath: string, fileContent: string, options: MakeOutputOptions) {
  const updatedContent = await updateImports(
    options.tempOutDir,
    filePath,
    fileContent,
    options.moduleType,
    options.tsConfig?.baseUrl,
    options.tsConfig?.paths
  )

  return options.pushNodeCode && options.moduleType === 'mjs' && filePath.endsWith('.js')
    ? getNodeCode(updatedContent) + updatedContent
    : updatedContent
}
