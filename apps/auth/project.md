## Auth Service Structure

Here's a recommended structure for your auth service:

```
auth-service/
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts                # Main server entry point
│   ├── service/
│   │   └── auth-service.ts      # Service implementation
│   ├── middleware/
│   │   ├── error-handler.ts     # Error handling middleware
│   │   └── logger.ts            # Logging middleware
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── password.ts          # Password hashing utilities
│   │   └── validation.ts        # Validation utilities
│   ├── config/
│   │   └── index.ts             # Configuration
│   └── db/                      # Database connection and models
│       ├── index.ts
│       └── models/
│           └── user.ts
└── tests/
    └── auth-service.test.ts
```

This structure separates concerns and makes your code more maintainable.

//

import \* as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../middleware/logger';

// In a real implementation, you would fetch users from a database
// This is just a simple in-memory example
const users = [
{
id: 'user-123',
username: 'demo',
password: '$2a$10$XmPXMjd0o1h1WXhwDn4zLu8oLyJC1tdpF6UzKgxY9.uqKGau1wY/C', // 'password' hashed
email: 'demo@example.com',
fullName: 'Demo User',
roles: ['user']
}
];

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export class AuthService {
/\*\*

- Simple hello world method for testing
  \*/
  sayHello(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): void {
  try {
  const name = call.request.name || 'Anonymous';
  logger.info(`SayHello called with name: ${name}`);
  callback(null, { message: `Hello, ${name}!` });
  } catch (error) {
  logger.error('Error in sayHello:', error);
  callback({
  code: grpc.status.INTERNAL,
  message: 'Internal Server Error'
  });
  }
  }

/\*\*

- Verify JWT token
  \*/
  verifyToken(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): void {
  try {
  const token = call.request.token;
  if (!token) {
  return callback(null, { valid: false, error: 'Token is required' });
  }

      // Verify the token
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          logger.warn(`Invalid token: ${err.message}`);
          return callback(null, { valid: false, error: 'Invalid token' });
        }

        logger.info(`Token verified for user: ${decoded.userId}`);
        callback(null, { valid: true, userId: decoded.userId });
      });

  } catch (error) {
  logger.error('Error in verifyToken:', error);
  callback({
  code: grpc.status.INTERNAL,
  message: 'Internal Server Error'
  });
  }
  }

/\*\*

- Login user
  \*/
  login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): void {
  try {
  const { username, password } = call.request;
  // Validate input
  if (!username || !password) {
  return callback(null, {
  success: false,
  error: 'Username and password are required'
  });
  }

      // Find user
      const user = users.find(u => u.username === username);
      if (!user) {
        logger.warn(`Login attempt with invalid username: ${username}`);
        return callback(null, { success: false, error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        logger.warn(`Login attempt with invalid password for user: ${username}`);
        return callback(null, { success: false, error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles
      }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      logger.info(`User logged in: ${username}`);

      // Return success with token and user info (excluding password)
      callback(null, {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles
        }
      });

  } catch (error) {
  logger.error('Error in login:', error);
  callback({
  code: grpc.status.INTERNAL,
  message: 'Internal Server Error'
  });
  }
  }

/\*\*

- Register new user
  \*/
  register(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): void {
  try {
  const { username, email, password, fullName } = call.request;
  // Validate input
  if (!username || !email || !password) {
  return callback(null, {
  success: false,
  error: 'Username, email, and password are required'
  });
  }

        // Check if user already exists
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
          return callback(null, {
            success: false,
            error: 'Username or email already exists'
          });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          username,
          email,
          password: hashedPassword,
          fullName: fullName || username,
          roles: ['user']
        };

        // In a real implementation, you would save to database
        users.push(newUser);

        logger.info(`New user registered: ${username}`);

        callback(null, {
          success: true,
          userId: newUser.id
        });
      } catch (error) {
        logger.error('Error in register:', error);
        callback({
          code: grpc.status.INTERNAL,
          message: 'Internal Server Error'
        });
      }

  }
  }

// Export an instance of the service
export const authService = new AuthService();

//logger//

import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
winston.format.timestamp(),
winston.format.printf(({ timestamp, level, message }) => {
return `${timestamp} [${level}]: ${message}`;
})
);

// Create the logger
export const logger = winston.createLogger({
level: process.env.LOG_LEVEL || 'info',
format: logFormat,
transports: [
// Console transport
new winston.transports.Console({
format: winston.format.combine(
winston.format.colorize(),
logFormat
),
}),
// File transport for errors
new winston.transports.File({
filename: 'error.log',
level: 'error'
}),
// File transport for all logs
new winston.transports.File({
filename: 'combined.log'
})
],
});

// Create a stream object for Morgan
export const stream = {
write: (message: string) => {
logger.info(message.trim());
},
};

// Log uncaught exceptions
logger.exceptions.handle(
new winston.transports.File({ filename: 'exceptions.log' })
);

// Log unhandled promise rejections
process.on('unhandledRejection', (error) => {
logger.error('Unhandled Rejection:', error);
});

//add to server .ts
/ Add the service implementation
server.addService(authProto.AuthService.service, {
sayHello: authService.sayHello,
verifyToken: authService.verifyToken,
login: authService.login,
register: authService.register
});
//

//
config

//

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Server configuration
export const SERVER_CONFIG = {
host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
port: parseInt(process.env.AUTH_SERVICE_PORT || '50051', 10)
};

// JWT configuration
export const JWT_CONFIG = {
secret: process.env.JWT_SECRET || 'your-secret-key',
expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};

// Database configuration (for future use)
export const DB_CONFIG = {
uri: process.env.DB_URI || 'mongodb://localhost:27017/auth-service',
options: {
useNewUrlParser: true,
useUnifiedTopology: true
}
};

// Logging configuration
export const LOG_CONFIG = {
level: process.env.LOG_LEVEL || 'info'
};

// Export all configuration
export default {
server: SERVER_CONFIG,
jwt: JWT_CONFIG,
db: DB_CONFIG,
log: LOG_CONFIG
};
