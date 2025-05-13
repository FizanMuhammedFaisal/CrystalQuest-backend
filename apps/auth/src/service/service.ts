import {
  AuthServiceServer,
  GetPlayersRequest,
  GetPlayersResponse,
  HelloRequest,
  HelloResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'packages/protos/dist/auth/auth.js'
import { sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js'
import { UserRepository } from '../db/repository/auth.repository'
import * as bcrypt from 'bcrypt'
const SALT_ROUNDS = 10
export function getAuthService(
  userRepository: UserRepository
): AuthServiceServer {
  async function sayHello(
    call: ServerUnaryCall<HelloRequest, HelloResponse>,
    callback: sendUnaryData<HelloResponse>
  ) {
    try {
      callback(null, { message: 'Hello, world!' })
    } catch (err) {
      callback({ code: status.INTERNAL }, null)
      console.error(err)
    }
  }
  async function login(
    call: ServerUnaryCall<LoginRequest, LoginResponse>,
    callback: sendUnaryData<LoginResponse>
  ) {
    try {
      console.log(call.request)
      const email = call.request.email

      const user = await userRepository.findUserByEmail(call.request.email)
      console.log(user)
      if (!user) {
        return callback(
          { code: status.PERMISSION_DENIED, details: 'Invalid credentials' },
          null
        )
      }
      const userWithPassword =
        await userRepository.findUserWithPasswordByEmail(email)
      if (!userWithPassword) {
        return callback(
          { code: status.PERMISSION_DENIED, details: 'Invalid credentials' },
          null
        )
      }
      console.log(userWithPassword, call.request.password)
      const isValidPassword = await bcrypt.compare(
        call.request.password,
        userWithPassword.password
      )
      if (!isValidPassword) {
        return callback(
          { code: status.UNAUTHENTICATED, details: 'Invalid credentials' },
          null
        )
      }

      callback(null, { success: true, userId: user.id, role: user.role })
    } catch (err) {
      callback({ code: status.INTERNAL }, null)
      console.error(err)
    }
  }
  async function register(
    call: ServerUnaryCall<RegisterRequest, RegisterResponse>,
    callback: sendUnaryData<RegisterResponse>
  ) {
    try {
      const existingUser = await userRepository.findUserByEmail(
        call.request.email
      )
      if (existingUser) {
        return callback(
          {
            code: status.ALREADY_EXISTS,
            details: `User with email ${call.request.email} already exists`,
          },
          null
        )
      }
      const hashedPassword = await bcrypt.hash(
        call.request.password,
        SALT_ROUNDS
      )
      console.log(hashedPassword)
      const user = await userRepository.createUser(
        call.request.username,
        call.request.email,
        hashedPassword
      )
      if (!user) {
        return callback(
          { code: status.CANCELLED, details: 'Error creating user' },
          null
        )
      }
      callback(null, { success: true, userId: user.id, role: user.role })
    } catch (err) {
      callback(
        { code: status.INTERNAL, details: 'Internal Server Error' },
        null
      )
      console.error(err)
    }
  }
  async function getPlayers(
    call: ServerUnaryCall<GetPlayersRequest, GetPlayersResponse>,
    callback: sendUnaryData<GetPlayersResponse>
  ) {
    try {
      const { limit, page, search, sort, order } = call.request
      const parsedLimit = Number(limit)
      const parsedPage = Number(page)
      if (
        isNaN(parsedLimit) ||
        isNaN(parsedPage) ||
        typeof search !== 'string' ||
        typeof sort !== 'string' ||
        typeof order !== 'string'
      ) {
        return callback(
          {
            code: status.INVALID_ARGUMENT,
            details: 'Invalid query parameters',
          },
          null
        )
      }

      type OrderType = 'ASC' | 'DESC'
      let orderEnum: OrderType
      if (order === 'asc') {
        orderEnum = 'ASC' as OrderType
      } else {
        orderEnum = 'DESC' as OrderType
      }
      const { players, total } = await userRepository.findAllUsers(
        limit,
        search,
        sort,
        (page - 1) * limit,
        orderEnum
      )

      if (!players) {
        return callback(
          { code: status.NOT_FOUND, details: 'Players not found' },
          null
        )
      }
      callback(null, { players, total })
    } catch (err) {
      callback({ code: status.INTERNAL }, null)
      console.error(err)
    }
  }
  return { sayHello, login, register, getPlayers }
}
