/**
 * Manager ZuckZapGo - Complete API Client Library
 *
 * Comprehensive client for all 47+ ZuckZapGo API endpoints.
 * All requests pass through Next.js proxy to avoid CORS.
 *
 * @module lib/api
 */
import { logger } from "@/lib/logger"
import type {
  ActionResponse,
  ApiHealthResponse,
  ApiResponse,
  ArchiveDeleteBulkRequest,
  ArchiveDeleteResponse,
  ArchiveEvent,
  ArchiveListParams,
  ArchiveReplayRequest,
  ArchiveReplayResponse,
  ArchiveStats,
  DLQDeleteParams,
  DLQDeleteResponse,
  DLQEvent,
  DLQListParams,
  DLQPruneResponse,
  DLQReplayParams,
  DLQReplayResponse,
  DLQStats,
  GlobalConfiguration,
  GlobalStats,
  GlobalTestResults,
  LicenseInfoResponse,
  MonitoringEvent,
  MonitoringHistoryParams,
  MonitoringHistoryResponse,
  MonitoringSessionToken,
  MonitoringSessionTokenRequest,
  MonitoringStatistics,
  PairPhoneRequest,
  PairPhoneResponse,
  ProxyConfig,
  QRCodeResponse,
  RabbitMQConfig,
  S3Config,
  SessionStatus,
  SkipBroadcastsConfigResponse,
  SkipCallsConfigRequest,
  SkipCallsConfigResponse,
  SkipGroupsConfigResponse,
  SkipMediaConfigResponse,
  SkipNewslettersConfigResponse,
  SkipOwnMessagesConfigResponse,
  TestResponse,
  User,
} from "@/types"

// ============================================================================
// API CLIENT CLASS
// ============================================================================

/**
 * HTTP client for ZuckZapGo API communication
 * All requests pass through Next.js proxy route
 *
 * Authentication is handled automatically by the proxy route (/api/proxy)
 * which reads cookies and forwards appropriate headers to the backend.
 */

export interface ApiRequestOptions {
  headers?: Record<string, string>
  token?: string
  authorization?: string
}

class ApiClient {
  private baseUrl: string
  private timeout: number
  private retryAttempts: number

  constructor() {
    // Detect if running on server or client
    const isServer = typeof window === "undefined"

    // Server-side needs full URL, client-side uses relative path
    if (isServer) {
      // Server-side: Always use HTTP for internal calls (localhost/container)
      // The Next.js standalone server runs on HTTP internally, even in production
      const protocol = "http"
      const host = process.env.HOSTNAME || "localhost"
      const port = process.env.PORT || "3000"
      this.baseUrl = `${protocol}://${host}:${port}/api/proxy`
    } else {
      // Client-side: relative path works fine
      this.baseUrl = "/api/proxy"
    }

    // Timeout configuration (default: 30 seconds)
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10)

    // Retry attempts (default: 3)
    this.retryAttempts = parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3", 10)
  }

  /**
   * Get authentication headers (stub for compatibility)
   *
   * Authentication is handled by the proxy route which reads cookies
   * and adds appropriate headers before forwarding to the backend.
   * This method exists for API compatibility but returns empty headers.
   */
  private async getServerAuthHeaders(): Promise<HeadersInit> {
    return {}
  }

  /**
   * Sleep utility for retry delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`)
      }
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options)
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>("POST", endpoint, data, options)
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options)
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options)
  }

  /**
   * Base request handler with error handling, timeout, and retry
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    requestOptions?: ApiRequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    // Headers base
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Server-side: precisamos passar cookies manualmente
    if (typeof window === "undefined") {
      try {
        // Importação dinâmica para evitar erros em client-side
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()

        if (allCookies.length > 0) {
          // Formata cookies para o header Cookie
          const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ")
          headers["Cookie"] = cookieHeader

          logger.debug("Server-side request with cookies", null, {
            component: "ApiClient",
            action: method,
            metadata: {
              endpoint,
              cookieCount: allCookies.length,
              cookieNames: allCookies.map((c) => c.name),
            },
          })
        } else {
          logger.warn("Server-side request without cookies", null, {
            component: "ApiClient",
            action: method,
            metadata: { endpoint },
          })
        }
      } catch (error) {
        logger.error(
          "Failed to get cookies for server-side request",
          error instanceof Error ? error : undefined,
          {
            component: "ApiClient",
            action: method,
            metadata: { endpoint },
          }
        )
      }
    }

    if (requestOptions?.token) {
      headers["token"] = requestOptions.token
    }

    if (requestOptions?.authorization) {
      headers["Authorization"] = requestOptions.authorization
    }

    if (requestOptions?.headers) {
      Object.assign(headers, requestOptions.headers)
    }

    const requestInit: RequestInit = {
      method,
      headers,
      credentials: "include", // Important for httpOnly cookies (client-side)
    }

    if (data && (method === "POST" || method === "PUT")) {
      requestInit.body = JSON.stringify(data)
    }

    let lastError: Error | HttpError | null = null

    // Retry loop
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        // Log request attempt
        if (attempt > 0) {
          logger.warn(`Retrying request (attempt ${attempt}/${this.retryAttempts})`, null, {
            component: "ApiClient",
            action: method,
            metadata: { endpoint, attempt },
          })
        }

        const response = await this.fetchWithTimeout(url, requestInit)

        // Parse JSON response
        let responseData: any
        const contentType = response.headers.get("content-type")

        if (contentType?.includes("application/json")) {
          responseData = await response.json()
        } else {
          const text = await response.text()
          responseData = { message: text }
        }

        // Check if request was successful
        if (!response.ok) {
          const error = new HttpError(
            responseData.error || responseData.message || "Request error",
            response.status,
            responseData
          )

          logger.error(`API request failed: ${error.getUserMessage()}`, error, {
            component: "ApiClient",
            action: method,
            metadata: {
              endpoint,
              status: response.status,
              attempt,
            },
          })

          throw error
        }

        // Success - log if retried
        if (attempt > 0) {
          logger.success(`Request succeeded after ${attempt} retries`, null, {
            component: "ApiClient",
            action: method,
            metadata: { endpoint, attempt },
          })
        }

        return responseData as T
      } catch (error) {
        lastError =
          error instanceof Error || error instanceof HttpError ? error : new Error(String(error))

        // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (error instanceof HttpError) {
          const status = error.status
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            throw error // Don't retry client errors
          }
        }

        // If this was the last attempt, throw the error
        if (attempt === this.retryAttempts) {
          break
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        logger.debug(`Waiting ${delay}ms before retry`, null, {
          component: "ApiClient",
          metadata: { attempt, delay },
        })
        await this.sleep(delay)
      }
    }

    // All attempts failed
    if (lastError instanceof HttpError) {
      throw lastError
    }

    // Network or timeout error
    const isTimeout = lastError?.message?.includes("timeout")
    const isNetworkError =
      lastError?.message?.includes("fetch") || lastError?.message?.includes("network")

    let errorMessage = "Connection error. Please check your network."
    if (isTimeout) {
      errorMessage = `Request timeout after ${this.timeout}ms. Backend may be slow or unavailable.`
    } else if (isNetworkError) {
      errorMessage = "Network error. Please check your internet connection."
    }

    const finalError = new HttpError(errorMessage, 0, {
      error: "NETWORK_ERROR",
      originalError: lastError?.message,
      attempts: this.retryAttempts + 1,
    })

    logger.error(`All ${this.retryAttempts + 1} request attempts failed`, finalError, {
      component: "ApiClient",
      action: method,
      metadata: {
        endpoint,
        timeout: this.timeout,
        retryAttempts: this.retryAttempts,
      },
    })

    throw finalError
  }
}

// ============================================================================
// HTTP ERROR CLASS
// ============================================================================

/**
 * Custom error class for API errors
 */
class HttpError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.status === 0) {
      return "Connection error. Please check your internet."
    }

    if (this.status === 401) {
      return "Invalid or expired token. Please login again."
    }

    if (this.status === 403) {
      return "Access denied. You don't have permission for this action."
    }

    if (this.status === 404) {
      return "Resource not found."
    }

    if (this.status === 429) {
      return "Too many requests. Please wait a moment."
    }

    if (this.status >= 500) {
      return "Server error. Please try again later."
    }

    return this.message || "Unknown error. Please try again."
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const apiClient = new ApiClient()

// ============================================================================
// TYPE DEFINITIONS FOR REQUESTS/RESPONSES
// ============================================================================

// Admin User Operations
interface ProxyConfigRequest {
  enabled?: boolean
  proxyURL?: string
}

interface S3ConfigRequest {
  enabled?: boolean
  endpoint?: string
  region?: string
  bucket?: string
  accessKey?: string
  secretKey?: string
  pathStyle?: boolean
  publicURL?: string
  mediaDelivery?: string
  retentionDays?: number
  disableACL?: boolean
}

interface RabbitMQConfigRequest {
  enabled?: boolean
  url?: string
  exchange?: string
  exchange_type?: string
  queue?: string
  queue_type?: string
  routing_key?: string
  events?: string
  durable?: boolean
  auto_delete?: boolean
  exclusive?: boolean
  no_wait?: boolean
  delivery_mode?: number
  connection_pool_size?: number
  worker_count?: number
  queue_buffer_size?: number
  batch_size?: number
  batch_timeout_ms?: number
  publish_timeout_ms?: number
  max_retries?: number
  retry_delay_ms?: number
}

interface WhatsAppConfigRequest {
  waVersion?: string
  waPlatform?: string
  waReleaseChannel?: string
  waWebSubPlatform?: string
  waOSName?: string
  waOSVersion?: string
  waDeviceName?: string
  waManufacturer?: string
  waDeviceBoard?: string
  waLocaleLanguage?: string
  waLocaleCountry?: string
  waMCC?: string
  waMNC?: string
  waConnectType?: string
  waPlatformType?: string
}

interface CreateUserRequest {
  name: string
  token: string
  webhook?: string
  events?: string
  expiration?: number
  webhookTimeout?: number
  webhookMaxRetries?: number
  webhookRetryDelay?: number
  webhookBackoffFactor?: number
  proxyConfig?: ProxyConfigRequest
  s3Config?: S3ConfigRequest
  rabbitmqConfig?: RabbitMQConfigRequest
  whatsappConfig?: WhatsAppConfigRequest
  skipMedia?: boolean
  skipGroups?: boolean
  skipNewsletters?: boolean
  skipBroadcasts?: boolean
  skipOwnMessages?: boolean
  echoApiMessages?: boolean
  skipCalls?: boolean
  callRejectMessage?: string
  callRejectType?: string
}

type CreateUserResponse = ApiResponse<User>

// ============================================================================
// CATEGORY 1: ADMIN API - User Management
// ============================================================================

/**
 * Admin endpoints for user management
 * Requires admin token authorization
 */

interface GlobalTestEventRequest {
  event_type?: string
  user_id?: string
  user_token?: string
  data?: Record<string, unknown>
}

interface UserWebhookSettings {
  webhook: string
  subscribe: string[]
}

const adminApi = {
  health: () => apiClient.get<ApiHealthResponse>("/health"),
  license: () => apiClient.get<LicenseInfoResponse>("/admin/license/info"),
  users: {
    list: () => apiClient.get<ApiResponse<User[]>>("/admin/users"),
    get: (id: string) => apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),
    create: (data: CreateUserRequest) => apiClient.post<CreateUserResponse>("/admin/users", data),
    delete: (id: string) => apiClient.delete<ActionResponse>(`/admin/users/${id}`),
    deleteFull: (id: string) => apiClient.delete<ActionResponse>(`/admin/users/${id}/full`),
  },
  global: {
    getStats: () => apiClient.get<ApiResponse<GlobalStats>>("/admin/global/stats"),
    testSystems: () => apiClient.post<ApiResponse<GlobalTestResults>>("/admin/global/test"),
    getConfig: () => apiClient.get<ApiResponse<GlobalConfiguration>>("/admin/global/config"),
    reloadConfig: () => apiClient.post<ActionResponse>("/admin/global/config/reload"),
    sendTestEvent: (payload: GlobalTestEventRequest) =>
      apiClient.post<ActionResponse>("/admin/global/event/test", payload),
  },
  dlq: {
    getEvents: (params?: DLQListParams) => {
      const queryParams = new URLSearchParams()
      if (params?.transport) queryParams.append("transport", params.transport)
      if (params?.user_id) queryParams.append("user_id", params.user_id)
      if (params?.event_type) queryParams.append("event_type", params.event_type)
      if (params?.from) queryParams.append("from", params.from)
      if (params?.to) queryParams.append("to", params.to)
      if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString())
      if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString())

      const query = queryParams.toString()
      return apiClient.get<ApiResponse<DLQEvent[]>>(`/admin/dlq${query ? `?${query}` : ""}`)
    },
    getStats: () => apiClient.get<ApiResponse<DLQStats>>("/admin/dlq/stats"),
    getEvent: (id: number) => apiClient.get<ApiResponse<DLQEvent>>(`/admin/dlq/${id}`),
    deleteEvent: (id: number) => apiClient.delete<DLQDeleteResponse>(`/admin/dlq/${id}`),
    bulkDelete: (params: DLQDeleteParams) =>
      apiClient.post<DLQDeleteResponse>("/admin/dlq/delete", params),
    replay: (params: DLQReplayParams) =>
      apiClient.post<DLQReplayResponse>("/admin/dlq/replay", params),
    prune: () => apiClient.post<DLQPruneResponse>("/admin/dlq/prune"),
  },
  archive: {
    getEvents: (params?: ArchiveListParams) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append("status", params.status)
      if (params?.transport) queryParams.append("transport", params.transport)
      if (params?.user_id) queryParams.append("user_id", params.user_id)
      if (params?.event_type) queryParams.append("event_type", params.event_type)
      if (params?.from_date) queryParams.append("from_date", params.from_date)
      if (params?.to_date) queryParams.append("to_date", params.to_date)
      if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString())
      if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString())

      const query = queryParams.toString()
      return apiClient.get<ApiResponse<ArchiveEvent[]>>(`/admin/archive${query ? `?${query}` : ""}`)
    },
    getStats: () => apiClient.get<ApiResponse<ArchiveStats>>("/admin/archive/stats"),
    getEvent: (id: number) => apiClient.get<ApiResponse<ArchiveEvent>>(`/admin/archive/${id}`),
    deleteEvent: (id: number) => apiClient.delete<ArchiveDeleteResponse>(`/admin/archive/${id}`),
    bulkDelete: (body: ArchiveDeleteBulkRequest) =>
      apiClient.post<ArchiveDeleteResponse>("/admin/archive/delete-bulk", body),
    replay: (body: ArchiveReplayRequest) =>
      apiClient.post<ArchiveReplayResponse>("/admin/archive/replay", body),
  },
  monitoring: {
    getStats: () => apiClient.get<MonitoringStatistics>("/admin/events/stats"),
    getHistory: (params?: MonitoringHistoryParams) => {
      const queryParams = new URLSearchParams()
      if (params?.user_id) queryParams.append("user_id", params.user_id)
      if (params?.event_type) queryParams.append("event_type", params.event_type)
      if (params?.status) queryParams.append("status", params.status)
      if (params?.before_id !== undefined)
        queryParams.append("before_id", params.before_id.toString())
      if (params?.since_time) queryParams.append("since_time", params.since_time)
      if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString())
      if (params?.only_failed) queryParams.append("only_failed", "true")

      const query = queryParams.toString()
      return apiClient.get<MonitoringHistoryResponse>(
        `/admin/events/history${query ? `?${query}` : ""}`
      )
    },
    createSession: (body?: MonitoringSessionTokenRequest, sessionToken?: string) => {
      const queryParams = new URLSearchParams()
      if (sessionToken) {
        queryParams.set("session", sessionToken)
      }

      const query = queryParams.toString()
      const payload = body && Object.keys(body).length > 0 ? body : undefined

      return apiClient.post<MonitoringSessionToken>(
        `/admin/events/session${query ? `?${query}` : ""}`,
        payload
      )
    },
  },
}

const sessionApi = {
  status: (options?: ApiRequestOptions) =>
    apiClient.get<ApiResponse<SessionStatus>>("/session/status", options),
  qr: (options?: ApiRequestOptions) =>
    apiClient.get<ApiResponse<QRCodeResponse>>("/session/qr", options),
  connect: (options?: ApiRequestOptions) =>
    apiClient.post<ActionResponse>("/session/connect", undefined, options),
  disconnect: (options?: ApiRequestOptions) =>
    apiClient.post<ActionResponse>("/session/disconnect", undefined, options),
  logout: (options?: ApiRequestOptions) =>
    apiClient.post<ActionResponse>("/session/logout", undefined, options),
  pairPhone: (data: PairPhoneRequest, options?: ApiRequestOptions) =>
    apiClient.post<PairPhoneResponse>("/session/pairphone", data, options),
  refresh: (options?: ApiRequestOptions) =>
    apiClient.post<ActionResponse>("/session/refresh", undefined, options),
  proxy: {
    set: (data: ProxyConfig, options?: ApiRequestOptions) =>
      apiClient.post<ActionResponse>("/session/proxy", data, options),
  },
  s3: {
    get: (options?: ApiRequestOptions) =>
      apiClient.get<ApiResponse<S3Config>>("/session/s3/config", options),
    set: (data: S3Config, options?: ApiRequestOptions) =>
      apiClient.post<ActionResponse>("/session/s3/config", data, options),
    delete: (options?: ApiRequestOptions) =>
      apiClient.delete<ActionResponse>("/session/s3/config", options),
    test: (options?: ApiRequestOptions) =>
      apiClient.post<TestResponse>("/session/s3/test", undefined, options),
  },
  rabbitmq: {
    get: (options?: ApiRequestOptions) =>
      apiClient.get<ApiResponse<RabbitMQConfig>>("/session/rabbitmq/config", options),
    set: (data: RabbitMQConfig, options?: ApiRequestOptions) =>
      apiClient.post<ActionResponse>("/session/rabbitmq/config", data, options),
    delete: (options?: ApiRequestOptions) =>
      apiClient.delete<ActionResponse>("/session/rabbitmq/config", options),
    test: (options?: ApiRequestOptions) =>
      apiClient.post<TestResponse>("/session/rabbitmq/test", undefined, options),
  },
  skipFilters: {
    media: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipMediaConfigResponse>>("/session/skipmedia/config", options),
      set: (enabled: boolean, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipMediaConfigResponse>>(
          "/session/skipmedia/config",
          { enabled },
          options
        ),
    },
    groups: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipGroupsConfigResponse>>("/session/skipgroups/config", options),
      set: (enabled: boolean, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipGroupsConfigResponse>>(
          "/session/skipgroups/config",
          { enabled },
          options
        ),
    },
    newsletters: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipNewslettersConfigResponse>>(
          "/session/skipnewsletters/config",
          options
        ),
      set: (enabled: boolean, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipNewslettersConfigResponse>>(
          "/session/skipnewsletters/config",
          { enabled },
          options
        ),
    },
    broadcasts: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipBroadcastsConfigResponse>>(
          "/session/skipbroadcasts/config",
          options
        ),
      set: (enabled: boolean, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipBroadcastsConfigResponse>>(
          "/session/skipbroadcasts/config",
          { enabled },
          options
        ),
    },
    own: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipOwnMessagesConfigResponse>>(
          "/session/skipownmessages/config",
          options
        ),
      set: (enabled: boolean, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipOwnMessagesConfigResponse>>(
          "/session/skipownmessages/config",
          { enabled },
          options
        ),
    },
    calls: {
      get: (options?: ApiRequestOptions) =>
        apiClient.get<ApiResponse<SkipCallsConfigResponse>>("/session/skipcalls/config", options),
      set: (settings: SkipCallsConfigRequest, options?: ApiRequestOptions) =>
        apiClient.post<ApiResponse<SkipCallsConfigResponse>>(
          "/session/skipcalls/config",
          {
            enabled: settings.enabled,
            reject_message: settings.reject_message,
            reject_type: settings.reject_type,
          },
          options
        ),
    },
  },
  echo: {
    get: (options?: ApiRequestOptions) =>
      apiClient.get<ApiResponse<Record<string, unknown>>>("/session/echo/api", options),
    set: (enabled: boolean, options?: ApiRequestOptions) =>
      apiClient.post<ActionResponse>("/session/echo/api", { enabled }, options),
  },
}

const webhookApi = {
  get: (options?: ApiRequestOptions) =>
    apiClient.get<ApiResponse<UserWebhookSettings>>("/webhook", options),
  create: (data: { webhookurl: string; events?: string[] }, options?: ApiRequestOptions) =>
    apiClient.post<ActionResponse>("/webhook", data, options),
  update: (
    data: { webhookurl: string; events?: string[]; active?: boolean },
    options?: ApiRequestOptions
  ) => apiClient.put<ActionResponse>("/webhook", data, options),
  delete: (options?: ApiRequestOptions) => apiClient.delete<ActionResponse>("/webhook", options),
}

export { ApiClient, HttpError, apiClient, adminApi, sessionApi, webhookApi }
export type { CreateUserRequest, CreateUserResponse }
