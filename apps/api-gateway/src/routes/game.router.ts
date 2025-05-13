import express from 'express'
const router = express.Router()
import { getPlayers } from '../controllers/game.controller.js'
import { sayHello } from '../controllers/auth.controller.js'
router.get('/hello', sayHello)
router.get('/players', getPlayers)
export const gameRouter = router
