import { router } from '../index'
import { Request, Response } from 'express'
import { buy, sell, send } from '../service/transaction_service'
import { errorHandler } from '../handler'
import { validationResult } from 'express-validator'
import {
  sellBuyRequestCheckSchema,
  sendRequestCheckSchema
} from '../validation_schema/transaction_schema'

//エラーになったときにエラー範囲を特定しやすくするためasync/awaitではなくcallback処理にする
//ユーザーのIDは送信・照会の主な情報のため簡単な情報でもgetではなくpostを使う
router.post('/sell', sellBuyRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //token販売
    sell(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

router.post('/buy', sellBuyRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //token購買
    buy(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

router.post('/send', sendRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //token取引
    send(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

module.exports = router
