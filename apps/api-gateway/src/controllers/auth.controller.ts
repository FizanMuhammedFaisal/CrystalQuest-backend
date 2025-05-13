import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth/auth.service.js'
import { genereateToken, verifyToken } from '../utils/token.js'

/**
 * Say hello to the auth service
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export async function sayHello(req: Request, res: Response) {
  const name = (req.query.name as string) || 'World'
  console.log('name', name)
  const response = await authService.sayHello(name)
  return res.status(200).json(response)
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body
  console.log('email', email)

  const user = await authService.login(email, password)
  if (!user.success) {
    throw new Error('Invalid credentials')
  }
  const jwtUser = {
    id: user.userId,
    email: email,
    role: user.role,
  }
  const accessToken = genereateToken(jwtUser, false)
  const refreshToken = genereateToken(jwtUser, true)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  res.successMessage = 'User logged in successfully'
  return res.status(200).json({ user: jwtUser, accessToken })
}

export async function register(req: Request, res: Response) {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(400).json({
      error: true,
      message: 'Missing required fields',
      code: 'MISSING_REQUIRED_FIELDS',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }

  const { email, password, username } = req.body
  const user = await authService.register(username, email, password)
  const jwtUser = {
    id: user.userId,
    email: email,
    role: user.role,
  }
  const accessToken = genereateToken(jwtUser, false)
  const refreshToken = genereateToken(jwtUser, true)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  res.successMessage = 'User registered successfully'
  return res.status(200).json({ user: jwtUser, accessToken })
}

export async function refreshToken(req: Request, res: Response) {
  console.log(req.cookies)
  const refreshToken = req.cookies.refreshToken

  console.log(refreshToken, 'refreshToken')
  if (!refreshToken) {
    return res.status(403).json({
      error: true,
      message: 'Refresh token missing',
      code: 'MISSING_REFRESH_TOKEN',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }
  const verifed = verifyToken(refreshToken, true)
  console.log(verifed)
  if (verifed === false) {
    return res.status(403).json({
      error: true,
      message: 'Refresh token invalid',
      code: 'INVALID_REFRESH_TOKEN',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }
  const jwtUser = verifed
  console.log(jwtUser, 'jwtUser')
  const accessToken = genereateToken(jwtUser, false)
  res.successMessage = 'Access token refreshed'
  return res.status(200).json({ accessToken, user: jwtUser })
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken')
  res.successMessage = 'User logged out successfully'
  return res.status(200).json({})
}

export async function getProfile(req: Request, res: Response) {
  const user = req.user
  console.log(user, 'user')
  if (!user) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }
  res.successMessage = 'User profile fetched successfully'
  return res.status(200).json({ user })
}
