import * as babel from '@babel/parser'

export const getDataParts = (fileData: string, found: NodeType[], cb) => {
  let increment = 0
  let newFileData = fileData

  found.forEach((node) => {
    node.end += increment
    node.start += increment

    const newValue: string = cb(node)
    const firstPart = newFileData.slice(0, node.start)
    const lastPart = newFileData.slice(node.end, Infinity)

    if (!newValue) throw new Error('Invalid path')
    increment += newValue.length - node.value.length
    newFileData = firstPart + `"${newValue}"` + lastPart
  })

  return newFileData
}

export const getParsedBody = (filePath: string, fileData: string) => {
  const parsed = babel.parse(fileData, {
    sourceType: 'module',
    plugins: ['typescript'],
    sourceFilename: filePath,
  })

  return parsed.program.body
}

export const isOkString = (a): Boolean => {
  return a && a.type === 'StringLiteral' && a.value.startsWith('.')
}

export const parseString = (str): NodeType => ({
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
