import * as fs from 'fs'
import { NodeType } from './types.t'

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
  function isExists(target: string) {
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return target
  }

  return isExists(target) || isExists(target + '.js') || isExists(target + '/index.js')
}
