import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getPlayersFromAuth } from '../controllers/dashboard.controller.js'

const router = express.Router()
router.get('/players-from-auth', getPlayersFromAuth)
router.use(
  '/',

  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
)

export const dashboardRouter = router
