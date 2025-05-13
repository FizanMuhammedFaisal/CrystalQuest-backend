// src/services/auth/auth.service.ts
import { BaseGrpcService } from '../baseService.js'
import {
  AuthServiceClient,
  GetPlayersRequest,
  GetPlayersResponse,
  HelloRequest,
  HelloResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@backend/protos/dist/auth/auth.js'
import { credentials } from '@grpc/grpc-js'

/**
 * Service for interacting with the Auth gRPC service
 */
export class AuthService extends BaseGrpcService<AuthServiceClient> {
  constructor() {
    const serviceUrl = process.env.AUTH_SERVICE_URL ?? '0.0.0.0:50053'
    const client = new AuthServiceClient(
      serviceUrl,
      credentials.createInsecure()
    )

    super(client)
  }

  /**
   * Say hello to the auth service
   * @param name The name to greet
   * @returns A greeting message
   */
  async sayHello(name: string): Promise<HelloResponse> {
    const request: HelloRequest = { name }
    return this.callMethod<HelloRequest, HelloResponse>('sayHello', request)
  }

  /**
   * login users
   * @param email @param password The name to greet
   * @returns A greeting message
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const request: LoginRequest = { email, password }
    return this.callMethod<LoginRequest, LoginResponse>('login', request)
  }
  /**
   * register users
   * @param email @param password The name to greet
   * @returns A greeting message
   */
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    const request: RegisterRequest = { username, email, password }
    return this.callMethod<RegisterRequest, RegisterResponse>(
      'register',
      request
    )
  }
  /**
   * register users
   * @param email @param password The name to greet
   * @returns A greeting message
   */
  async getPlayers({
    limit,
    page,
    search,
    sort,
    order,
  }: GetPlayersRequest): Promise<GetPlayersResponse> {
    const request: GetPlayersRequest = {
      limit,
      page,
      search,
      sort,
      order,
    }
    return this.callMethod<GetPlayersRequest, GetPlayersResponse>(
      'getPlayers',
      request
    )
  }
}

export const authService = new AuthService()
