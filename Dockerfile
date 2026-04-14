# syntax=docker/dockerfile:1.7

# Build the MCP HTTP server (server/http.ts → dist-server/server/http.js).
# better-sqlite3 is a native module; the build stage has the toolchain and
# compiles it once, then the runtime stage copies the compiled node_modules
# so the final image stays lean.
FROM node:22-alpine AS builder

WORKDIR /app

# Build toolchain for node-gyp fallback when prebuilds are missing.
RUN apk add --no-cache python3 make g++

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY server ./server
COPY src ./src

RUN pnpm build:server

# Strip dev deps but keep compiled native modules (better-sqlite3).
RUN pnpm prune --prod

FROM node:22-alpine AS runtime

WORKDIR /app

# Copy the pre-compiled production node_modules from the builder so we don't
# need python/make/g++ in the runtime image.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist-server ./dist-server

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    LUCENT_KEY_DB=/data/keys.db

EXPOSE 3000

CMD ["node", "dist-server/server/http.js"]
