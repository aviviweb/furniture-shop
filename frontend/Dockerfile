FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* turbo.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (needed for shared packages)
RUN pnpm --filter @furniture/prisma generate

# Build the application
RUN pnpm --filter @furniture/web build

# Expose port
EXPOSE 3000

# Set PORT environment variable and start
ENV PORT=3000
ENV NODE_ENV=production

CMD ["pnpm", "--filter", "@furniture/web", "start"]


