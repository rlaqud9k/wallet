import { pool } from '../index'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'

const sellQuery = 'UPDATE wallets SET balance = balance - ABS($2) WHERE user_id = $1 RETURNING *'
const buyQuery = 'UPDATE wallets SET balance = balance + $2 WHERE user_id = $1 RETURNING *'

//取引が発生したときpostgresqlのtriggerで取引記録が生成される
//指定した分を残高から引く
export const sell = (req: Request, res: Response) => {
  const { id, amount } = req.body
  const values = [id, amount]
  //負数入力禁止
  if (amount <= 0) return res.status(500).json({ message: 'Invalid coin amount' })

  pool.query(sellQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.status(200).json({ data: { balance: result.rows[0] } })
    }
  })
}

//指定した分を残高から足す
export const buy = (req: Request, res: Response) => {
  const { id, amount } = req.body
  const values = [id, amount]
  //負数入力禁止
  if (amount <= 0) return res.status(500).json({ message: 'Invalid coin amount' })

  pool.query(buyQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      res.status(200).json({ data: { balance: result.rows[0] } })
    }
  })
}

//指定した分を相手に渡す
export const send = (req: Request, res: Response) => {
  const { id, amount, takerId } = req.body

  //負数入力禁止
  if (amount <= 0) return res.status(500).json({ message: 'Invalid coin amount' })

  pool.connect((err, client, done) => {
    //何らかの不具合が発生したときrollbackする
    const shouldAbort = (err: Error, res: Response) => {
      const errors = []
      if (err) {
        errors.push('Error in transaction')
        client.query('ROLLBACK', (err) => {
          if (err) {
            errors.push('Error rolling back client')
          }
          done()
        })
      }
      return res.status(500).json({ message: [err.message, ...errors] })
    }

    client.query('BEGIN', (err) => {
      if (err) return shouldAbort(err, res)
      client.query(sellQuery, [id, amount], (err, sendResult) => {
        if (err) return shouldAbort(err, res)
        client.query(buyQuery, [takerId, amount], (err, takeResult) => {
          if (err) return shouldAbort(err, res)
          client.query('COMMIT', (err, result) => {
            if (err) {
              res.status(500).json({ message: 'Error committing transaction' })
            }
            done()
            console.log(sendResult.rows, takeResult.rows)
            res
              .status(200)
              .json({ data: { sender: sendResult.rows[0], taker: takeResult.rows[0] } })
          })
        })
      })
    })
  })
}
