import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { getDirname, createGrpcClient } from '@backend/utils'
import path from 'path'
const __dirname = getDirname(import.meta.url)
const backendDir = path.resolve(__dirname, '..', '..', '..')
console.log(backendDir)
const PROTO_PATH = path.join(backendDir, 'packages', 'protos', 'auth.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const authProto = grpc.loadPackageDefinition(packageDefinition).auth as any
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'localhost:50051'
const authClient: Record<string, Function> = new authProto.AuthService(
  AUTH_SERVICE_URL,
  grpc.credentials.createInsecure()
)

export interface AuthServiceClient {
  sayHello(request: { name: string }): Promise<{ message: string }>
  verifyToken(request: {
    token: string
  }): Promise<{ valid: boolean; userId?: string }>
}
const authService = createGrpcClient<AuthServiceClient>(authClient)

export default authService
