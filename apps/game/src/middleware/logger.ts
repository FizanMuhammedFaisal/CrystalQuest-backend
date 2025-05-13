import winston from 'winston'
import { format, transports } from 'winston'

// Determine environment (development or production)
const isDevelopment = process.env.NODE_ENV !== 'production'

// Define custom log format
const logFormat = isDevelopment
  ? format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`
      })
    )
  : format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    )

// Create Winston logger
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new transports.Console({
      level: isDevelopment ? 'debug' : 'info',
      silent: process.env.NODE_ENV === 'test',
    }),
    // File transports for production
    ...(isDevelopment
      ? []
      : [
          new transports.File({ filename: 'logs/error.log', level: 'error' }),
          new transports.File({ filename: 'logs/app.log' }),
        ]),
  ],
})

// Export logger with the same interface as before
export const logger = {
  info: (message: string) => logger.info(message),
  error: (message: string, error?: unknown) => logger.error(message, { error }),
  debug: (message: string) => logger.debug(message),
  warn: (message: string) => logger.warn(message),
}
