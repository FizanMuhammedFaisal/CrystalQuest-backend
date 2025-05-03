import express from 'express'
import { authRouter } from './auth.routes'
import { dashboardRouter } from './dashboard.routes'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/dashboard', dashboardRouter)
export { router }
