export interface CallBackFn {
  (node: NodeType): string
}

export const getDataParts = (
  fileData: string,
  found: NodeType[],
  cb: CallBackFn
) => {
  const newEntries: NodeType[] = [
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

  return chunks.flat()
}

export const isOkString = (a: any): Boolean => {
  return a && a.type === 'StringLiteral' && a.value.startsWith('.')
}

export const parseString = (str: any): NodeType => ({
  start: str.start,
  end: str.end,
  value: str.value,
  rawValue: str.extra.raw,
  filename: str.loc.filename,
})

export interface NodeType {
  start: number
  end: number
  value: string
  rawValue: string
  filename: string
}
