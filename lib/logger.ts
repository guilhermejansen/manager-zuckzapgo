/**
 * Manager ZuckZapGo - Professional Logging System
 *
 * Native Next.js logging solution with:
 * - Zero dependencies
 * - ANSI colors for Node.js terminal
 * - CSS styles for browser console
 * - TypeScript type-safe
 * - Context-aware (server/client)
 * - Structured JSON for production
 * - Pretty format for development
 *
 * @module lib/logger
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Log levels in order of severity
 */
type LogLevel = "debug" | "info" | "warn" | "error" | "success"

/**
 * Log context for additional information
 */
interface LogContext {
  /** Component or module name */
  component?: string
  /** Action or function being performed */
  action?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** User ID (if applicable) */
  userId?: string
  /** Request ID (if applicable) */
  requestId?: string
}

/**
 * Structured log entry
 */
interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error | unknown
  data?: unknown
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Get log level from environment
 * Default: info
 */
function getLogLevel(): LogLevel {
  const level = (process.env.NEXT_PUBLIC_LOG_LEVEL || "info") as LogLevel
  const validLevels: LogLevel[] = ["debug", "info", "warn", "error", "success"]
  return validLevels.includes(level) ? level : "info"
}

/**
 * Check if console logs are enabled
 * Default: true in development, false in production
 * Automatically disabled during Next.js build to prevent build-time API call logs
 */
function areLogsEnabled(): boolean {
  // Disable logs during Next.js build
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return false
  }

  if (process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS !== undefined) {
    return process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS === "true"
  }
  return process.env.NODE_ENV === "development"
}

/**
 * Get log format from environment
 * Default: pretty in development, json in production
 */
function getLogFormat(): "pretty" | "json" {
  const format = process.env.NEXT_PUBLIC_LOG_FORMAT
  if (format === "json" || format === "pretty") {
    return format
  }
  return process.env.NODE_ENV === "production" ? "json" : "pretty"
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

class Logger {
  private readonly isServer: boolean
  private readonly isDev: boolean
  private readonly minLevel: LogLevel
  private readonly enabled: boolean
  private readonly format: "pretty" | "json"

  // Log level priorities (higher = more severe)
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    success: 2,
    warn: 3,
    error: 4,
  }

  // ANSI color codes for Node.js terminal
  private readonly ansiColors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  }

  // CSS styles for browser console
  private readonly browserStyles = {
    debug: "color: #6B7280; font-weight: normal",
    info: "color: #3B82F6; font-weight: bold",
    success: "color: #10B981; font-weight: bold",
    warn: "color: #F59E0B; font-weight: bold",
    error: "color: #EF4444; font-weight: bold",
    timestamp: "color: #9CA3AF; font-weight: normal",
    context: "color: #8B5CF6; font-weight: normal",
  }

  constructor() {
    this.isServer = typeof window === "undefined"
    this.isDev = process.env.NODE_ENV === "development"
    this.minLevel = getLogLevel()
    this.enabled = areLogsEnabled()
    this.format = getLogFormat()
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    return this.levelPriority[level] >= this.levelPriority[this.minLevel]
  }

  /**
   * Get emoji for log level
   */
  private getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      debug: "🔍",
      info: "ℹ️",
      success: "✅",
      warn: "⚠️",
      error: "❌",
    }
    return emojis[level]
  }

  /**
   * Get ANSI color for log level
   */
  private getAnsiColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      debug: this.ansiColors.gray,
      info: this.ansiColors.cyan,
      success: this.ansiColors.green,
      warn: this.ansiColors.yellow,
      error: this.ansiColors.red,
    }
    return colors[level]
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  /**
   * Format log entry as JSON
   */
  private formatJson(entry: LogEntry): string {
    return JSON.stringify(entry)
  }

  /**
   * Format log entry as pretty text for terminal (server-side)
   */
  private formatPrettyServer(entry: LogEntry): string {
    const color = this.getAnsiColor(entry.level)
    const emoji = this.getEmoji(entry.level)
    const reset = this.ansiColors.reset
    const dim = this.ansiColors.dim
    const bright = this.ansiColors.bright

    let output = `${dim}${entry.timestamp}${reset} ${emoji} ${color}${bright}[${entry.level.toUpperCase()}]${reset} ${entry.message}`

    if (entry.context) {
      const contextParts: string[] = []
      if (entry.context.component) {
        contextParts.push(`component=${entry.context.component}`)
      }
      if (entry.context.action) {
        contextParts.push(`action=${entry.context.action}`)
      }
      if (entry.context.userId) {
        contextParts.push(`user=${entry.context.userId}`)
      }
      if (entry.context.requestId) {
        contextParts.push(`request=${entry.context.requestId}`)
      }
      if (contextParts.length > 0) {
        output += ` ${this.ansiColors.magenta}(${contextParts.join(", ")})${reset}`
      }
    }

    return output
  }

  /**
   * Log entry with formatting
   */
  private log(level: LogLevel, message: string, error?: Error | unknown, context?: LogContext) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      error: error instanceof Error ? error : error,
    }

    // JSON format (production)
    if (this.format === "json") {
      console.log(this.formatJson(entry))
      return
    }

    // Pretty format (development)
    if (this.isServer) {
      // Server-side: ANSI colors
      console.log(this.formatPrettyServer(entry))

      if (error) {
        if (error instanceof Error) {
          console.error(
            `${this.ansiColors.red}${error.stack || error.message}${this.ansiColors.reset}`
          )
        } else {
          console.error(error)
        }
      }

      if (context?.metadata) {
        console.log(`${this.ansiColors.gray}Metadata:${this.ansiColors.reset}`, context.metadata)
      }
    } else {
      // Client-side: CSS styles
      const emoji = this.getEmoji(level)
      const style = this.browserStyles[level]
      const timestampStyle = this.browserStyles.timestamp
      const contextStyle = this.browserStyles.context

      const logArgs: unknown[] = [
        `%c${entry.timestamp} %c${emoji} [${level.toUpperCase()}] %c${message}`,
        timestampStyle,
        style,
        "color: inherit; font-weight: normal",
      ]

      if (context) {
        const contextParts: string[] = []
        if (context.component) contextParts.push(`component=${context.component}`)
        if (context.action) contextParts.push(`action=${context.action}`)
        if (context.userId) contextParts.push(`user=${context.userId}`)
        if (context.requestId) contextParts.push(`request=${context.requestId}`)

        if (contextParts.length > 0) {
          logArgs[0] += ` %c(${contextParts.join(", ")})`
          logArgs.push(contextStyle)
        }
      }

      console.log(...logArgs)

      if (error) {
        console.error(error)
      }

      if (context?.metadata) {
        console.log("%cMetadata:", "color: #6B7280", context.metadata)
      }
    }
  }

  /**
   * Debug log (lowest priority)
   * Use for detailed debugging information
   */
  debug(message: string, data?: unknown, context?: LogContext) {
    this.log("debug", message, data, context)
  }

  /**
   * Info log
   * Use for general informational messages
   */
  info(message: string, data?: unknown, context?: LogContext) {
    this.log("info", message, data, context)
  }

  /**
   * Success log
   * Use for successful operations
   */
  success(message: string, data?: unknown, context?: LogContext) {
    this.log("success", message, data, context)
  }

  /**
   * Warning log
   * Use for warning messages that don't halt execution
   */
  warn(message: string, data?: unknown, context?: LogContext) {
    this.log("warn", message, data, context)
  }

  /**
   * Error log (highest priority)
   * Use for error messages and exceptions
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log("error", message, error, context)
  }

  /**
   * Log with custom level
   * Generally prefer using specific methods (debug, info, warn, error, success)
   */
  logWithLevel(level: LogLevel, message: string, data?: unknown, context?: LogContext) {
    this.log(level, message, data, context)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton logger instance
 * Import and use throughout the application
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger'
 *
 * logger.info('User logged in', null, { userId: '123' })
 * logger.error('Failed to fetch data', error, { component: 'Dashboard' })
 * logger.success('Data saved successfully')
 * ```
 */
export const logger = new Logger()

// Export types for external use
export type { LogLevel, LogContext, LogEntry }
