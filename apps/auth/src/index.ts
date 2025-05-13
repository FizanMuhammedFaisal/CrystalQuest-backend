import 'reflect-metadata'
import * as grpc from '@grpc/grpc-js'
import { AuthServiceService } from '@backend/protos/dist/auth/auth.js'
import { getAuthService } from './service/service.js'
import { InitializeDataBase } from './db/dataSource.js'
import { User } from './db/models/user.js'
import { UserRepository } from './db/repository/auth.repository.js'
const PORT = process.env.AUTH_SERVICE_PORT || 50053
const HOST = process.env.AUTH_SERVICE_HOST || '0.0.0.0'
const address = `${HOST}:${PORT}`
async function main() {
  const AppDataSource = await InitializeDataBase()
  const typeOrmUserRepository = AppDataSource.getRepository(User)
  const UserRepositoryI = new UserRepository(typeOrmUserRepository)
  const server = new grpc.Server()
  server.addService(AuthServiceService, getAuthService(UserRepositoryI))
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err)
        return
      }

      console.log(`Auth service running on ${address}`)
    }
  )
}
main()
