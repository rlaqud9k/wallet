import { app } from './index'
import { Request, Response } from 'express'
import { info, signUp } from './controller/account_controller'
import { buy, sell, send } from './controller/transaction_controller'
import { errorHandler } from './handler'

//エラーになったときにエラー範囲を特定しやすくするためasync/awaitではなくcallback処理にする
//ユーザーのIDは送信・照会の主な情報のため簡単な情報でもgetではなくpostを使う
const router = require('express').Router()

app.post('/account/sign-up', (req: Request, res: Response) => {
  try {
    signUp(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/account/info', (req: Request, res: Response) => {
  try {
    info(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/sell', (req: Request, res: Response) => {
  try {
    sell(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/buy', (req: Request, res: Response) => {
  try {
    buy(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

app.post('/transaction/send', (req: Request, res: Response) => {
  try {
    send(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

module.exports = router
