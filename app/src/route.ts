import { app, pool } from './index'

// ルーティングの設定
app.get('/', async (req, res) => {
    const { rows } = await pool.query('select * from users')
    return res.send(rows)
  })
  