import { NextFunction, Request, Response } from 'express'
import { pool } from '../index'
import { QueryResult } from 'pg'
import { errorHandler } from '../handler'

const checkExistUserQuery = 'SELECT * FROM users WHERE id = any($1::uuid[])'

//存在するユーザーなのかチェック
export const checkExistUser = (req: Request, res: Response, next: NextFunction) => {
  const { id, takerId } = req.body
  let values = [id, takerId].filter((id) => id)
  pool.query(checkExistUserQuery, [values], (err: Error, result: QueryResult) => {
    if (err) {
      return errorHandler(Error(err.message), res)
    } else {
      const row = result?.rows
      if (row.length != values.length) return errorHandler(Error('user does not exist'), res)
      next()
    }
  })
}
