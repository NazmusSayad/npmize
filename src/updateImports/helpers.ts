import { getExistedFilePath } from '../utils/fs'

export function getUpdatedData(fileData: any, found: NodeType[], cb: any) {
  const newEntries: NodeType[] = [
    { start: 0, end: 0, value: '' },
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

export function resolveJsFilePath(target: string) {
  return (
    getExistedFilePath(target) ??
    getExistedFilePath(target + '.js') ??
    getExistedFilePath(target + '/index.js')
  )
}

export type NodeType = {
  start: number
  end: number
  value: string
}
