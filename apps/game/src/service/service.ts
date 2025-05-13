import { sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js'
import {
  GameServiceServer,
  HelloRequest,
  HelloResponse,
} from '@backend/protos/dist/game/game'

export function getGameService(): GameServiceServer {
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

  return { sayHello }
}
