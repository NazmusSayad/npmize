import fs from 'fs'
import * as babel from '@babel/parser'

const copyToFile = (file: string, code: string) => {
  fs.appendFileSync(file, '\nmodule.exports=' + code + ';')
}

const getMatched = (file: string, code: string, program: any[]) => {
  const matched = program.find((body) => {
    if (body.type !== 'ExpressionStatement') return
    if (body.expression?.type !== 'AssignmentExpression') return

    if (body.expression.left?.object?.name !== 'exports') return
    if (body.expression.left?.property?.name !== 'default') return

    return true
  })

  const foundValue = code.slice(
    matched.expression.right.start,
    matched.expression.right.end
  )
  copyToFile(file, foundValue)
}

export default (files: string[]) => {
  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf-8')
    const result = babel.parse(code)
    getMatched(file, code, result.program.body)
  })
}
