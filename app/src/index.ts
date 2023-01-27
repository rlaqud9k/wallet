import express, { Router } from 'express'
import { Pool } from 'pg'
import { errorHandler } from './handler'

//express-app
const app: express.Express = express()
//ルーター
export const router: Router = require('express').Router()
//DB
export const pool = new Pool({
  host: 'postgres',
  database: 'wallet_db',
  user: 'postgres',
  password: 'password',
  port: 5432
})

const PORT = 3100
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

//POSTされたフォームデータを受け取る処理
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//ルーターファイル設定
app.use('/account', require('./controller/account_controller'))
app.use('/transaction', require('./controller/transaction_controller'))
//404エラー処理
app.use((req, res, next) => {
  errorHandler(Error('not founded! :' + req.path), res)
})
