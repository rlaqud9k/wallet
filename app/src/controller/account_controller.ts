import { pool } from '../index'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import crypto from 'crypto'

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
  if (!mailCheckPattern.test(mail))
    return res.status(500).json({ message: 'Invalid email address' })

  pool.query(signUpQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.status(200).json({ data: { user: result.rows[0] } })
    }
  })
}

//ユーザー情報紹介(残高・取引記録)
export const info = (req: Request, res: Response) => {
  const { id } = req.body
  const values = [id]

  pool.query(infoQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      const rows = result.rows
      let transactions: any[] = []
      //ユーザーidがいない場合のエラー処理
      if (!rows.length) return res.status(500).json({ message: 'user does not exist' })

      //取引記録がない状態では空いている配列をreturnする
      if (rows[rows.length - 1]?.created_at) {
        transactions = rows.map((info) => {
          return { transaction_amount: info.transaction_amount, created_at: info?.created_at }
        })
      }

      res
        .status(200)
        .json({ data: { id: rows[0].id, balance: rows[0].balance, transactions: transactions } })
    }
  })
}
