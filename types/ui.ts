/**
 * UI-Specific Types - Manager ZuckZapGo
 *
 * Tipos para componentes de interface, estados de carregamento e tabelas.
 * Estruturas otimizadas para React components e shadcn/ui.
 *
 * @module types/ui
 */
import { ReactNode } from "react"

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Estados de carregamento para operações assíncronas
 */
export type LoadingState = "idle" | "loading" | "success" | "error"

/**
 * Estado detalhado de carregamento com mensagem
 */
export interface LoadingStateWithMessage {
  state: LoadingState
  message?: string
  progress?: number // 0-100
}

// ============================================================================
// FORM STATES
// ============================================================================

/**
 * Estado de formulário com validação
 */
export interface FormState {
  loading: LoadingState
  error?: string
  success?: boolean
  isDirty?: boolean
  isValid?: boolean
}

/**
 * Estado de submissão de formulário
 */
export interface SubmitState {
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submitError?: string
}

// ============================================================================
// DATA TABLE TYPES
// ============================================================================

/**
 * Definição de coluna para DataTable
 *
 * @template T - Tipo dos dados da linha
 */
export interface DataTableColumn<T> {
  id: string
  header: string | ReactNode
  accessorKey?: keyof T
  accessorFn?: (row: T) => unknown
  cell?: (row: T) => ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  enableHiding?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}

/**
 * Configuração de ordenação
 */
export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

/**
 * Direção de ordenação
 */
export type SortDirection = "asc" | "desc"

/**
 * Estado de filtro
 */
export interface FilterState {
  column: string
  value: string | number | boolean | null
  operator?: "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt"
}

/**
 * Configuração de paginação
 */
export interface PaginationConfig {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
}

/**
 * Estado completo da tabela
 */
export interface TableState<T> {
  data: T[]
  loading: LoadingState
  sorting: SortConfig<T>[]
  filters: FilterState[]
  pagination: PaginationConfig
  selection: string[]
  columnVisibility: Record<string, boolean>
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Tipo de notificação (Sonner toast)
 */
export type NotificationType = "success" | "error" | "warning" | "info" | "loading"

/**
 * Configuração de notificação
 */
export interface NotificationConfig {
  type: NotificationType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================================================
// MODAL TYPES
// ============================================================================

/**
 * Estado de modal
 */
export interface ModalState {
  isOpen: boolean
  title?: string
  data?: unknown
}

/**
 * Configuração de modal de confirmação
 */
export interface ConfirmModalConfig {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

// ============================================================================
// BREADCRUMB TYPES
// ============================================================================

/**
 * Item de breadcrumb
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
  isCurrentPage?: boolean
}

// ============================================================================
// SIDEBAR TYPES
// ============================================================================

/**
 * Item de navegação da sidebar
 */
export interface SidebarItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
  badge?: string | number
  disabled?: boolean
  children?: SidebarItem[]
}

/**
 * Grupo de itens da sidebar
 */
export interface SidebarGroup {
  id: string
  label?: string
  items: SidebarItem[]
  collapsible?: boolean
  defaultOpen?: boolean
}

/**
 * Estado da sidebar
 */
export interface SidebarState {
  isOpen: boolean
  isMobile: boolean
  activeItem?: string
}

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Tema da aplicação
 */
export type Theme = "light" | "dark" | "system"

/**
 * Configuração de tema
 */
export interface ThemeConfig {
  theme: Theme
  systemTheme?: "light" | "dark"
}

// ============================================================================
// CURRENCY TYPES
// ============================================================================

/**
 * Moedas suportadas
 */
export type Currency = "BRL" | "USD" | "EUR"

/**
 * Configuração de moeda
 */
export interface CurrencyConfig {
  currency: Currency
  rates: Record<Currency, number>
  locale: string
}

// ============================================================================
// STATUS BADGE TYPES
// ============================================================================

/**
 * Variantes de status badge
 */
export type StatusVariant = "default" | "success" | "warning" | "error" | "info" | "secondary"

/**
 * Configuração de status badge
 */
export interface StatusBadgeConfig {
  label: string
  variant: StatusVariant
  icon?: ReactNode
  pulse?: boolean
}

// ============================================================================
// SKELETON TYPES
// ============================================================================

/**
 * Variantes de skeleton
 */
export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded"

/**
 * Configuração de skeleton
 */
export interface SkeletonConfig {
  variant: SkeletonVariant
  width?: string | number
  height?: string | number
  count?: number
  animation?: "pulse" | "wave" | "none"
}

// ============================================================================
// EMPTY STATE TYPES
// ============================================================================

/**
 * Configuração de empty state
 */
export interface EmptyStateConfig {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

// ============================================================================
// ERROR DISPLAY TYPES
// ============================================================================

/**
 * Configuração de exibição de erro
 */
export interface ErrorDisplayConfig {
  title: string
  message: string
  code?: string
  retry?: {
    label: string
    onClick: () => void
  }
  goBack?: {
    label: string
    onClick: () => void
  }
}

// ============================================================================
// CARD TYPES
// ============================================================================

/**
 * Configuração de card com estatística
 */
export interface StatCardConfig {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    direction: "up" | "down"
    label?: string
  }
  loading?: boolean
}

// ============================================================================
// COMMAND PALETTE TYPES
// ============================================================================

/**
 * Item do command palette
 */
export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  shortcut?: string[]
  onSelect: () => void
  disabled?: boolean
}

/**
 * Grupo de comandos
 */
export interface CommandGroup {
  id: string
  label: string
  items: CommandItem[]
}

// ============================================================================
// TABS TYPES
// ============================================================================

/**
 * Item de tab
 */
export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
  disabled?: boolean
  content: ReactNode
}

// ============================================================================
// DROPDOWN MENU TYPES
// ============================================================================

/**
 * Item de dropdown menu
 */
export interface DropdownMenuItem {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
  onClick?: () => void
  separator?: boolean
}

/**
 * Grupo de itens do dropdown
 */
export interface DropdownMenuGroup {
  id: string
  label?: string
  items: DropdownMenuItem[]
}

// ============================================================================
// DIALOG TYPES
// ============================================================================

/**
 * Configuração de dialog
 */
export interface DialogConfig {
  title: string
  description?: string
  content: ReactNode
  footer?: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

// ============================================================================
// SHEET TYPES
// ============================================================================

/**
 * Posição do sheet
 */
export type SheetPosition = "top" | "right" | "bottom" | "left"

/**
 * Configuração de sheet
 */
export interface SheetConfig {
  title: string
  description?: string
  content: ReactNode
  position?: SheetPosition
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

// ============================================================================
// TOOLTIP TYPES
// ============================================================================

/**
 * Posição do tooltip
 */
export type TooltipPosition = "top" | "right" | "bottom" | "left"

/**
 * Configuração de tooltip
 */
export interface TooltipConfig {
  content: string | ReactNode
  position?: TooltipPosition
  delay?: number
}

// ============================================================================
// ALERT TYPES
// ============================================================================

/**
 * Variantes de alert
 */
export type AlertVariant = "default" | "destructive" | "success" | "warning"

/**
 * Configuração de alert
 */
export interface AlertConfig {
  title?: string
  description: string
  variant?: AlertVariant
  icon?: ReactNode
  dismissible?: boolean
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

/**
 * Configuração de progress bar
 */
export interface ProgressConfig {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  variant?: "default" | "success" | "warning" | "error"
  indeterminate?: boolean
}

// ============================================================================
// AVATAR TYPES
// ============================================================================

/**
 * Tamanho do avatar
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * Configuração de avatar
 */
export interface AvatarConfig {
  src?: string
  alt: string
  fallback?: string
  size?: AvatarSize
  status?: "online" | "offline" | "away" | "busy"
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Classe CSS condicional
 */
export type ConditionalClass = string | undefined | null | false

/**
 * Merge de classes CSS
 */
export type ClassNameValue = ConditionalClass | ConditionalClass[]
