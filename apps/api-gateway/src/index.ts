import express from 'express'
import { config } from 'dotenv'
import { router } from './routes/index'

config()

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
