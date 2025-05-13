import express from 'express'
import { getPlayers } from '../controller/player.controller.js'
const router = express.Router()

router.get('/', getPlayers)
export const playersRouter = router
