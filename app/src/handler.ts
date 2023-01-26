import { Response } from 'express'
import { ValidationError } from 'express-validator'

export const errorHandler = (err: any, res: Response) => {
  //express-validatorエラー処理
  //express-validatorエラー以外はErrorオブジェクトを使う
  if (err?.errors) {
    err.message = err.errors.map(({ value, msg, param }: ValidationError) => {
      return `param: ${param} value: ${value} message: ${msg}`
    })
  }
  return res.status(500).json({ message: err.message.toString() || 'Unexpected Error' })
}
//処理が正常終了した場合の処理
export const responseHandler = (data: object, res: Response) => {
  return res.status(200).json({ data: data })
}
