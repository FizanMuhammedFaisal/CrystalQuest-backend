import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

// Get the current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const rootDir = path.resolve(__dirname, '..', '..', '..') // Adjust as needed
// Load the proto file
const PROTO_PATH = path.join(rootDir, 'packages', 'protos', 'auth.proto')
console.log(PROTO_PATH)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const authProto = grpc.loadPackageDefinition(packageDefinition).auth as any

const sayHello = (
  call: grpc.ServerUnaryCall<any, any>,
  callback: grpc.sendUnaryData<any>
) => {
  const name = call.request.name || 'Anonymous'
  callback(null, { message: `Hello, ${name}!` })
}

// Create the server
function startServer() {
  const server = new grpc.Server()

  // Add the service implementation
  server.addService(authProto.AuthService.service, {
    sayHello
  })

  // Start the server
  const port = process.env.AUTH_SERVICE_PORT || 50051
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err)
        return
      }

      server.start()
      console.log(`Auth service running on 0.0.0.0:${port}`)
    }
  )

  return server
}

// Start the server
const server = startServer()

// Handle graceful shutdown
function shutdown() {
  console.log('Shutting down auth service...')
  server.tryShutdown(() => {
    console.log('Auth service shut down successfully')
    process.exit(0)
  })
}

// Listen for termination signals
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
