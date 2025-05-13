import express from 'express'
const router = express.Router()
import {
  sayHello,
  login,
  register,
  refreshToken,
  logout,
  getProfile,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
router.get('/hello', authenticate, sayHello)
router.post('/login', login)
router.post('/register', register)
router.get('/refresh-token', refreshToken)
router.get('/logout', logout)
router.get('/profile', authenticate, getProfile)
export const authRouter = router
