import { status as grpcStatus } from '@grpc/grpc-js'
import { NextFunction, Request, Response } from 'express'

function mapGrpcStatusToHttpStatus(grpcCode: grpcStatus | undefined): number {
  // Handle undefined or non-numeric codes gracefully
  if (typeof grpcCode !== 'number') {
    return 500 // Default to Internal Server Error if code is not a number
  }
  switch (grpcCode) {
    case grpcStatus.OK:
      return 200 // Should ideally not be handled as an error
    case grpcStatus.CANCELLED:
      return 499 // Client closed request
    case grpcStatus.UNKNOWN:
      return 500
    case grpcStatus.INVALID_ARGUMENT:
      return 400 // Bad Request
    case grpcStatus.DEADLINE_EXCEEDED:
      return 504 // Gateway Timeout
    case grpcStatus.NOT_FOUND:
      return 404 // Not Found
    case grpcStatus.ALREADY_EXISTS:
      return 409 // Conflict
    case grpcStatus.PERMISSION_DENIED:
      return 403 // Forbidden
    case grpcStatus.UNAUTHENTICATED:
      return 401 // Unauthorized
    case grpcStatus.RESOURCE_EXHAUSTED:
      return 429 // Too Many Requests
    case grpcStatus.FAILED_PRECONDITION:
      return 400 // Bad Request (client errors)
    case grpcStatus.ABORTED:
      return 409 // Conflict (concurrent errors)
    case grpcStatus.OUT_OF_RANGE:
      return 400 // Bad Request
    case grpcStatus.UNIMPLEMENTED:
      return 501 // Not Implemented
    case grpcStatus.INTERNAL:
      return 500 // Internal Server Error
    case grpcStatus.UNAVAILABLE:
      return 503 // Service Unavailable
    case grpcStatus.DATA_LOSS:
      return 500 // Internal Server Error
    default:
      return 500 // Default to Internal Server Error for unknown codes
  }
}

//

interface BaseError extends Error {
  code?: any
  details?: string
  statusName?: string
}
export const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('err', err)

  let statusCode = 500
  let errorResponse = {
    error: true,
    message: 'An unexpected error occurred.',
    code: 'INTERNAL_SERVER_ERROR',
    requestId: req.headers['request-id'] || 'unknown',
    details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  }
  if (
    err.code !== undefined &&
    typeof err.code === 'number' &&
    grpcStatus[err.code] !== undefined
  ) {
    statusCode = mapGrpcStatusToHttpStatus(err.code as grpcStatus)
    errorResponse.message = err.details ?? `gRPC Error: ${grpcStatus[err.code]}`
    errorResponse.code = grpcStatus[err.code] || 'GRPC_ERROR'
    // You might want to include gRPC details in dev/staging environments
    if (process.env.NODE_ENV !== 'production' && err.details) {
      ;(errorResponse as any).grpcDetails = err.details // Add grpcDetails field
    }
  }
  const sendJson = res.originalJson || res.json
  res.status(statusCode)
  sendJson.call(res, errorResponse)
}
