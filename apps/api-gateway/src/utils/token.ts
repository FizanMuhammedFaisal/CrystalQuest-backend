import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
config()
interface jwtUser {
  id: string
  email: string
  role: string
}
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ??
  ('1h' as jwt.SignOptions['expiresIn'])
const JWT_REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ??
  ('7d' as jwt.SignOptions['expiresIn'])

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export function genereateToken(user: jwtUser, refreshToken?: boolean) {
  console.log(user, 'user on jwt gereataeing')
  const expiresIn = refreshToken
    ? JWT_REFRESH_TOKEN_EXPIRES_IN
    : JWT_ACCESS_TOKEN_EXPIRES_IN

  const secret = refreshToken ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  const token = jwt.sign({ ...user }, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  })
  return token
}

export function verifyToken(token: string, refreshToken?: boolean) {
  const secret = refreshToken ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  try {
    const decoded = jwt.verify(token, secret)

    if (typeof decoded === 'object' && decoded !== null) {
      const { iat, exp, ...userData } = decoded as JwtPayload
      return userData
    }
  } catch (err) {
    console.log(err)
    return false
  }
}
