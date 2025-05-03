import express from 'express'
const router = express.Router()
import { sayHello } from '../controllers/auth.controller'
router.get('/hello', (req, res) => {
  sayHello(req, res)
})

export const authRouter = router
