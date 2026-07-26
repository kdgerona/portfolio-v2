# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

# ---------------------------------------------------------------------------
# Stage 1: deps — install dependencies only, so this layer is cached
# whenever package.json/package-lock.json are unchanged.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# musl-libc compatibility layer for prebuilt native binaries
# (sharp, @next/swc) on Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------------------------------------------------------------------------
# Stage 2: builder — build the Next.js app.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: runner — minimal production image. Only the output-file-traced
# standalone bundle, static assets, and public/ are copied in — no
# node_modules, no source, no devDependencies.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# node:alpine images ship a built-in non-root "node" user (uid/gid 1000).
COPY --from=builder --chown=node:node /app/public ./public

# Prerender cache needs to be writable by the runtime user.
RUN mkdir .next && chown node:node .next

# output: 'standalone' tracing result — includes only the files/deps
# actually needed to run (this is where `sharp` gets pulled in).
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
