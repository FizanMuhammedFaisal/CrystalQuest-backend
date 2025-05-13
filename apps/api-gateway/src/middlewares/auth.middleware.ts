import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
config()
interface DecodedUserPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}
declare global {
  namespace Express {
    interface Request {
      user?: DecodedUserPayload
    }
  }
}
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
console.log(JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET')
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader || typeof authHeader !== 'string') {
    console.log(
      'Auth Middleware: Authorization header missing or not a string.'
    )
    return res.status(401).json({
      error: true,
      message: 'Authorization header missing or invalid format',
      code: 'MISSING_AUTH_HEADER',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }
  //splitting into parts to access

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    console.log(
      'Auth Middleware: Authorization header is not in Bearer token format.'
    )

    return res.status(401).json({
      error: true,
      message: 'Authorization header must be in Bearer token format',
      code: 'INVALID_AUTH_FORMAT',
      requestId: req.headers['request-id'] || 'unknown',
    })
  }
  const token = parts[1]
  if (!JWT_ACCESS_SECRET) {
    throw new Error('JWT_ACCESS_SECRET is not defined')
  }
  jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      console.log('Auth Middleware: Token verification failed:', err.message)

      return res.status(401).json({
        error: true,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        requestId: req.headers['request-id'] || 'unknown',
        details:
          process.env.NODE_ENV !== 'production' ? err.message : undefined,
      })
    }

    req.user = decoded as DecodedUserPayload
    next()
  })
}
