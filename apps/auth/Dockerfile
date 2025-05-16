
FROM node:20-alpine AS builder_stage
WORKDIR /repo
ENV NODE_ENV=development


COPY package.json package-lock.json ./
COPY apps/auth/package.json ./apps/auth/
COPY packages/protos/package.json ./packages/protos/
COPY packages/utils/package.json ./packages/utils/

# Install all dependencies
RUN npm install --workspaces --legacy-peer-deps

# Add remaining files
COPY . .

# Build auth and its dependencies
RUN npx turbo run build --filter="auth..."


# 2️⃣ Production Stage

FROM node:20-alpine AS production_stage
WORKDIR /app

ENV NODE_ENV=production

# Copy built output
COPY --from=builder_stage /repo/apps/auth/dist ./dist
COPY --from=builder_stage /repo/apps/auth/package.json ./package.json

# Copy only required node_modules (from full build)
COPY --from=builder_stage /repo/node_modules ./node_modules
COPY --from=builder_stage /repo/packages ./packages

# Clean up source code (optional)
RUN rm -rf ./packages/**/src ./packages/**/tsconfig.* ./packages/**/tests


CMD ["sh", "-c", "npm run migration:run && node dist/index.js"]
