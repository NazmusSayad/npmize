import fs from 'fs'
import path from 'path'
import { Worker } from 'worker_threads'
import { autoCreateDir } from '../utils/fs'
import generateOutput from './generateOutput'

export type MakeOutputOptions = {
  useWorker: boolean
  tempOutDir: string
  finalOutDir: string
  moduleType: 'cjs' | 'mjs'
  pushNodeCode: boolean
  tsConfig: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

export default async function (filePath: string, options: MakeOutputOptions) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const generator = options.useWorker ? generateOutputWorker : generateOutput
  const [newFilePath, newFileContent] = await generator(
    filePath,
    fileContent,
    options
  )

  autoCreateDir(path.dirname(newFilePath))
  fs.writeFileSync(newFilePath, newFileContent)

  return newFilePath
}

function generateOutputWorker(
  filePath: string,
  fileContent: string,
  options: MakeOutputOptions
): ReturnType<typeof generateOutput> {
  const worker = new Worker(path.join(__dirname, 'generateOutputWorker.js'))
  worker.postMessage({
    filePath,
    fileContent,
    options,
  })

  return new Promise((resolve) => {
    worker.on('message', (message) => {
      resolve(message)
      worker.terminate()
    })
  })
}
