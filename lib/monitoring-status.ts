/**
 * Monitoring Event Status Interpreter
 *
 * Provides intelligent status interpretation for monitoring events.
 * Since transport delivery status is not tracked individually,
 * we infer the likely state based on event age and metadata.
 */

import type { MonitoringEvent } from "@/types"

export interface InterpretedStatus {
  label: string
  description: string
  color: "gray" | "blue" | "yellow" | "green" | "orange" | "red"
  icon: string
  confidence: "low" | "medium" | "high"
}

/**
 * Interprets the actual status of a monitoring event based on:
 * - Current database status
 * - Event age (time since creation)
 * - Number of retry attempts
 * - Event type patterns
 */
export function getInterpretedStatus(event: MonitoringEvent): InterpretedStatus {
  const age = Date.now() - new Date(event.created_at).getTime()
  const ageInSeconds = Math.floor(age / 1000)

  // Explicit status from database
  switch (event.status) {
    case "delivered":
      return {
        label: "Entregue",
        description: "Confirmado pelos transports",
        color: "green",
        icon: "✓",
        confidence: "high",
      }

    case "failed":
      return {
        label: "Falhou",
        description: event.attempts > 0
          ? `Falhou após ${event.attempts} tentativa${event.attempts > 1 ? "s" : ""}`
          : "Falha confirmada",
        color: "red",
        icon: "✗",
        confidence: "high",
      }

    case "processing":
      return {
        label: "Processando",
        description: event.attempts > 0
          ? `Tentativa ${event.attempts + 1} em andamento`
          : "Em processamento",
        color: "blue",
        icon: "⟳",
        confidence: "high",
      }

    case "pending":
    default:
      // Intelligent inference based on age and attempts
      return inferPendingStatus(ageInSeconds, event.attempts)
  }
}

/**
 * Infers the likely status of a "pending" event based on time and attempts.
 *
 * Timeline assumptions:
 * - 0-5s: Still being dispatched to transports
 * - 5s-1min: In transport queue/processing
 * - 1-5min: Likely delivered (most events succeed quickly)
 * - 5-15min: May have issues (retry window)
 * - 15min+: Possible failure or stuck in DLQ
 */
function inferPendingStatus(ageInSeconds: number, attempts: number): InterpretedStatus {
  // Very fresh event - still being dispatched
  if (ageInSeconds < 5) {
    return {
      label: "Enviando",
      description: "Despachando para transports",
      color: "yellow",
      icon: "↗",
      confidence: "high",
    }
  }

  // Fresh event with retry attempts - having issues
  if (ageInSeconds < 30 && attempts > 0) {
    return {
      label: "Tentando novamente",
      description: `${attempts} tentativa${attempts > 1 ? "s" : ""} realizada${attempts > 1 ? "s" : ""}`,
      color: "orange",
      icon: "⟳",
      confidence: "medium",
    }
  }

  // Normal processing window
  if (ageInSeconds < 60) {
    return {
      label: "Em fila",
      description: "Aguardando processamento dos transports",
      color: "blue",
      icon: "⋯",
      confidence: "medium",
    }
  }

  // Likely delivered (most events succeed within 1 minute)
  if (ageInSeconds < 300) {
    return {
      label: "Provavelmente entregue",
      description: "Enviado há mais de 1 minuto (provável sucesso)",
      color: "green",
      icon: "✓",
      confidence: "low",
    }
  }

  // Retry window - may be in circuit breaker cooldown
  if (ageInSeconds < 900) {
    return {
      label: "Pode ter falhado",
      description: attempts > 0
        ? `${attempts} tentativa${attempts > 1 ? "s" : ""}, pode estar em retry`
        : "Mais de 5 minutos sem confirmação",
      color: "orange",
      icon: "⚠",
      confidence: "low",
    }
  }

  // Very old - likely in DLQ or lost
  return {
    label: "Possível falha",
    description: attempts > 0
      ? `${attempts} tentativa${attempts > 1 ? "s" : ""}, pode estar na DLQ`
      : "Mais de 15 minutos sem confirmação",
    color: "red",
    icon: "⚠",
    confidence: "low",
  }
}

/**
 * Gets a human-readable age description
 */
export function getEventAge(createdAt: string): string {
  const age = Date.now() - new Date(createdAt).getTime()
  const seconds = Math.floor(age / 1000)

  if (seconds < 60) return `${seconds}s atrás`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m atrás`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`

  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

/**
 * Gets badge styling based on interpreted status
 */
export function getStatusBadgeClass(status: InterpretedStatus): string {
  const baseClasses = "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"

  const colorClasses = {
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  return `${baseClasses} ${colorClasses[status.color]}`
}
