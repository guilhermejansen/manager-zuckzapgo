# ==============================================================================
# Multi-Stage Dockerfile for Next.js 16 with Bun and Prisma
# Optimized for production deployment without source code exposure
# Supports: linux/amd64, linux/arm64
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies
# Install only production dependencies for smaller final image
# ------------------------------------------------------------------------------
FROM oven/bun:1.3-alpine AS deps

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock* ./

# Copy Prisma schema (required for prisma generate)
COPY prisma ./prisma/

# Install production dependencies (ignore postinstall, run prisma generate manually)
RUN bun install --frozen-lockfile --production --ignore-scripts && \
    bunx prisma generate

# ------------------------------------------------------------------------------
# Stage 2: Builder
# Build the application with all dependencies
# ------------------------------------------------------------------------------
FROM oven/bun:1.3-alpine AS builder

# Install build dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files and lockfile
COPY package.json bun.lock* ./

# Copy Prisma schema (required for prisma generate)
COPY prisma ./prisma/

# Install all dependencies (ignore postinstall, run prisma generate manually)
RUN bun install --frozen-lockfile --ignore-scripts && \
    bunx prisma generate

# Copy source code
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN bun run build

# ------------------------------------------------------------------------------
# Stage 3: Runner
# Final production image with minimal footprint using Bun runtime
# ------------------------------------------------------------------------------
FROM oven/bun:1.3-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    tzdata \
    curl \
    netcat-openbsd \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set timezone (can be overridden via environment variable)
ENV TZ=America/Sao_Paulo

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy production node_modules from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy Prisma files (needed for migrations at runtime)
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy Next.js standalone build output
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static

# Copy public folder
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Copy worker source files (Bun runs TypeScript natively)
COPY --from=builder --chown=nodejs:nodejs /app/lib ./lib

# Copy package.json and bun.lock for metadata
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/bun.lock* ./

# Copy entrypoint script
COPY --chown=nodejs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy healthcheck script
COPY --chown=nodejs:nodejs healthcheck.ts ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check using Bun
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun run healthcheck.ts || exit 1

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default command - run Next.js with Bun
CMD ["bun", "--bun", "server.js"]
