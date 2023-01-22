import express from 'express'
import { Pool } from 'pg'

//express・DB設定
export const app: express.Express = express()

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
app.use(require('./route'))
