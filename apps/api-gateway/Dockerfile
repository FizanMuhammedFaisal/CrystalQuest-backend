
FROM node:20-alpine AS builder_stage
WORKDIR /repo
ENV NODE_ENV=development


COPY package.json package-lock.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/protos/package.json ./packages/protos/
COPY packages/utils/package.json ./packages/utils/

# Install all dependencies
RUN npm install --workspaces --legacy-peer-deps

# Add remaining files
COPY . .

# Build api-gateway and its dependencies
RUN npx turbo run build --filter="api-gateway..."


# 2️⃣ Production Stage

FROM node:20-alpine AS production_stage
WORKDIR /app

ENV NODE_ENV=production

# Copy built output
COPY --from=builder_stage /repo/apps/api-gateway/dist ./dist
COPY --from=builder_stage /repo/apps/api-gateway/package.json ./package.json

# Copy only required node_modules (from full build)
COPY --from=builder_stage /repo/node_modules ./node_modules
COPY --from=builder_stage /repo/packages ./packages

# Clean up source code (optional)
RUN rm -rf ./packages/**/src ./packages/**/tsconfig.* ./packages/**/tests

EXPOSE 3001
CMD ["node", "dist/index.js"]
