import express from 'express'
import 'express-async-errors'
import { config } from 'dotenv'
import { router } from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { standardResponse } from './middlewares/response.middleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
config()

const host = process.env.HOST ?? 'localhost'

const port = process.env.PORT ? Number(process.env.PORT) : 3001

const app = express()
//set up cors
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(standardResponse)
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
})
app.use('/', router)

app.use(errorHandler)
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  //restart the server
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
