/**
 * Campaign Schedule Page
 *
 * Página de agendamento de campanhas.
 * Permite criar, editar e visualizar agendamentos de campanhas.
 *
 * @module app/admin/campaigns/schedule/page
 */
import Link from "next/link"

import { Plus } from "lucide-react"

import { CalendarView } from "@/components/campaign/calendar-view"
import { CronEditor } from "@/components/campaign/cron-editor"
import { SchedulePreview } from "@/components/campaign/schedule-preview"
import { TimezoneSelector } from "@/components/campaign/timezone-selector"
import { Button } from "@/components/ui/button"

// ============================================================================
// METADATA
// ============================================================================

export const metadata = {
  title: "Agendamento de Campanhas",
  description: "Gerencie o agendamento das suas campanhas",
}

// ============================================================================
// MOCK DATA (Replace with real API calls)
// ============================================================================

const mockEvents = [
  {
    id: "1",
    title: "Campanha Black Friday",
    start: new Date(2025, 10, 29, 10, 0),
    end: new Date(2025, 10, 29, 12, 0),
    resource: {
      status: "scheduled" as const,
      instanceCount: 3,
      contactCount: 1500,
      description: "Envio de ofertas Black Friday para clientes premium",
    },
  },
  {
    id: "2",
    title: "Newsletter Semanal",
    start: new Date(2025, 10, 4, 9, 0),
    end: new Date(2025, 10, 4, 10, 0),
    resource: {
      status: "completed" as const,
      instanceCount: 2,
      contactCount: 850,
      description: "Newsletter semanal com novidades e promoções",
    },
  },
  {
    id: "3",
    title: "Lembrete Pagamento",
    start: new Date(2025, 10, 5, 14, 30),
    end: new Date(2025, 10, 5, 15, 30),
    resource: {
      status: "running" as const,
      instanceCount: 1,
      contactCount: 320,
      description: "Lembrete automático de vencimento de faturas",
    },
  },
  {
    id: "4",
    title: "Promoção Cyber Monday",
    start: new Date(2025, 11, 2, 8, 0),
    end: new Date(2025, 11, 2, 18, 0),
    resource: {
      status: "scheduled" as const,
      instanceCount: 5,
      contactCount: 2500,
      description: "Campanha especial Cyber Monday",
    },
  },
]

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function CampaignSchedulePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamento de Campanhas</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize o agendamento das suas campanhas
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new?schedule=true">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha Agendada
          </Link>
        </Button>
      </div>

      {/* Calendar View */}
      <CalendarView
        events={mockEvents}
        onEventClick={(event) => {
          console.log("Event clicked:", event)
        }}
        onDateClick={(date) => {
          console.log("Date clicked:", date)
        }}
      />

      {/* Schedule Configuration Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Cron Editor */}
          <CronEditor
            value="0 9 * * 1-5"
            onChange={(cron) => {
              console.log("Cron changed:", cron)
            }}
          />

          {/* Timezone Selector */}
          <TimezoneSelector
            value="America/Sao_Paulo"
            onChange={(timezone) => {
              console.log("Timezone changed:", timezone)
            }}
            showPreview
          />
        </div>

        <div>
          {/* Schedule Preview */}
          <SchedulePreview cronExpression="0 9 * * 1-5" timezone="America/Sao_Paulo" count={5} />
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-2">Como funciona o agendamento</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Configure o horário usando o editor simples ou expressões cron avançadas</li>
          <li>• Selecione o fuso horário correto para garantir envio no horário desejado</li>
          <li>• Visualize as próximas execuções antes de salvar</li>
          <li>• Acompanhe todas as campanhas agendadas no calendário visual</li>
          <li>• Edite ou cancele agendamentos a qualquer momento</li>
        </ul>
      </div>
    </div>
  )
}
