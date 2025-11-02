/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

"use client"

import { use, useCallback, useEffect, useMemo, useState } from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cloud,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  Megaphone,
  Plug,
  QrCode,
  Rabbit,
  RefreshCw,
  Trash2,
  Unplug,
  User,
  Webhook,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import {
  CallSettingsForm,
  ProxyForm,
  RabbitMQForm,
  S3Form,
  SkipFiltersForm,
  UserForm,
  WebhookForm,
} from "@/components/forms"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi, sessionApi } from "@/lib/api"
import { logger } from "@/lib/logger"
import type { SessionStatus, User as UserType } from "@/types"

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

// Helper function to extract error messages
function getErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.error || error?.message || fallback
}

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

/**
 * Edit Instance Page
 *
 * Página de edição completa de instância com:
 * - 6 tabs para diferentes configurações
 * - Status em tempo real
 * - Ações de gerenciamento
 * - Confirmação de deleção
 */

function extractUserFromResponse(data: unknown): UserType | null {
  if (!data) return null
  if (Array.isArray(data)) {
    const [first] = data
    return first && typeof first === "object" ? (first as UserType) : null
  }
  if (typeof data === "object") {
    return data as UserType
  }
  return null
}

function normalizeSessionStatusPayload(data: unknown): {
  status: SessionStatus & { hasClient?: boolean }
  raw: Record<string, any>
} | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const raw = data as Record<string, any>
  const normalized: SessionStatus & { hasClient?: boolean } = {
    connected: Boolean(raw.connected),
    loggedIn: Boolean(raw.loggedIn),
    hasClient: Boolean(raw.hasClient),
    jid: raw.jid ? String(raw.jid) : undefined,
    name: raw.name ? String(raw.name) : undefined,
    qr_code: raw.QRCode ? String(raw.QRCode) : undefined,
    paired: Boolean(raw.paired ?? raw.hasClient ?? raw.loggedIn ?? false),
  }

  return { status: normalized, raw }
}

export default function EditInstancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [instance, setInstance] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [tokenVisible, setTokenVisible] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
  const [actionLoading, setActionLoading] = useState<
    "connect" | "refresh" | "disconnect" | "logout" | null
  >(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [pairDialogOpen, setPairDialogOpen] = useState(false)
  const [pairPhoneInput, setPairPhoneInput] = useState("")
  const [pairLoading, setPairLoading] = useState(false)
  const [pairCode, setPairCode] = useState<string | null>(null)
  const [qrRefreshTimer, setQrRefreshTimer] = useState<NodeJS.Timeout | null>(null)
  const [qrTimeRemaining, setQrTimeRemaining] = useState<number>(40)
  const [pairRefreshTimer, setPairRefreshTimer] = useState<NodeJS.Timeout | null>(null)
  const [pairTimeRemaining, setPairTimeRemaining] = useState<number>(40)
  const router = useRouter()

  const fetchSessionStatus = useCallback(
    async (overrideToken?: string): Promise<boolean> => {
      const sessionToken = overrideToken ?? instance?.token
      if (!sessionToken) {
        return false
      }

      setStatusLoading(true)
      let success = false
      try {
        const response = await sessionApi.status({ token: sessionToken })
        const normalized = normalizeSessionStatusPayload(response.data)

        if (normalized) {
          const { status, raw } = normalized
          setSessionStatus(status)

          setInstance((prev) => {
            if (!prev) {
              return (raw as UserType) ?? prev
            }

            return {
              ...prev,
              ...(raw as Partial<UserType>),
              token: sessionToken,
            }
          })

          const qrFromStatus = raw.qrcode || undefined
          setQrCodeData(status.connected ? null : qrFromStatus ? String(qrFromStatus) : null)
          success = true
        } else {
          setSessionStatus(null)
          setQrCodeData(null)
        }
      } catch (error) {
        logger.error(
          "Erro ao buscar status da sessão",
          error instanceof Error ? error : undefined,
          {
            component: "EditInstancePage",
            action: "fetchSessionStatus",
            metadata: { id },
          }
        )
        setSessionStatus(null)
        toast.error("Não foi possível carregar o status da sessão")
      } finally {
        setStatusLoading(false)
      }

      return success
    },
    [id, instance?.token]
  )

  const loadInstance = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.users.get(id)
      const payload = extractUserFromResponse(response.data)

      if (!payload) {
        throw new Error("Instância não encontrada")
      }

      setInstance(payload)
      await fetchSessionStatus(payload.token)
    } catch (error) {
      logger.error("Erro ao carregar instância", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "loadInstance",
        metadata: { id },
      })
      toast.error("Erro ao carregar instância")
      router.push("/admin/instances")
    } finally {
      setLoading(false)
    }
  }, [fetchSessionStatus, id, router])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const response = await adminApi.users.get(id)
      const payload = extractUserFromResponse(response.data)

      if (!payload) {
        throw new Error("Instância não encontrada")
      }

      setInstance(payload)
      await fetchSessionStatus(payload.token)
      toast.success("Dados atualizados")
    } catch (error) {
      logger.error("Erro ao atualizar dados", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "handleRefresh",
        metadata: { id },
      })
      toast.error("Erro ao atualizar dados")
    } finally {
      setRefreshing(false)
    }
  }, [fetchSessionStatus, id])

  const handleDelete = useCallback(async () => {
    try {
      await adminApi.users.delete(id)
      toast.success("Instância deletada com sucesso")
      router.push("/admin/instances")
    } catch (error) {
      logger.error("Erro ao deletar instância", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "handleDelete",
        metadata: { id },
      })
      toast.error("Erro ao deletar instância")
    }
  }, [id, router])

  const copyToken = useCallback(() => {
    if (instance?.token) {
      navigator.clipboard.writeText(instance.token)
      toast.success("Token copiado para área de transferência")
    }
  }, [instance?.token])

  // Limpa timers de refresh
  const clearRefreshTimers = useCallback(() => {
    if (qrRefreshTimer) {
      clearInterval(qrRefreshTimer)
      setQrRefreshTimer(null)
    }
    if (pairRefreshTimer) {
      clearInterval(pairRefreshTimer)
      setPairRefreshTimer(null)
    }
  }, [qrRefreshTimer, pairRefreshTimer])

  const clearQRTimer = useCallback(() => {
    if (qrRefreshTimer) {
      clearInterval(qrRefreshTimer)
      setQrRefreshTimer(null)
    }
  }, [qrRefreshTimer])

  const clearPairTimer = useCallback(() => {
    if (pairRefreshTimer) {
      clearInterval(pairRefreshTimer)
      setPairRefreshTimer(null)
    }
  }, [pairRefreshTimer])

  // Auto-refresh do QR Code após 40s
  const startQRRefreshTimer = useCallback(() => {
    clearQRTimer()
    setQrTimeRemaining(40)

    let countdown = 40
    const timer = setInterval(() => {
      countdown -= 1
      setQrTimeRemaining(countdown)

      if (countdown <= 0) {
        clearInterval(timer)
        refreshQRCode()
      }
    }, 1000)

    setQrRefreshTimer(timer)
  }, [clearQRTimer])

  // Auto-refresh do Pair Code após 40s
  const startPairRefreshTimer = useCallback(() => {
    clearPairTimer()
    setPairTimeRemaining(40)

    let countdown = 40
    const timer = setInterval(() => {
      countdown -= 1
      setPairTimeRemaining(countdown)

      if (countdown <= 0) {
        clearInterval(timer)
        refreshPairCode()
      }
    }, 1000)

    setPairRefreshTimer(timer)
  }, [clearPairTimer])

  // Refresh QR Code: disconnect → connect → gerar novo QR
  const refreshQRCode = useCallback(async () => {
    const sessionToken = instance?.token
    if (!sessionToken) return

    try {
      // Verifica status antes de refresh
      const statusResponse = await sessionApi.status({ token: sessionToken })
      const normalized = normalizeSessionStatusPayload(statusResponse.data)

      // Se já conectado, não precisa refresh
      if (normalized?.status.connected && normalized?.status.loggedIn) {
        setQrDialogOpen(false)
        clearRefreshTimers()
        toast.success("WhatsApp já está conectado!")
        await fetchSessionStatus(sessionToken)
        return
      }

      // Disconnect → Connect → Gerar QR
      toast.info("Renovando QR Code...")
      await sessionApi.disconnect({ token: sessionToken })
      await new Promise((resolve) => setTimeout(resolve, 500))
      await sessionApi.connect({ token: sessionToken })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Gera novo QR Code
      const response = await sessionApi.qr({ token: sessionToken })
      const qrData = (response.data as any)?.QRCode || null

      if (qrData) {
        setQrCodeData(qrData)
        startQRRefreshTimer() // Reinicia timer
      }
    } catch (error) {
      toast.error("Erro ao renovar QR Code")
      logger.error("Erro no refresh do QR", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "refreshQRCode",
        metadata: { id },
      })
    }
  }, [instance?.token, id, clearRefreshTimers, fetchSessionStatus, startQRRefreshTimer])

  // Refresh Pair Code: disconnect → connect → gerar novo código
  const refreshPairCode = useCallback(async () => {
    const sessionToken = instance?.token
    if (!sessionToken || !pairPhoneInput) return

    try {
      // Verifica status antes de refresh
      const statusResponse = await sessionApi.status({ token: sessionToken })
      const normalized = normalizeSessionStatusPayload(statusResponse.data)

      // Se já conectado, não precisa refresh
      if (normalized?.status.connected && normalized?.status.loggedIn) {
        setPairDialogOpen(false)
        clearRefreshTimers()
        toast.success("WhatsApp já está conectado!")
        await fetchSessionStatus(sessionToken)
        return
      }

      // Disconnect → Connect → Gerar Pair Code
      toast.info("Renovando código de pareamento...")
      await sessionApi.disconnect({ token: sessionToken })
      await new Promise((resolve) => setTimeout(resolve, 500))
      await sessionApi.connect({ token: sessionToken })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Gera novo Pair Code
      const response = await sessionApi.pairPhone({ phone: pairPhoneInput.trim() } as any, {
        token: sessionToken,
      })

      // API retorna response.data.data.LinkingCode (estrutura dupla)
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const code = rawData?.LinkingCode || null

      if (code) {
        setPairCode(code)
        toast.success(`Novo código: ${code}`, {
          duration: 10000,
          description: "Digite este código no WhatsApp",
        })
        startPairRefreshTimer() // Reinicia timer
      }
    } catch (error) {
      toast.error("Erro ao renovar código de pareamento")
      logger.error("Erro no refresh do Pair", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "refreshPairCode",
        metadata: { id },
      })
    }
  }, [
    instance?.token,
    pairPhoneInput,
    id,
    clearRefreshTimers,
    fetchSessionStatus,
    startPairRefreshTimer,
  ])

  const handleSessionAction = useCallback(
    async (action: "connect" | "refresh" | "disconnect" | "logout") => {
      if (!instance?.token) {
        toast.error("Token da instância indisponível")
        return
      }

      const sessionToken = instance.token

      setActionLoading(action)
      try {
        if (action === "connect") {
          await sessionApi.connect({ token: sessionToken })
          toast.success("Conexão iniciada com sucesso")
        } else if (action === "refresh") {
          await sessionApi.refresh({ token: sessionToken })
          toast.success("Sessão atualizada")
        } else if (action === "disconnect") {
          await sessionApi.disconnect({ token: sessionToken })
          toast.success("Instância desconectada")
        } else if (action === "logout") {
          await sessionApi.logout({ token: sessionToken })
          toast.success("Logout realizado com sucesso")
        }

        // Aguarda 500ms antes de verificar status para dar tempo da API processar
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Atualiza status após ação
        await fetchSessionStatus(sessionToken)

        // Se foi disconnect ou logout, limpa o QR code e força reset do estado
        if (action === "disconnect" || action === "logout") {
          setQrCodeData(null)
          setSessionStatus((prev) =>
            prev ? { ...prev, connected: false, loggedIn: false, qr_code: undefined } : null
          )
        }
      } catch (error: any) {
        const userMessage = getErrorMessage(error, `Erro ao executar ação: ${action}`)
        toast.error(userMessage)
        logger.error(
          "Erro ao executar ação de sessão",
          error instanceof Error ? error : undefined,
          {
            component: "EditInstancePage",
            action: `session.${action}`,
            metadata: { id },
          }
        )
      } finally {
        setActionLoading(null)
      }
    },
    [fetchSessionStatus, id, instance?.token]
  )

  const handleShowQrCode = useCallback(async () => {
    const sessionToken = instance?.token
    if (!sessionToken) {
      toast.error("Token da instância indisponível")
      return
    }

    setQrLoading(true)
    try {
      const response = await sessionApi.qr({ token: sessionToken })
      // Prioriza QRCode (capital) que é o formato correto da API
      const qrData = (response.data as any)?.QRCode || null

      if (!qrData) {
        toast.info("Nenhum QR code disponível no momento")
      } else {
        startQRRefreshTimer() // Inicia timer de 40s para auto-refresh
      }

      setQrCodeData(qrData)
      setQrDialogOpen(true)
    } catch (error) {
      toast.error("Erro ao carregar QR code")
      logger.error("Erro ao buscar QR code", error instanceof Error ? error : undefined, {
        component: "EditInstancePage",
        action: "session.qr",
        metadata: { id },
      })
    } finally {
      setQrLoading(false)
    }
  }, [id, instance?.token])

  const handleGeneratePairCode = useCallback(async () => {
    const sessionToken = instance?.token
    if (!sessionToken) {
      toast.error("Token da instância indisponível")
      return
    }

    if (!pairPhoneInput.trim()) {
      toast.error("Informe o número de telefone para gerar o código")
      return
    }

    setPairLoading(true)
    try {
      const response = await sessionApi.pairPhone(
        {
          phone: pairPhoneInput.trim(),
        } as any,
        { token: sessionToken }
      )

      // API retorna response.data.data.LinkingCode (estrutura dupla)
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const code = rawData?.LinkingCode || null

      if (code) {
        setPairCode(code)
        startPairRefreshTimer() // Inicia timer de 40s para auto-refresh
        toast.success("Código de pareamento gerado")
      } else {
        toast.info("Código gerado, mas resposta vazia. Verifique a instância.")
        setPairCode(null)
      }
    } catch (error) {
      const userMessage = getErrorMessage(error, "Erro ao gerar código")
      toast.error(userMessage)
      logger.error(
        "Erro ao gerar código de pareamento",
        error instanceof Error ? error : undefined,
        {
          component: "EditInstancePage",
          action: "session.pairPhone",
          metadata: { id },
        }
      )
    } finally {
      setPairLoading(false)
    }
  }, [id, instance?.token, pairPhoneInput])

  useEffect(() => {
    void loadInstance()
  }, [loadInstance])

  useEffect(() => {
    if (!instance?.token || statusLoading || sessionStatus) {
      return
    }

    void fetchSessionStatus(instance.token)
  }, [fetchSessionStatus, instance?.token, sessionStatus, statusLoading])

  // Cleanup dos timers quando os diálogos fecham ou componente desmonta
  useEffect(() => {
    if (!qrDialogOpen) {
      clearRefreshTimers()
    }
  }, [qrDialogOpen, clearRefreshTimers])

  useEffect(() => {
    if (!pairDialogOpen) {
      clearRefreshTimers()
    }
  }, [pairDialogOpen, clearRefreshTimers])

  // Cleanup geral ao desmontar
  useEffect(() => {
    return () => {
      clearRefreshTimers()
    }
  }, [clearRefreshTimers])

  const eventList = useMemo(() => {
    if (!instance?.events) return []
    return instance.events
      .split(",")
      .map((event) => event.trim())
      .filter(Boolean)
  }, [instance?.events])

  const userFormInitialValues = useMemo(
    () => ({
      name: instance?.name || "",
      webhook_url: instance?.webhook || "",
      webhook_events: eventList,
    }),
    [instance?.name, instance?.webhook, eventList]
  )

  const webhookFormInitialValues = useMemo(
    () => ({
      webhook_url: instance?.webhook || "",
      webhook_events: eventList,
    }),
    [instance?.webhook, eventList]
  )

  const s3FormInitialValues = useMemo(
    () => ({
      s3_endpoint: instance?.s3_config?.endpoint || "",
      s3_region: instance?.s3_config?.region || "us-east-1",
      s3_bucket: instance?.s3_config?.bucket || "",
      s3_access_key: instance?.s3_config?.access_key || "",
      s3_secret_key: "",
      s3_public_url: instance?.s3_config?.public_url || "",
      s3_path_style: Boolean(instance?.s3_config?.path_style),
      s3_media_delivery: (instance?.s3_config?.media_delivery as any) || "base64",
      s3_retention_days: instance?.s3_config?.retention_days ?? 0,
      s3_disable_acl: instance?.s3_config?.disable_acl ?? true,
    }),
    [
      instance?.s3_config?.endpoint,
      instance?.s3_config?.region,
      instance?.s3_config?.bucket,
      instance?.s3_config?.access_key,
      instance?.s3_config?.public_url,
      instance?.s3_config?.path_style,
      instance?.s3_config?.media_delivery,
      instance?.s3_config?.retention_days,
      instance?.s3_config?.disable_acl,
    ]
  )

  const rabbitmqEventList = useMemo(() => {
    if (!instance?.rabbitmq_config?.events) return []
    return instance.rabbitmq_config.events
      .split(",")
      .map((event) => event.trim())
      .filter(Boolean)
  }, [instance?.rabbitmq_config?.events])

  const rabbitmqFormInitialValues = useMemo(
    () => ({
      rabbitmq_url: instance?.rabbitmq_config?.url || "",
      rabbitmq_exchange_name: instance?.rabbitmq_config?.exchange || "",
      rabbitmq_exchange_type: (instance?.rabbitmq_config?.exchange_type as any) || "topic",
      rabbitmq_queue_name: instance?.rabbitmq_config?.queue || "",
      rabbitmq_queue_type: (instance?.rabbitmq_config?.queue_type as any) || "classic",
      rabbitmq_routing_key: instance?.rabbitmq_config?.routing_key || "",
      rabbitmq_events: rabbitmqEventList,
      rabbitmq_durable: instance?.rabbitmq_config?.durable ?? true,
      rabbitmq_auto_delete: instance?.rabbitmq_config?.auto_delete ?? false,
      rabbitmq_exclusive: instance?.rabbitmq_config?.exclusive ?? false,
      rabbitmq_no_wait: instance?.rabbitmq_config?.no_wait ?? false,
      rabbitmq_delivery_mode: (instance?.rabbitmq_config?.delivery_mode?.toString() as any) || "2",
    }),
    [
      instance?.rabbitmq_config?.url,
      instance?.rabbitmq_config?.exchange,
      instance?.rabbitmq_config?.exchange_type,
      instance?.rabbitmq_config?.queue,
      instance?.rabbitmq_config?.queue_type,
      instance?.rabbitmq_config?.routing_key,
      instance?.rabbitmq_config?.durable,
      instance?.rabbitmq_config?.auto_delete,
      instance?.rabbitmq_config?.exclusive,
      instance?.rabbitmq_config?.no_wait,
      instance?.rabbitmq_config?.delivery_mode,
      rabbitmqEventList,
    ]
  )

  const skipFiltersInitialValues = useMemo(
    () => ({
      skip_media_download: instance?.skip_media_download ?? false,
      skip_groups: instance?.skip_groups ?? false,
      skip_newsletters: instance?.skip_newsletters ?? false,
      skip_broadcasts: instance?.skip_broadcasts ?? false,
      skip_own_messages: instance?.skip_own_messages ?? false,
      skip_calls: instance?.skip_calls ?? false,
    }),
    [
      instance?.skip_media_download,
      instance?.skip_groups,
      instance?.skip_newsletters,
      instance?.skip_broadcasts,
      instance?.skip_own_messages,
      instance?.skip_calls,
    ]
  )

  const proxyInitialValues = useMemo(
    () => ({
      proxy_url: instance?.proxy_config?.proxy_url || instance?.proxy_url || "",
    }),
    [instance?.proxy_config?.proxy_url, instance?.proxy_url]
  )

  const callSettingsInitialValues = useMemo(
    () => ({
      call_auto_reject: instance?.skip_calls ?? false,
      call_reject_message: instance?.call_reject_message || "",
      call_reject_type: (instance?.call_reject_type as any) || "busy",
    }),
    [instance?.skip_calls, instance?.call_reject_message, instance?.call_reject_type]
  )

  const instanceAvatarInitials = useMemo(() => {
    if (!instance?.name) return "?"
    const parts = instance.name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
    return `${parts[0]![0] || ""}${parts[1]![0] || ""}`.toUpperCase()
  }, [instance?.name])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!instance) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Instância não encontrada</h3>
        <p className="text-muted-foreground mb-4">
          A instância solicitada não existe ou foi deletada
        </p>
        <Button onClick={() => router.push("/admin/instances")}>Voltar para Instâncias</Button>
      </div>
    )
  }

  // Extrai hasClient do sessionStatus normalizado ou do raw data
  const rawData = instance as any
  const hasClient = Boolean(
    (sessionStatus as any)?.hasClient ?? rawData?.hasClient ?? sessionStatus?.paired ?? false
  )

  // Verifica conexão: precisa estar connected E ter cliente ativo
  const isConnected = Boolean(sessionStatus?.connected ?? instance.connected) && hasClient
  const isLoggedIn = Boolean(sessionStatus?.loggedIn ?? instance.loggedIn)
  const currentJid = sessionStatus?.jid ?? instance.jid

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={instance.avatar_url} alt={instance.name} />
              <AvatarFallback className="bg-muted text-sm font-semibold">
                {instanceAvatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold md:text-3xl md:tracking-tight">
                  {instance.name}
                </h1>
                <Badge
                  className={isConnected ? "bg-green-600 text-white" : ""}
                  variant={isConnected ? "default" : "destructive"}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Desconectado
                    </>
                  )}
                </Badge>
                {statusLoading && (
                  <span className="inline-flex items-center text-xs text-muted-foreground">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Atualizando status...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <User className="h-3 w-3" />
                  ID: {instance.id}
                </span>
                {currentJid && (
                  <span>
                    JID:{" "}
                    <code className="bg-muted px-2 py-0.5 rounded font-mono text-[11px]">
                      {currentJid}
                    </code>
                  </span>
                )}
              </div>
            </div>
          </div>
          {instance.token && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Token:</span>
              <div className="flex items-center gap-2">
                <Input
                  type={tokenVisible ? "text" : "password"}
                  value={instance.token}
                  readOnly
                  className="w-[280px] bg-muted/40 font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setTokenVisible((prev) => !prev)}
                >
                  {tokenVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Alternar visibilidade do token</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={copyToken}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copiar token</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status da Sessão</CardTitle>
          <CardDescription>
            Gerencie a conexão da instância com o WhatsApp e obtenha dados de pareamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="inline-flex items-center gap-2">
              <Badge variant={isLoggedIn ? "outline" : "secondary"}>
                {isLoggedIn ? "Logged In" : "Logged Out"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="flex-1 sm:flex-none"
              onClick={() => handleSessionAction("connect")}
              disabled={actionLoading !== null || statusLoading || isConnected}
            >
              {actionLoading === "connect" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Plug className="mr-2 h-4 w-4" />
                  Conectar
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => handleSessionAction("refresh")}
              disabled={actionLoading !== null || statusLoading}
            >
              {actionLoading === "refresh" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => handleSessionAction("disconnect")}
              disabled={actionLoading !== null || statusLoading || !isConnected}
            >
              {actionLoading === "disconnect" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desconectando...
                </>
              ) : (
                <>
                  <Unplug className="mr-2 h-4 w-4" />
                  Disconnect
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => handleSessionAction("logout")}
              disabled={actionLoading !== null || statusLoading || !isLoggedIn}
            >
              {actionLoading === "logout" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fazendo logout...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant="secondary"
              onClick={handleShowQrCode}
              disabled={qrLoading || statusLoading}
            >
              {qrLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Abrindo QR Code...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </>
              )}
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant="secondary"
              onClick={() => {
                setPairDialogOpen(true)
                setPairCode(null)
              }}
              disabled={pairLoading}
            >
              {pairLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Pair Code
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 md:grid-cols-3">
            <div>
              <span className="font-medium text-foreground">Conectado:</span>{" "}
              {isConnected ? "Sim" : "Não"}
            </div>
            <div>
              <span className="font-medium text-foreground">Autenticado:</span>{" "}
              {isLoggedIn ? "Sim" : "Não"}
            </div>
            <div className="md:col-span-1 sm:col-span-2">
              <span className="font-medium text-foreground">JID atual:</span>{" "}
              {currentJid ? (
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-[11px]">
                  {currentJid}
                </code>
              ) : (
                "—"
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <h1 className="text-2xl font-semibold md:text-3xl md:tracking-tight">
        Configurações da Instância
      </h1>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full h-auto flex-wrap gap-1 p-1">
            <TabsTrigger
              value="webhook"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Webhook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Webhook</span>
            </TabsTrigger>

            <TabsTrigger
              value="s3"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Cloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">S3 Storage</span>
              <span className="md:hidden">S3</span>
            </TabsTrigger>

            <TabsTrigger
              value="rabbitmq"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Rabbit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>RabbitMQ</span>
            </TabsTrigger>

            <TabsTrigger
              value="filters"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Filtros</span>
            </TabsTrigger>

            <TabsTrigger
              value="device"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plug className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Dispositivo</span>
              <span className="md:hidden">Device</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Webhook */}
        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhook</CardTitle>
              <CardDescription>
                Configure o endpoint para receber eventos do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookForm
                key={`webhook-form-${instance.id}`}
                initialValues={webhookFormInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: S3 Storage */}
        <TabsContent value="s3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Armazenamento S3</CardTitle>
              <CardDescription>
                Configure o bucket S3 para armazenar mídias (imagens, vídeos, documentos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <S3Form
                key={`s3-form-${instance.id}`}
                initialValues={s3FormInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: RabbitMQ */}
        <TabsContent value="rabbitmq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Mensagens RabbitMQ</CardTitle>
              <CardDescription>Configure RabbitMQ para processar eventos em fila</CardDescription>
            </CardHeader>
            <CardContent>
              <RabbitMQForm
                key={`rabbit-form-${instance.id}`}
                initialValues={rabbitmqFormInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Filtros */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Eventos</CardTitle>
              <CardDescription>
                Configure quais tipos de mensagens e eventos devem ser ignorados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkipFiltersForm
                key={`filters-form-${instance.id}`}
                initialValues={skipFiltersInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Dispositivo */}
        <TabsContent value="device" className="space-y-4">
          {/* Proxy Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Proxy</CardTitle>
              <CardDescription>
                Configure proxy HTTP/HTTPS para conexão com WhatsApp (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProxyForm
                key={`proxy-form-${instance.id}`}
                initialValues={proxyInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>

          {/* Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Chamadas</CardTitle>
              <CardDescription>
                Configure como o sistema deve lidar com chamadas recebidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CallSettingsForm
                key={`call-form-${instance.id}`}
                initialValues={callSettingsInitialValues as any}
                onSuccess={handleRefresh}
                instanceToken={instance.token}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code da Instância</DialogTitle>
            <DialogDescription>
              Escaneie este QR code com o aplicativo WhatsApp para vincular a instância.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCodeData ? (
              <>
                <div className="rounded-lg border bg-white p-4">
                  <Image
                    src={
                      qrCodeData.startsWith("data:")
                        ? qrCodeData
                        : `data:image/png;base64,${qrCodeData}`
                    }
                    alt="QR Code"
                    width={224}
                    height={224}
                    className="h-56 w-56"
                    unoptimized
                  />
                </div>
                {qrTimeRemaining > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      QR Code expira em{" "}
                      <strong className="text-foreground">{qrTimeRemaining}s</strong>
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Nenhum QR code disponível no momento. A sessão pode já estar conectada ou o código
                expirou. Clique em &quot;Atualizar&quot; para tentar novamente.
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setQrDialogOpen(true)
                void handleShowQrCode()
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button onClick={() => setQrDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pairDialogOpen}
        onOpenChange={(open) => {
          setPairDialogOpen(open)
          if (!open) {
            setPairLoading(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Pair Code</DialogTitle>
            <DialogDescription>
              Informe o número da conta WhatsApp (somente dígitos) para gerar o código de
              pareamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="pair-phone">
                Número (E.164 sem +)
              </label>
              <Input
                id="pair-phone"
                placeholder="5511999999999"
                value={pairPhoneInput}
                onChange={(event) => setPairPhoneInput(event.target.value)}
                disabled={pairLoading}
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: 5511999999999 (DDI + número, sem espaços ou sinais).
              </p>
            </div>

            {pairCode && (
              <div className="flex flex-col items-center gap-2 rounded-md border bg-muted/50 p-4">
                <span className="text-xs uppercase text-muted-foreground">Código Gerado</span>
                <div className="font-mono text-2xl tracking-[0.35em]">{pairCode}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(pairCode)
                    toast.success("Pair code copiado")
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
                {pairTimeRemaining > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Código expira em{" "}
                      <strong className="text-foreground">{pairTimeRemaining}s</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setPairDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleGeneratePairCode()} disabled={pairLoading}>
              {pairLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Código"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Instância</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a instância <strong>{instance.name}</strong>?
              <br />
              <br />
              Esta ação é <strong className="text-destructive">irreversível</strong> e todos os
              dados desta instância serão permanentemente perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
