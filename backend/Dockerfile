FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml* turbo.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @furniture/prisma generate
RUN pnpm --filter @furniture/api build

EXPOSE 4000
CMD ["pnpm","--filter","@furniture/api","start"]



