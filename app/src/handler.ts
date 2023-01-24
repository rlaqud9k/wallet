import { Response } from 'express'
import { ValidationError } from 'express-validator'

export const errorHandler = (err: any, res: Response) => {
  //express-validatorエラー処理
  //express-validatorエラー以外はErrorオブジェクトを使う
  if (err?.errors) {
    err.message = err.errors.map(({ value, msg }: ValidationError) => {
      return `value: ${value} message: ${msg}`
    })
  }
  return res.status(500).json({ message: err.message.toString() || 'Unexpected Error' })
}

export const responseHandler = (data: object, res: Response) => {
  return res.status(200).json({ data: data })
}
