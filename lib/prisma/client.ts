/**
 * Prisma Client Singleton
 *
 * Previne múltiplas instâncias do Prisma Client em desenvolvimento (hot reload).
 * Referência: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from "@prisma/client"

import { logger } from "@/lib/logger"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

/**
 * Helper function para desconectar do Prisma (útil para testes e shutdown graceful)
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

/**
 * Health check do banco de dados
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error("Database connection failed", error, {
      component: "Prisma",
      action: "checkDatabaseConnection",
    })
    return false
  }
}
