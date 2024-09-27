export function getNewFilePath(filePath: string, type: 'cjs' | 'mjs') {
  const prefix = type[0]

  return filePath.replace(/\.(js|ts)$/, (match) => {
    return match.replace(/(js|ts)/i, (type) => prefix + type)
  })
}
