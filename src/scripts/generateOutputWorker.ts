import { parentPort } from 'worker_threads'
import generateOutput from './generateOutput'
import { MakeOutputOptions } from './makeOutputFile'

parentPort!.on('message', (options: WorkerMessage) => {
  generateOutput(options.filePath, options.fileContent, options.options).then((data) => {
    parentPort!.postMessage(data)
  })
})

export type WorkerMessage = {
  filePath: string
  fileContent: string
  options: MakeOutputOptions
}
