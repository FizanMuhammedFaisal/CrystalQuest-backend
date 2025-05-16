import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getPlayersFromAuth } from '../controllers/dashboard.controller.js'

const addrss = process.env.DASHBOARD_SERVICE_URL
console.log(`Dashboard service address: ${addrss}`)
const router = express.Router()
router.get('/players-from-auth', getPlayersFromAuth)
router.use(
  '/',
  createProxyMiddleware({
    target: addrss,
    changeOrigin: true,
    pathRewrite: {
      '^/dashboard': '',
    },
  })
)

export const dashboardRouter = router
