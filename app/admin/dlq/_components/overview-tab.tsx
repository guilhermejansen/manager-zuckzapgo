import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, Clock, Database, TrendingUp } from "lucide-react"

import { StatCard } from "@/app/admin/global/_components/stat-card"
import { Badge } from "@/components/ui/badge"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQStats } from "@/types"

interface OverviewTabProps {
  stats: DLQStats
}

export function OverviewTab({ stats }: OverviewTabProps) {
  // Encontrar transport com mais eventos
  const topTransport = Object.entries(stats.by_transport || {}).sort(([, a], [, b]) => b - a)[0]

  // Encontrar tipo de evento mais comum
  const topEventType = Object.entries(stats.by_event_type || {}).sort(([, a], [, b]) => b - a)[0]

  // Calcular idade do evento mais antigo
  const oldestEventAge = safeDateFormat(
    stats.oldest_event,
    (date) => formatDistanceToNow(date, { locale: ptBR, addSuffix: false }),
    "N/A"
  )

  // Determinar variante baseado na quantidade de eventos
  const getTotalVariant = () => {
    if (stats.total_count === 0) return "success"
    if (stats.total_count < 50) return "default"
    if (stats.total_count < 200) return "warning"
    return "destructive"
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Visão Geral da DLQ</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Eventos"
          value={stats.total_count}
          variant={getTotalVariant()}
          icon={<AlertCircle className="h-4 w-4" />}
          description="Eventos na fila de falhas"
        />

        <StatCard
          title="Principal Transport"
          value={topTransport ? topTransport[0] : "N/A"}
          icon={<Database className="h-4 w-4" />}
          description={topTransport ? `${topTransport[1]} eventos` : "Sem eventos"}
          truncate
        />

        <StatCard
          title="Tipo Mais Comum"
          value={topEventType ? topEventType[0] : "N/A"}
          icon={<TrendingUp className="h-4 w-4" />}
          description={topEventType ? `${topEventType[1]} eventos` : "Sem eventos"}
        />

        <StatCard
          title="Evento Mais Antigo"
          value={oldestEventAge}
          icon={<Clock className="h-4 w-4" />}
          description={stats.oldest_event ? "Tempo na fila" : "Sem eventos"}
          variant={stats.total_count > 100 ? "warning" : "default"}
        />
      </div>
    </div>
  )
}
