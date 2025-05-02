import express from 'express'
import { config } from 'dotenv'

config()
const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000
console.log('PORT:', process.env.PORT, 'Host:', process.env.HOST)

const app = express()

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' })
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
