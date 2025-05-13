import express from 'express'
import { authRouter } from './auth.routes.js'
import { dashboardRouter } from './dashboard.routes.js'
import { gameRouter } from './game.router.js'
import { authenticate } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.use('/auth', authRouter)
router.use('/game', authenticate, gameRouter)
router.use('/dashboard', dashboardRouter)
export { router }
