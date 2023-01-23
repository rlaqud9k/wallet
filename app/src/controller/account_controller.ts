import { pool } from '../index'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import crypto from 'crypto'
import { errorHandler, responseHandler } from '../handler'

const signUpQuery =
  'INSERT INTO users (id, name, mail, age, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *'
const infoQuery =
  'SELECT w.user_id as id, w.balance, t.transaction_amount, t.created_at FROM users u JOIN wallets w ON u.id = w.user_id LEFT JOIN transactions t ON u.id  = t.user_id WHERE u.id = $1 ORDER BY t.created_at'

//ユーザー情報登録
//ユーザーが登録されたときpostgresqlのtriggerでユーザーの残高情報も生成される
export const signUp = (req: Request, res: Response) => {
  const { name, mail, age, gender } = req.body
  const values = [crypto.randomUUID(), name, mail, age, gender]
  const mailCheckPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  //メールアドレスパタンチェック
  if (!mailCheckPattern.test(mail)) return errorHandler(Error('Invalid email address'), res)

  pool.query(signUpQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      return errorHandler(Error(err.message), res)
    } else {
      return responseHandler({ user: result.rows[0] }, res)
    }
  })
}

//ユーザー情報紹介(残高・取引記録)
export const info = (req: Request, res: Response) => {
  const { id } = req.body
  const values = [id]

  pool.query(infoQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      return errorHandler(Error(err.message), res)
    } else {
      const rows = result.rows
      let transactions: any[] = []
      //ユーザーidがいない場合のエラー処理
      if (!rows.length) return errorHandler(Error('user does not exist'), res)

      //取引記録がない状態では空いている配列をreturnする
      if (rows[rows.length - 1]?.created_at) {
        transactions = rows.map((info) => {
          return { transaction_amount: info.transaction_amount, created_at: info?.created_at }
        })
      }

      return responseHandler(
        { id: rows[0].id, balance: rows[0].balance, transactions: transactions },
        res
      )
    }
  })
}
