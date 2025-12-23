# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run build

# ---- Release ----
FROM node:20-alpine AS release

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

RUN pnpm install --prod --frozen-lockfile

EXPOSE 10000
ENTRYPOINT ["node", "dist/express-index.js"]
