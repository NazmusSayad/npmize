export const getUpdatedData = (fileData: any, found: any[], cb: any) => {
  const newEntries = [
    { start: 0, end: 0, value: '', rawValue: '', filename: '' },
    ...found.sort((a, b) => a.start - b.start),
  ]

  const chunks = newEntries.map((node, i, arr) => {
    const nextNode = arr[i + 1]
    const nodeEnd = node.end
    const nextNodeEnd = nextNode ? nextNode.start : Infinity
    const str = fileData.slice(nodeEnd, nextNodeEnd)

    if (!nextNode) return str
    return [str, `"${cb(nextNode) ?? nextNode.value}"`]
  })

  return chunks.flat().join('')
}

export const isOkString = (node: any) => {
  return node && node.type === 'StringLiteral' && node.value.startsWith('.')
}

export const parseString = (str: any) => ({
  start: str.start,
  end: str.end,
  value: str.value,
  rawValue: str.extra.raw,
  filename: str.loc.filename,
})

export const isFileExists = (files: string[], target: string) => {
  return (
    files.includes(target) ||
    files.includes(target + '.js') ||
    files.includes(target + '.ts')
  )
}

export function getNewFilePath(filePath: string, type: 'cjs' | 'mjs') {
  const prefix = type[0]

  return filePath.replace(/\.(js|ts)$/, (match) => {
    return match.replace(/(js|ts)/i, (type) => prefix + type)
  })
}

export const findNestedItems = (
  entireObj: any,
  keyToFind: string,
  valToFind: unknown
) => {
  const foundObj: any[] = []
  JSON.stringify(entireObj, (_, nestedValue) => {
    const found = nestedValue && nestedValue[keyToFind] === valToFind
    found && foundObj.push(nestedValue)
    return nestedValue
  })
  return foundObj
}
