/**
 * Calendar View Component
 *
 * Calendário visual para agendamento de campanhas.
 * Usa react-big-calendar para exibir campanhas agendadas.
 *
 * @module components/campaign/calendar-view
 */

"use client"

import { useCallback, useMemo, useState } from "react"

import { format, getDay, parse, startOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Pencil,
  Plus,
} from "lucide-react"
import { Calendar, type Event, View, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { logger } from "@/lib/logger"

/**
 * Calendar View Component
 *
 * Calendário visual para agendamento de campanhas.
 * Usa react-big-calendar para exibir campanhas agendadas.
 *
 * @module components/campaign/calendar-view
 */

/**
 * Calendar View Component
 *
 * Calendário visual para agendamento de campanhas.
 * Usa react-big-calendar para exibir campanhas agendadas.
 *
 * @module components/campaign/calendar-view
 */

// ============================================================================
// TYPES
// ============================================================================

interface CampaignEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  resource?: {
    status: "scheduled" | "running" | "completed" | "failed"
    instanceCount: number
    contactCount: number
    description?: string
  }
}

interface CalendarViewProps {
  events: CampaignEvent[]
  onEventClick?: (event: CampaignEvent) => void
  onDateClick?: (date: Date) => void
  onViewChange?: (view: View) => void
  onNavigate?: (date: Date) => void
  readOnly?: boolean
}

// ============================================================================
// LOCALIZER SETUP
// ============================================================================

const locales = {
  "pt-BR": ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
})

// ============================================================================
// CUSTOM COMPONENTS
// ============================================================================

/**
 * Toolbar customizada para o calendário
 */
function CustomToolbar({ label, onNavigate, onView, view }: any) {
  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => onNavigate("TODAY")}>
          Hoje
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold text-lg">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("month")}
        >
          Mês
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("week")}
        >
          Semana
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("day")}
        >
          Dia
        </Button>
        <Button
          variant={view === "agenda" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("agenda")}
        >
          Agenda
        </Button>
      </div>
    </div>
  )
}

/**
 * Componente customizado para eventos no calendário
 */
function EventComponent({ event }: { event: CampaignEvent }) {
  const statusColor = {
    scheduled: "bg-blue-500",
    running: "bg-yellow-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
  }

  const status = event.resource?.status || "scheduled"

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs">
      <div className={`w-2 h-2 rounded-full ${statusColor[status]}`} />
      <span className="font-medium truncate">{event.title}</span>
      {event.resource?.contactCount && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {event.resource.contactCount}
        </Badge>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CalendarView({
  events,
  onEventClick,
  onDateClick,
  onViewChange,
  onNavigate,
  readOnly = false,
}: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<View>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSelectEvent = useCallback(
    (event: CampaignEvent) => {
      logger.debug("Calendar: Event selected", null, {
        component: "CalendarView",
        action: "handleSelectEvent",
        metadata: { eventId: event.id },
      })

      setSelectedEvent(event)
      setShowEventDialog(true)

      if (onEventClick) {
        onEventClick(event)
      }
    },
    [onEventClick]
  )

  const handleSelectSlot = useCallback(
    ({ start }: { start: Date; end: Date }) => {
      if (readOnly) return

      logger.debug("Calendar: Date slot selected", null, {
        component: "CalendarView",
        action: "handleSelectSlot",
        metadata: { date: start.toISOString() },
      })

      if (onDateClick) {
        onDateClick(start)
      }
    },
    [onDateClick, readOnly]
  )

  const handleNavigate = useCallback(
    (date: Date) => {
      setCurrentDate(date)

      logger.debug("Calendar: Navigation changed", null, {
        component: "CalendarView",
        action: "handleNavigate",
        metadata: { date: date.toISOString() },
      })

      if (onNavigate) {
        onNavigate(date)
      }
    },
    [onNavigate]
  )

  const handleViewChange = useCallback(
    (view: View) => {
      setCurrentView(view)

      logger.debug("Calendar: View changed", null, {
        component: "CalendarView",
        action: "handleViewChange",
        metadata: { view },
      })

      if (onViewChange) {
        onViewChange(view)
      }
    },
    [onViewChange]
  )

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const calendarMessages = useMemo(
    () => ({
      date: "Data",
      time: "Hora",
      event: "Evento",
      allDay: "Dia inteiro",
      week: "Semana",
      work_week: "Semana de trabalho",
      day: "Dia",
      month: "Mês",
      previous: "Anterior",
      next: "Próximo",
      yesterday: "Ontem",
      tomorrow: "Amanhã",
      today: "Hoje",
      agenda: "Agenda",
      noEventsInRange: "Não há eventos neste período.",
      showMore: (total: number) => `+ Ver mais (${total})`,
    }),
    []
  )

  const eventStyleGetter = useCallback((event: CampaignEvent) => {
    const status = event.resource?.status || "scheduled"

    const statusStyles = {
      scheduled: {
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        color: "#ffffff",
      },
      running: {
        backgroundColor: "#eab308",
        borderColor: "#ca8a04",
        color: "#ffffff",
      },
      completed: {
        backgroundColor: "#22c55e",
        borderColor: "#16a34a",
        color: "#ffffff",
      },
      failed: {
        backgroundColor: "#ef4444",
        borderColor: "#dc2626",
        color: "#ffffff",
      },
    }

    return {
      style: {
        ...statusStyles[status],
        borderRadius: "4px",
        border: "none",
        fontSize: "0.875rem",
        padding: "2px 8px",
      },
    }
  }, [])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendário de Campanhas
          </CardTitle>
          <CardDescription>
            Visualize e gerencie suas campanhas agendadas no calendário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-background">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              culture="pt-BR"
              messages={calendarMessages}
              view={currentView}
              date={currentDate}
              onView={handleViewChange}
              onNavigate={handleNavigate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={!readOnly}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
                event: EventComponent,
              }}
              style={{ height: "100%" }}
            />
          </div>

          {/* Legenda de status */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Em execução</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Falhou</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de detalhes do evento */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detalhes da Campanha
            </DialogTitle>
            <DialogDescription>Informações sobre a campanha agendada</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                {selectedEvent.resource?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.resource.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="font-medium">
                    {format(selectedEvent.start, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fim</p>
                  <p className="font-medium">
                    {format(selectedEvent.end, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {selectedEvent.resource && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedEvent.resource.status === "completed"
                          ? "default"
                          : selectedEvent.resource.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {selectedEvent.resource.status === "scheduled" && "Agendado"}
                      {selectedEvent.resource.status === "running" && "Em execução"}
                      {selectedEvent.resource.status === "completed" && "Concluído"}
                      {selectedEvent.resource.status === "failed" && "Falhou"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contatos</p>
                    <p className="font-medium">{selectedEvent.resource.contactCount}</p>
                  </div>
                </div>
              )}

              {!readOnly && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="default" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
