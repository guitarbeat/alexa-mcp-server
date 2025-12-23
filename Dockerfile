# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . ./
# Type check only - no compilation needed since we use tsx at runtime
RUN pnpm run type-check

# ---- Release ----
FROM node:20-alpine AS release

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/worker-configuration.d.ts ./

ENV NODE_ENV=production

# Install all deps for tsx runtime
RUN pnpm install --frozen-lockfile

EXPOSE 10000
CMD ["pnpm", "run", "start:node"]
