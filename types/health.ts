/**
 * API Health Check Types
 *
 * Types for the /health endpoint response
 */

export interface ApiHealthResponse {
  build: {
    commit: string
  }
  code: number
  data: string
  environment: {
    app_env: string
    app_region: string
    containerized: boolean
    hostname: string
  }
  metrics: {
    cpu_count: number
    go_max_procs: number
    go_version: string
    goroutines: number
  }
  services: {
    database: {
      driver: string
      idle: number
      in_use: number
      latency_ms: number
      open_connections: number
      status: "up" | "down"
    }
  }
  status: "healthy" | "unhealthy" | "degraded"
  success: boolean
  timestamp: string
  uptime: number
  version: string
}

export interface ApiHealthError {
  error: string
  message: string
  code?: number
}
