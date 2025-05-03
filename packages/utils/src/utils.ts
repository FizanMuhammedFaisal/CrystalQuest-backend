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

export function createGrpcClient<T>(client: Record<string, any>): T {
  const promisified = {} as T

  for (const method in client) {
    if (typeof client[method] === 'function') {
      promisified[method as keyof T] = promisify(
        client[method].bind(client)
      ) as any
    }
  }

  return promisified
}
