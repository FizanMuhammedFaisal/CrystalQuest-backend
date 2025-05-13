import express from 'express'
import { playersRouter } from './players.routes.js'
const router = express.Router()

router.use('/players', playersRouter)
export default router
