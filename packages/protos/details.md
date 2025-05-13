if you machine does not have protobuf installed use install it or
Alternatively, use a local protoc via npm:

npm install --save-dev proto

// if you are going local replace this on package json
"generate": "npx protoc --ts\*proto_out=./dist --ts_proto_opt=outputServices=generic-definitions,esModuleInterop=true,importSuffix=.js --proto_path=./src ./src/\*\*/\_.proto"

Protos Package
Contains `.proto` files and dist TS types for services.

## Scripts

- `npm run generate`: Generate TS types.
- `npm run watch`: Watch for `.proto` changes.
- `npm run build`: Clean and generate types.

## Adding a New Service

1. Create `src//<service>/<service>.proto`.
2. Run `npm run generate` or rely on `watch`.
