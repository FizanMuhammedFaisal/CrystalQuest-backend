import * as grpc from '@grpc/grpc-js'
import { GameServiceServer } from '@backend/protos/dist/game/game'
const PORT = process.env.AUTH_SERVICE_PORT || 50052
const HOST = process.env.AUTH_SERVICE_HOST || '0.0.0.0'
const address = `${HOST}:${PORT}`
function main() {
  const server = new grpc.Server()

  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err)
        return
      }

      server.start()
      console.log(`Auth service running on ${address}`)
    }
  )
}
