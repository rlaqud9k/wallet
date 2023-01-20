import express from 'express'
import { Pool } from 'pg'

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


