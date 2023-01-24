import { app } from './index'
import { Request, Response } from 'express'
import { info, signUp } from './controller/account_controller'
import { buy, sell, send } from './controller/transaction_controller'
import { errorHandler } from './handler'
import { validationResult } from 'express-validator'
import {
  signUpRequestCheckSchema,
  infoRequestCheckSchema
} from './validation_schema/account_schema'
import {
  sellBuyRequestCheckSchema,
  sendRequestCheckSchema
} from './validation_schema/transaction_schema'

//エラーになったときにエラー範囲を特定しやすくするためasync/awaitではなくcallback処理にする
//ユーザーのIDは送信・照会の主な情報のため簡単な情報でもgetではなくpostを使う
const router = require('express').Router()

app.post('/account/sign-up', signUpRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //ユーザー情報登録
    signUp(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/account/info', infoRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //ユーザー情報確認
    info(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/sell', sellBuyRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //token販売
    sell(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/buy', sellBuyRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //token購買
    buy(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/send', sendRequestCheckSchema, (req: Request, res: Response) => {
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
