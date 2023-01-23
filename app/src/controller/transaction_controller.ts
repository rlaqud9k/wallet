import { pool } from '../index'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { errorHandler, responseHandler } from '../handler'

const sellQuery = 'UPDATE wallets SET balance = balance - ABS($2) WHERE user_id = $1 RETURNING *'
const buyQuery = 'UPDATE wallets SET balance = balance + $2 WHERE user_id = $1 RETURNING *'

//負数入力禁止
const amountValidationCheck = (amount: number, res: Response) => {
  if (amount <= 0) return errorHandler(Error('Invalid coin amount'), res)
}

//取引が発生したときpostgresqlのtriggerで取引記録が生成される
//指定した分を残高から引く
export const sell = (req: Request, res: Response) => {
  const { id, amount } = req.body

  const values = [id, amount]

  amountValidationCheck(amount, res)

  pool.query(sellQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      return errorHandler(Error(err.message), res)
    } else {
      return responseHandler({ balance: result.rows[0] }, res)
    }
  })
}

//指定した分を残高から足す
export const buy = (req: Request, res: Response) => {
  const { id, amount } = req.body
  const values = [id, amount]

  amountValidationCheck(amount, res)

  pool.query(buyQuery, values, (err: Error, result: QueryResult) => {
    if (err) {
      return errorHandler(Error(err.message), res)
    } else {
      return responseHandler({ balance: result.rows[0] }, res)
    }
  })
}

//指定した分を相手に渡す
export const send = (req: Request, res: Response) => {
  const { id, amount, takerId } = req.body

  amountValidationCheck(amount, res)

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
      return errorHandler(Error([err.message, ...errors].toString()), res)
    }

    client.query('BEGIN', (err) => {
      if (err) return shouldAbort(err, res)
      client.query(sellQuery, [id, amount], (err, sendResult) => {
        if (err) return shouldAbort(err, res)
        client.query(buyQuery, [takerId, amount], (err, takeResult) => {
          if (err) return shouldAbort(err, res)
          client.query('COMMIT', (err, result) => {
            if (err) {
              errorHandler(Error('Error committing transaction'), res)
            }
            done()
            return responseHandler({ sender: sendResult.rows[0], taker: takeResult.rows[0] }, res)
          })
        })
      })
    })
  })
}
