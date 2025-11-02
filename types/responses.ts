/**
 * API Response Wrappers - Manager ZuckZapGo
 *
 * Tipos genéricos para respostas da API ZuckZapGo.
 * Fornece estruturas padronizadas para sucesso, erro e paginação.
 *
 * @module types/responses
 */

// ============================================================================
// GENERIC API RESPONSE
// ============================================================================

/**
 * Response genérico da API
 *
 * @template T - Tipo dos dados retornados
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '123', name: 'John' },
 *   message: 'Usuário carregado com sucesso'
 * }
 * ```
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
  details?: string
}

// ============================================================================
// API ERROR
// ============================================================================

/**
 * Erro padronizado da API
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   error: 'Unauthorized',
 *   message: 'Token inválido ou expirado',
 *   status: 401,
 *   code: 'AUTH_ERROR'
 * }
 * ```
 */
export interface ApiError {
  error: string
  message: string
  status: number
  code?: string
  details?: string | Record<string, unknown>
  timestamp?: string
}

// ============================================================================
// PAGINATED RESPONSE
// ============================================================================

/**
 * Response paginado da API
 *
 * @template T - Tipo dos itens retornados
 *
 * @example
 * ```typescript
 * const paginated: PaginatedResponse<User> = {
 *   success: true,
 *   data: [user1, user2],
 *   pagination: {
 *     page: 1,
 *     per_page: 10,
 *     total: 100,
 *     total_pages: 10
 *   }
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
  message?: string
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

/**
 * Parâmetros de paginação para requests
 */
export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}

// ============================================================================
// ACTION RESPONSE
// ============================================================================

/**
 * Response para ações (create, update, delete)
 *
 * @example
 * ```typescript
 * const action: ActionResponse = {
 *   success: true,
 *   message: 'Usuário criado com sucesso',
 *   id: '123',
 *   affected_rows: 1
 * }
 * ```
 */
export interface ActionResponse {
  success: boolean
  message: string
  id?: string
  affected_rows?: number
  data?: Record<string, unknown>
}

// ============================================================================
// BULK ACTION RESPONSE
// ============================================================================

/**
 * Response para ações em lote
 *
 * @example
 * ```typescript
 * const bulk: BulkActionResponse = {
 *   success: true,
 *   message: 'Processamento concluído',
 *   total: 10,
 *   succeeded: 8,
 *   failed: 2,
 *   errors: [{ id: '5', error: 'Not found' }]
 * }
 * ```
 */
export interface BulkActionResponse {
  success: boolean
  message: string
  total: number
  succeeded: number
  failed: number
  errors?: Array<{
    id: string
    error: string
  }>
}

// ============================================================================
// VALIDATION ERROR
// ============================================================================

/**
 * Erro de validação com campos específicos
 *
 * @example
 * ```typescript
 * const validation: ValidationError = {
 *   error: 'Validation failed',
 *   message: 'Campos inválidos',
 *   status: 400,
 *   fields: {
 *     name: ['Nome é obrigatório'],
 *     email: ['Email inválido', 'Email já existe']
 *   }
 * }
 * ```
 */
export interface ValidationError extends ApiError {
  fields: Record<string, string[]>
}

// ============================================================================
// HEALTH CHECK RESPONSE
// ============================================================================

/**
 * Response de health check
 *
 * @example
 * ```typescript
 * const health: HealthCheckResponse = {
 *   status: 'healthy',
 *   version: '1.0.0',
 *   uptime: 3600,
 *   services: {
 *     database: { status: 'up', latency_ms: 5 },
 *     rabbitmq: { status: 'up', latency_ms: 10 }
 *   }
 * }
 * ```
 */
export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy"
  version: string
  uptime: number
  timestamp: string
  services?: Record<
    string,
    {
      status: "up" | "down" | "degraded"
      latency_ms?: number
      error?: string
    }
  >
}

// ============================================================================
// TEST RESPONSE
// ============================================================================

/**
 * Response de teste de conexão/funcionalidade
 *
 * @example
 * ```typescript
 * const test: TestResponse = {
 *   success: true,
 *   message: 'Conexão estabelecida com sucesso',
 *   latency_ms: 150,
 *   details: { endpoint: 'https://api.example.com' }
 * }
 * ```
 */
export interface TestResponse {
  success: boolean
  message: string
  latency_ms?: number
  status_code?: number
  details?: Record<string, unknown>
}

// ============================================================================
// BATCH RESPONSE
// ============================================================================

/**
 * Response para operações em batch
 *
 * @template T - Tipo dos resultados individuais
 *
 * @example
 * ```typescript
 * const batch: BatchResponse<SendMessageResult> = {
 *   total: 10,
 *   successful: 8,
 *   failed: 2,
 *   results: [...]
 * }
 * ```
 */
export interface BatchResponse<T> {
  total: number
  successful: number
  failed: number
  results: Array<{
    id: string
    success: boolean
    data?: T
    error?: string
  }>
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard para verificar se response é erro
 */
export function isApiError(response: ApiResponse<unknown> | ApiError): response is ApiError {
  return "status" in response && !("success" in response)
}

/**
 * Type guard para verificar se response tem dados
 */
export function hasData<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined
}

/**
 * Type guard para verificar se é validation error
 */
export function isValidationError(error: ApiError): error is ValidationError {
  return "fields" in error
}
