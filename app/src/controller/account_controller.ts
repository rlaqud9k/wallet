import { router } from '../index'
import { Request, Response } from 'express'
import { info, signUp } from '../service/account_service'
import { errorHandler } from '../handler'
import { validationResult } from 'express-validator'
import {
  signUpRequestCheckSchema,
  infoRequestCheckSchema
} from '../validation_schema/account_schema'
import { checkExistUser } from '../interceptor/auth_interceptor'

//エラーになったときにエラー範囲を特定しやすくするためasync/awaitではなくcallback処理にする
//ユーザーのIDは送信・照会の主な情報のため簡単な情報でもgetではなくpostを使う
router.post('/sign-up', signUpRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //ユーザー情報登録
    signUp(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

router.post('/info', checkExistUser, infoRequestCheckSchema, (req: Request, res: Response) => {
  try {
    //パラメーター検証処理
    validationResult(req).throw()
    //ユーザー情報確認
    info(req, res)
  } catch (err: unknown) {
    errorHandler(err, res)
  }
})

module.exports = router
