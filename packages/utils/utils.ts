import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Utility to get __dirname in ESM.
 * @param metaUrl import.meta.url
 * @returns string (the directory path)
 */
export function getDirname(metaUrl: string): string {
  const __filename = fileURLToPath(metaUrl);
  return path.dirname(__filename);
}
