import { fileURLToPath } from 'url'
import path from 'path'
import { promisify } from 'util'
/**
 * Utility to get __dirname in ESM.
 * @param metaUrl import.meta.url
 * @returns string (the directory path)
 */
export function getDirname(metaUrl: string): string {
  const __filename = fileURLToPath(metaUrl)
  return path.dirname(__filename)
}

export function utils(): string {
  return 'utils'
}

/**
 * Utility to get create promisified grpc client.
 * @param client
 * @returns promisified client
 */
export function createGrpcClient<T>(client: any): T {
  const promisified = {} as T

  for (const method in client) {
    if (typeof client[method] === 'function') {
      promisified[method as keyof T] = async (
        request: any,
        options?: grpc.CallOptions
      ): Promise<any> => {
        return new Promise((resolve, reject) => {
          client[method](
            request,
            options || {},
            (error: grpc.ServiceError | null, response: any) => {
              if (error) {
                reject(error)
                return
              }
              resolve(response)
            }
          )
        })
      }
    }
  }

  return promisified
}
