api-gateway/
├── package.json
├── tsconfig.json # TypeScript configuration
├── server.ts # Main application entry point
├── config/
│ ├── index.ts # Main configuration and env variables
│ └── services.ts # Service discovery and connection details
├── proto/ # All proto files organized by service domain
│ ├── auth/
│ │ └── auth.proto
│ ├── products/
│ │ └── products.proto
│ ├── users/
│ │ └── users.proto
│ └── orders/
│ └── orders.proto
├── clients/ # gRPC client connections
│ ├── auth-client.ts
│ ├── products-client.ts
│ ├── users-client.ts
│ └── orders-client.ts
├── routes/ # Express routes grouped by domain
│ ├── index.ts # Main router that combines all routes
│ ├── auth-routes.ts
│ ├── products-routes.ts
│ ├── users-routes.ts
│ └── orders-routes.ts
├── controllers/ # Request handlers
│ ├── auth-controller.ts
│ ├── products-controller.ts
│ ├── users-controller.ts
│ └── orders-controller.ts
├── middlewares/ # Express middlewares
│ ├── auth-middleware.ts # Authentication middleware
│ ├── rate-limiter.ts # Rate limiting
│ ├── request-logger.ts # Logging middleware
│ └── error-handler.ts # Global error handling
├── types/ # TypeScript type definitions
│ ├── request.ts # Extended Express request types
│ ├── response.ts # Response type definitions
│ ├── auth.ts # Auth-related types
│ ├── products.ts # Product-related types
│ ├── users.ts # User-related types
│ └── orders.ts # Order-related types
└── utils/ # Utility functions
├── response-formatter.ts # Format API responses
├── validation.ts # Request validation helpers
├── circuit-breaker.ts # Circuit breaker for resilience
└── monitoring.ts # Monitoring and metrics

///

// For each microservice, follow this pattern:

1. Proto Definition (/proto/[service-name]/[service-name].proto)

   - Define all RPC methods available for the service
   - Use shared message types where appropriate
   - Version your proto files (consider a /v1/ folder)

2. gRPC Client (/clients/[service-name]-client.js)

   - Create a promisified wrapper around gRPC methods
   - Handle connection pooling and retries
   - Implement circuit breaker pattern
   - Example:

   ```javascript
   const productsService = {
     getProduct: (id) => {
       return new Promise((resolve, reject) => {
         productsClient.getProduct({ id }, handleGrpcResponse(resolve, reject))
       })
     },
     // Other methods...
   }
   ```

3. Controller (/controllers/[service-name]-controller.js)

   - Keep business logic minimal
   - Focus on request validation and response formatting
   - Handle errors properly
   - Use the service client

4. Routes (/routes/[service-name]-routes.js)
   - Define RESTful endpoints
   - Apply appropriate middlewares
   - Map to controller methods
