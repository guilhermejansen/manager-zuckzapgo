"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import {
  AlertTriangle,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Plug,
  QrCode,
  RefreshCw,
  Smartphone,
  Unplug,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sessionApi } from "@/lib/api"
import type { PairPhoneResponse, QRCodeResponse, SessionStatus } from "@/types/api"

/**
 * Normaliza resposta da API de status para formato consistente
 * Baseado na implementação da página de detalhes
 */
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

/**
 * Extrai mensagem de erro de diferentes formatos de resposta
 */
function getErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.error || error?.data?.error || error?.message || fallback
}

interface ConnectionStepProps {
  instanceId: string
  instanceToken: string
  instanceName: string
  onConnectionSuccess?: () => void
  onSkip?: () => void
}

export function ConnectionStep({
  instanceId,
  instanceToken,
  instanceName,
  onConnectionSuccess,
  onSkip,
}: ConnectionStepProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isLoadingQR, setIsLoadingQR] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "qr_ready" | "connecting" | "connected"
  >("disconnected")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPairing, setIsPairing] = useState(false)
  const [pairCode, setPairCode] = useState<string | null>(null)
  const [showPushNotification, setShowPushNotification] = useState(true)
  const [copied, setCopied] = useState(false)
  const [tokenVisible, setTokenVisible] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [actionLoading, setActionLoading] = useState<
    "connect" | "refresh" | "disconnect" | "logout" | null
  >(null)
  const [qrRefreshTimer, setQrRefreshTimer] = useState<NodeJS.Timeout | null>(null)
  const [qrTimeRemaining, setQrTimeRemaining] = useState<number>(40)
  const [pairRefreshTimer, setPairRefreshTimer] = useState<NodeJS.Timeout | null>(null)
  const [pairTimeRemaining, setPairTimeRemaining] = useState<number>(40)

  // Polling de status da conexão
  useEffect(() => {
    if (connectionStatus === "qr_ready" || connectionStatus === "connecting") {
      const interval = setInterval(async () => {
        try {
          const response = await sessionApi.status({ token: instanceToken })
          // API retorna response.data.data (estrutura dupla)
          const normalized = normalizeSessionStatusPayload(
            (response as any).data?.data || (response as any).data || response
          )

          if (normalized) {
            const { status } = normalized

            // Verifica conexão REAL (connected + hasClient + loggedIn)
            const isFullyConnected = status.connected && status.hasClient && status.loggedIn

            if (isFullyConnected) {
              setConnectionStatus("connected")
              setQrCode(null)
              setPairCode(null)
              clearInterval(interval)
              toast.success("WhatsApp conectado com sucesso!")
              onConnectionSuccess?.()
            } else if (!status.connected) {
              // Conexão foi perdida
              setConnectionStatus("disconnected")
              clearInterval(interval)
              toast.error("Conexão perdida. Clique em Connect novamente.")
            }
          }
        } catch (error) {
          console.error("Erro ao verificar status:", error)
        }
      }, 3000) // Verifica a cada 3 segundos

      setPollingInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [connectionStatus, instanceToken, onConnectionSuccess, pollingInterval])

  // Busca status inicial
  useEffect(() => {
    checkStatus()
  }, [])

  // Cleanup dos timers quando componente desmonta ou conexão completa
  useEffect(() => {
    if (connectionStatus === "connected") {
      clearRefreshTimers()
    }

    return () => {
      clearRefreshTimers()
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [connectionStatus])

  const checkStatus = async () => {
    try {
      const response = await sessionApi.status({ token: instanceToken })
      // API retorna response.data.data (estrutura dupla)
      const normalized = normalizeSessionStatusPayload(
        (response as any).data?.data || (response as any).data || response
      )

      if (normalized) {
        const { status, raw } = normalized

        // Verifica conexão completa (connected + hasClient + loggedIn)
        const isFullyConnected = status.connected && status.hasClient && status.loggedIn

        if (isFullyConnected) {
          // Totalmente conectado e autenticado
          setConnectionStatus("connected")
          setQrCode(null)
          setPairCode(null)
        } else if (status.connected && status.hasClient && !status.loggedIn) {
          // Conectado mas não logado - PODE gerar QR Code
          setConnectionStatus("qr_ready")

          // Extrai QR code se disponível no status
          const qrFromStatus = raw.qr_code || raw.qrcode || raw.QRCode
          if (qrFromStatus) {
            setQrCode(String(qrFromStatus))
          }
        } else {
          // Sem conexão ou sem cliente
          setConnectionStatus("disconnected")
          setQrCode(null)
        }
      } else {
        setConnectionStatus("disconnected")
      }
    } catch (error) {
      console.error("Erro ao verificar status inicial:", error)
      setConnectionStatus("disconnected")
    }
  }

  const handleSessionAction = async (action: "connect" | "refresh" | "disconnect" | "logout") => {
    if (!instanceToken) {
      toast.error("Token da instância indisponível")
      return
    }

    setActionLoading(action)

    try {
      const actionMap = {
        connect: sessionApi.connect,
        refresh: sessionApi.refresh,
        disconnect: sessionApi.disconnect,
        logout: sessionApi.logout,
      }

      await actionMap[action]({ token: instanceToken })

      const actionMessages = {
        connect: "Conectado com sucesso!",
        refresh: "Sessão atualizada!",
        disconnect: "Desconectado com sucesso!",
        logout: "Logout realizado com sucesso!",
      }

      toast.success(actionMessages[action])

      // Aguarda 500ms antes de verificar status para dar tempo da API processar
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Atualiza status após ação
      await checkStatus()

      // Se foi disconnect ou logout, limpa o QR code e força estado desconectado
      if (action === "disconnect" || action === "logout") {
        setQrCode(null)
        setConnectionStatus("disconnected")
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, `Erro ao executar ação: ${action}`)

      // Se erro for "already connected", ignora e apenas atualiza status
      if (errorMessage.toLowerCase().includes("already connected")) {
        toast.info("Sessão já está conectada")
        await checkStatus()
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateQR = async () => {
    // Permite gerar QR quando conectado mas não logado
    if (connectionStatus === "disconnected") {
      toast.error("Clique em 'Connect' primeiro para iniciar a sessão!")
      return
    }

    setIsLoadingQR(true)
    clearRefreshTimers() // Limpa timers anteriores

    try {
      const response = await sessionApi.qr({ token: instanceToken })

      // Tenta extrair de response.data ou response.data.data
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const qrData = rawData?.QRCode || null

      if (qrData) {
        setQrCode(qrData)
        setConnectionStatus("qr_ready")
        toast.success("QR Code gerado! Escaneie com seu WhatsApp.")
        startQRRefreshTimer() // Inicia timer de 40s
      } else {
        toast.info("Nenhum QR code disponível no momento")
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Erro ao gerar QR Code"))
    } finally {
      setIsLoadingQR(false)
    }
  }

  const handlePhonePairing = async () => {
    // Permite pareamento quando conectado mas não logado
    if (connectionStatus === "disconnected") {
      toast.error("Clique em 'Connect' primeiro para iniciar a sessão!")
      return
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Digite um número válido (10-15 dígitos)")
      return
    }

    setIsPairing(true)
    const previousStatus = connectionStatus
    setConnectionStatus("connecting")
    clearRefreshTimers() // Limpa timers anteriores

    try {
      const response = await sessionApi.pairPhone(
        {
          phone: phoneNumber,
          show_push_notification: showPushNotification,
        },
        { token: instanceToken }
      )

      // API retorna response.data.data.LinkingCode (estrutura dupla)
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const pairingCode = rawData?.LinkingCode || null

      if (pairingCode) {
        setPairCode(pairingCode)
        setConnectionStatus("connecting")
        startPairRefreshTimer() // Inicia timer de 40s
        toast.success("Código de pareamento gerado com sucesso!")
      } else {
        toast.info("Código gerado, mas resposta vazia. Verifique a instância.")
        setPairCode(null)
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Erro ao gerar código de pareamento"))
      setConnectionStatus(previousStatus) // Restaura status anterior em caso de erro
    } finally {
      setIsPairing(false)
    }
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(instanceToken)
    setCopied(true)
    toast.success("Token copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyInstanceId = () => {
    navigator.clipboard.writeText(instanceId)
    toast.success("ID copiado!")
  }

  // Limpa timers de refresh
  const clearRefreshTimers = () => {
    if (qrRefreshTimer) {
      clearInterval(qrRefreshTimer)
      setQrRefreshTimer(null)
    }
    if (pairRefreshTimer) {
      clearInterval(pairRefreshTimer)
      setPairRefreshTimer(null)
    }
  }

  const clearQRTimer = () => {
    if (qrRefreshTimer) {
      clearInterval(qrRefreshTimer)
      setQrRefreshTimer(null)
    }
  }

  const clearPairTimer = () => {
    if (pairRefreshTimer) {
      clearInterval(pairRefreshTimer)
      setPairRefreshTimer(null)
    }
  }

  // Auto-refresh do QR Code após 40s
  const startQRRefreshTimer = () => {
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
  }

  // Auto-refresh do Pair Code após 40s
  const startPairRefreshTimer = () => {
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
  }

  // Refresh QR Code: disconnect → connect → gerar novo QR
  const refreshQRCode = async () => {
    try {
      // Verifica status antes de refresh
      const statusResponse = await sessionApi.status({ token: instanceToken })
      const normalized = normalizeSessionStatusPayload(
        (statusResponse as any).data?.data || (statusResponse as any).data || statusResponse
      )

      // Se já conectado, não precisa refresh
      if (normalized?.status.connected && normalized?.status.loggedIn) {
        setConnectionStatus("connected")
        clearRefreshTimers()
        toast.success("WhatsApp já está conectado!")
        onConnectionSuccess?.()
        return
      }

      // Disconnect → Connect → Gerar QR
      toast.info("Renovando QR Code...")
      await sessionApi.disconnect({ token: instanceToken })
      await new Promise((resolve) => setTimeout(resolve, 500))
      await sessionApi.connect({ token: instanceToken })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Gera novo QR Code
      const response = await sessionApi.qr({ token: instanceToken })
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const qrData = rawData?.QRCode || null

      if (qrData) {
        setQrCode(qrData)
        setConnectionStatus("qr_ready")
        startQRRefreshTimer() // Reinicia timer
      }
    } catch (error) {
      toast.error("Erro ao renovar QR Code")
      console.error("Erro no refresh do QR:", error)
    }
  }

  // Refresh Pair Code: disconnect → connect → gerar novo código
  const refreshPairCode = async () => {
    try {
      // Verifica status antes de refresh
      const statusResponse = await sessionApi.status({ token: instanceToken })
      const normalized = normalizeSessionStatusPayload(
        (statusResponse as any).data?.data || (statusResponse as any).data || statusResponse
      )

      // Se já conectado, não precisa refresh
      if (normalized?.status.connected && normalized?.status.loggedIn) {
        setConnectionStatus("connected")
        clearRefreshTimers()
        toast.success("WhatsApp já está conectado!")
        onConnectionSuccess?.()
        return
      }

      // Disconnect → Connect → Gerar Pair Code
      toast.info("Renovando código de pareamento...")
      await sessionApi.disconnect({ token: instanceToken })
      await new Promise((resolve) => setTimeout(resolve, 500))
      await sessionApi.connect({ token: instanceToken })
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Gera novo Pair Code
      const response = await sessionApi.pairPhone(
        {
          phone: phoneNumber,
          show_push_notification: showPushNotification,
        },
        { token: instanceToken }
      )

      // API retorna response.data.data.LinkingCode (estrutura dupla)
      const rawData = ((response as any).data?.data || (response as any).data) as any
      const pairingCode = rawData?.LinkingCode || null

      if (pairingCode) {
        setPairCode(pairingCode)
        toast.success("Novo código de pareamento gerado!")
        startPairRefreshTimer() // Reinicia timer
      }
    } catch (error) {
      toast.error("Erro ao renovar código de pareamento")
      console.error("Erro no refresh do Pair:", error)
    }
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
        )
      case "connecting":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            Conectando...
          </Badge>
        )
      case "qr_ready":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <QrCode className="h-3 w-3 mr-1" />
            QR Code Pronto
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Desconectado
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {connectionStatus === "connected" ? (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong className="font-semibold">WhatsApp conectado e autenticado!</strong>
            <p className="mt-1 text-sm">Sua conta WhatsApp está conectada e pronta para uso.</p>
          </AlertDescription>
        </Alert>
      ) : connectionStatus === "qr_ready" ? (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong className="font-semibold">Sessão iniciada com sucesso!</strong>
            <p className="mt-1 text-sm">
              Agora você pode gerar um QR Code ou usar Phone Pairing para conectar sua conta
              WhatsApp.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>Instância criada com sucesso!</strong> Clique em <strong>Connect</strong> para
            iniciar a sessão antes de gerar o QR Code ou código de pareamento.
          </AlertDescription>
        </Alert>
      )}

      {/* Instance Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{instanceName}</h3>
                <p className="text-sm text-muted-foreground">Instância do WhatsApp</p>
              </div>
              {getStatusBadge()}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">ID da Instância</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                    {instanceId}
                  </code>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCopyInstanceId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Token de Acesso</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                    {tokenVisible ? instanceToken : "•".repeat(32)}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTokenVisible(!tokenVisible)}
                  >
                    {tokenVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCopyToken}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Ações da Sessão</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                onClick={() => handleSessionAction("connect")}
                disabled={actionLoading !== null || connectionStatus === "connected"}
                variant={connectionStatus === "connected" ? "secondary" : "default"}
                size="sm"
                className="w-full"
              >
                {actionLoading === "connect" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plug className="h-4 w-4 mr-2" />
                )}
                Connect
              </Button>

              <Button
                onClick={() => handleSessionAction("refresh")}
                disabled={actionLoading !== null}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {actionLoading === "refresh" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>

              <Button
                onClick={() => handleSessionAction("disconnect")}
                disabled={actionLoading !== null}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {actionLoading === "disconnect" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Unplug className="h-4 w-4 mr-2" />
                )}
                Disconnect
              </Button>

              <Button
                onClick={() => handleSessionAction("logout")}
                disabled={actionLoading !== null}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {actionLoading === "logout" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                Logout
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Dica:</strong> Clique em <strong>Connect</strong> primeiro para iniciar a
              sessão antes de gerar QR Code ou código de pareamento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Methods */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Telefone
              </TabsTrigger>
            </TabsList>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-4 mt-4">
              <div className="text-center space-y-4">
                {!qrCode ? (
                  <div className="py-12 space-y-4">
                    <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gerar QR Code</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Clique no botão abaixo para gerar um QR Code e escaneie com seu WhatsApp
                      </p>
                      <Button onClick={handleGenerateQR} disabled={isLoadingQR} size="lg">
                        {isLoadingQR ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Gerando QR Code...
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4 mr-2" />
                            Gerar QR Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* QR Code Display */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-white rounded-lg border-2 border-dashed">
                        <Image
                          src={
                            qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`
                          }
                          alt="QR Code WhatsApp"
                          width={280}
                          height={280}
                          className="mx-auto"
                          unoptimized
                        />
                      </div>

                      {/* Timer - logo abaixo do QR */}
                      {qrTimeRemaining > 0 && (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-muted rounded-md">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Expira em{" "}
                            <strong className="text-foreground">{qrTimeRemaining}s</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <Alert>
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-semibold">Como escanear:</p>
                          <ol className="list-decimal ml-4 space-y-1 text-sm">
                            <li className="pl-2">Abra o WhatsApp no seu celular</li>
                            <li className="pl-2">Toque em Mais opções ou Configurações</li>
                            <li className="pl-2">Toque em Aparelhos conectados</li>
                            <li className="pl-2">Toque em Conectar um aparelho</li>
                            <li className="pl-2">
                              Aponte seu celular para esta tela para escanear o QR Code
                            </li>
                          </ol>
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* Refresh Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleGenerateQR}
                        variant="outline"
                        disabled={isLoadingQR}
                        size="lg"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Gerar Novo QR Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Phone Pairing Tab */}
            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Digite seu número de telefone para receber um código de pareamento no WhatsApp
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Número de Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5511999999999 (apenas números)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      maxLength={15}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Digite apenas números (10-15 dígitos)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notification"
                      checked={showPushNotification}
                      onChange={(e) => setShowPushNotification(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="notification" className="text-sm font-normal cursor-pointer">
                      Exibir notificação push no celular
                    </Label>
                  </div>

                  <Button
                    onClick={handlePhonePairing}
                    disabled={isPairing || !phoneNumber || phoneNumber.length < 10}
                    className="w-full"
                    size="lg"
                  >
                    {isPairing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando Código...
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4 mr-2" />
                        Gerar Código de Pareamento
                      </>
                    )}
                  </Button>
                </div>

                {/* Código Gerado */}
                {pairCode && (
                  <div className="flex flex-col items-center gap-4 p-6 rounded-lg border-2 border-dashed border-primary bg-primary/5">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Código Gerado
                      </p>
                      <div className="font-mono text-4xl font-bold tracking-[0.5em] text-primary">
                        {pairCode}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(pairCode)
                          toast.success("Código copiado!")
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </div>

                    {/* Timer - logo abaixo do código */}
                    {pairTimeRemaining > 0 && (
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-muted rounded-md">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Código expira em{" "}
                          <strong className="text-foreground">{pairTimeRemaining}s</strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Alert>
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <AlertDescription className="text-sm">
                    <strong>Após gerar o código:</strong>
                    <ol className="list-decimal ml-4 space-y-1 mt-2">
                      <li className="pl-2">Abra o WhatsApp no celular cadastrado</li>
                      <li className="pl-2">Toque em Mais opções → Aparelhos conectados</li>
                      <li className="pl-2">Toque em Conectar um aparelho</li>
                      <li className="pl-2">Toque em "Conectar com número de telefone"</li>
                      <li className="pl-2">Digite o código de 8 dígitos que aparecerá na tela</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        {onSkip && (
          <Button type="button" variant="outline" onClick={onSkip}>
            {connectionStatus === "connected" ? "Ir para Detalhes" : "Conectar Depois"}
          </Button>
        )}

        {connectionStatus === "connected" && onConnectionSuccess && (
          <Button type="button" onClick={onConnectionSuccess}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Continuar
          </Button>
        )}
      </div>
    </div>
  )
}
