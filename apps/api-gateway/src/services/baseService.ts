import { Metadata, status } from '@grpc/grpc-js'

/**
 * Base class for all gRPC services
 */

export interface GrpcServiceError extends Error {
  code: number
  statusName: string
  metadata?: Metadata
  originalError?: any
}

export class GrpcError extends Error implements GrpcServiceError {
  code: number
  statusName: string
  metadata?: Metadata
  originalError?: any

  constructor(
    message: string,
    code: number,
    statusName: string,
    metadata?: Metadata,
    originalError?: any
  ) {
    super(message)
    this.name = 'GrpcError'
    this.code = code
    this.statusName = statusName
    this.metadata = metadata
    this.originalError = originalError
  }
}
export class BaseGrpcService<ClientType> {
  protected client: ClientType

  constructor(client: ClientType) {
    this.client = client
  }

  /**
   * Calls a gRPC method and returns a Promise
   * @param methodName The name of the method to call
   * @param request The request object
   * @param metadata Optional metadata to include with the request
   * @returns A Promise that resolves with the response
   */

  protected callMethod<RequestType, ResponseType>(
    methodName: keyof ClientType,
    request: RequestType,
    metadata?: Metadata
  ): Promise<ResponseType> {
    return new Promise((resolve, reject) => {
      const method = this.client[methodName] as any
      if (!method || typeof method !== 'function') {
        reject(
          new Error(`Method ${String(methodName)} not found on gRPC client`)
        )
        return
      }

      if (metadata) {
        method.call(
          this.client,
          request,
          metadata,
          (err: any, response: ResponseType) => {
            console.log('err', err)
            if (err) reject(this.handleGrpcError(err))
            else resolve(response)
          }
        )
      } else {
        method.call(
          this.client,
          request,
          (err: any, response: ResponseType) => {
            console.log('err', err)
            if (err) reject(this.handleGrpcError(err))
            else resolve(response)
          }
        )
      }
    })
  }

  /**
   * Processes gRPC errors to provide more meaningful error objects
   * @param error The original gRPC error
   * @returns A processed error object
   */
  protected handleGrpcError(error: any): GrpcServiceError {
    // You can customize error handling here
    // For example, map gRPC status codes to custom error classes

    const errorMessage = error.details ?? error.message ?? 'Unknown gRPC error'

    // Map common gRPC status codes to friendly names
    const statusMap: Record<number, string> = {
      [status.CANCELLED]: 'CANCELLED',
      [status.UNKNOWN]: 'UNKNOWN',
      [status.INVALID_ARGUMENT]: 'INVALID_ARGUMENT',
      [status.DEADLINE_EXCEEDED]: 'DEADLINE_EXCEEDED',
      [status.NOT_FOUND]: 'NOT_FOUND',
      [status.ALREADY_EXISTS]: 'ALREADY_EXISTS',
      [status.PERMISSION_DENIED]: 'PERMISSION_DENIED',
      [status.UNAUTHENTICATED]: 'UNAUTHENTICATED',
      [status.RESOURCE_EXHAUSTED]: 'RESOURCE_EXHAUSTED',
      [status.FAILED_PRECONDITION]: 'FAILED_PRECONDITION',
      [status.ABORTED]: 'ABORTED',
      [status.OUT_OF_RANGE]: 'OUT_OF_RANGE',
      [status.UNIMPLEMENTED]: 'UNIMPLEMENTED',
      [status.INTERNAL]: 'INTERNAL',
      [status.UNAVAILABLE]: 'UNAVAILABLE',
      [status.DATA_LOSS]: 'DATA_LOSS',
    }
    const statusName = statusMap[error.code] || 'UNKNOWN'
    const enhancedError = new GrpcError(
      errorMessage,
      error.code,
      statusName,
      error.metadata,
      error
    )

    return enhancedError
  }

  /**
   * Creates metadata for requests
   * @param headers Optional headers to include
   * @returns Metadata object
   */
  protected createMetadata(headers?: Record<string, string>): Metadata {
    const metadata = new Metadata()

    // Add default headers for all requests
    metadata.set('client-version', '1.0.0')
    metadata.set('request-id', this.generateRequestId())

    // Add custom headers
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        metadata.set(key, value)
      })
    }

    return metadata
  }

  /**
   * Generates a unique request ID
   * @returns A unique string
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  }
}
