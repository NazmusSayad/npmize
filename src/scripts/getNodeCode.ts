const varName =
  '_____VGhpcyBuYW1lIGlzIHVzZWQgdG8gZW5hYmxlIF9fZGlybmFtZSBhbmQgX19maWxlbmFtZSDwn5iK_____'

export default function (fileContent: string) {
  const isFilenameExist = fileContent.includes('__filename')
  const isDirnameExist = fileContent.includes('__dirname')
  if (!isFilenameExist && !isDirnameExist) return ''
  const nodeCodeContents = [
    '/* START: AUTO-GENERATED CODE */',
    `import{fileURLToPath as ${varName}}from'url';`,
  ]

  if (isFilenameExist) {
    nodeCodeContents.push(`var __filename=${varName}(import.meta.url);`)
  }

  if (isDirnameExist) {
    nodeCodeContents.push(
      `var __dirname=${varName}(new URL('.',import.meta.url));`
    )
  }

  return nodeCodeContents.join('\n') + '\n/* END: AUTO-GENERATED CODE */\n\n'
}
