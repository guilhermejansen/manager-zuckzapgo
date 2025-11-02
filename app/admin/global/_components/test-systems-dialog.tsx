import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  Database,
  Megaphone,
  Rabbit,
  Webhook,
  Wifi,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { GlobalTestResults } from "@/types"

interface TestSystemsDialogProps {
  open: boolean
  results: GlobalTestResults | null
  onClose: () => void
}

export function TestSystemsDialog({ open, results, onClose }: TestSystemsDialogProps) {
  if (!results) return null

  const systems = [
    { key: "webhook", name: "Webhook", icon: Webhook, data: results.webhook },
    { key: "rabbitmq", name: "RabbitMQ", icon: Rabbit, data: results.rabbitmq },
    { key: "s3", name: "S3 Storage", icon: Cloud, data: results.s3 },
    { key: "sqs", name: "SQS", icon: Database, data: results.sqs },
    { key: "redis", name: "Redis", icon: Megaphone, data: results.redis },
    { key: "websocket", name: "WebSocket", icon: Wifi, data: results.websocket },
  ]

  const successCount = systems.filter((s) => s.data.success).length
  const totalCount = systems.length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultados dos Testes de Sistema</DialogTitle>
          <DialogDescription>
            Testados {successCount} de {totalCount} sistemas com sucesso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{successCount}</p>
              <p className="text-xs text-muted-foreground">Sucessos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{totalCount - successCount}</p>
              <p className="text-xs text-muted-foreground">Falhas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          <Separator />

          {/* Test Results */}
          <div className="space-y-3">
            {systems.map((system) => (
              <TestSystemItem
                key={system.key}
                name={system.name}
                icon={system.icon}
                result={system.data}
              />
            ))}
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TestSystemItemProps {
  name: string
  icon: React.ElementType
  result: {
    enabled: boolean
    success: boolean
    error?: string | null
    bucket?: string
    region?: string
  }
}

function TestSystemItem({ name, icon: Icon, result }: TestSystemItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{name}</h4>
          {!result.enabled && (
            <Badge variant="secondary" className="text-xs">
              Desabilitado
            </Badge>
          )}
        </div>

        {result.bucket && <p className="text-xs text-muted-foreground">Bucket: {result.bucket}</p>}

        {result.region && <p className="text-xs text-muted-foreground">Região: {result.region}</p>}

        {result.error && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="break-words">{result.error}</span>
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        {result.success ? (
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium">Sucesso</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Falha</span>
          </div>
        )}
      </div>
    </div>
  )
}
