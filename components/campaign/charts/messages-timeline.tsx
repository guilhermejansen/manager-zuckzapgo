/**
 * Messages Timeline Chart
 *
 * Gráfico de linha mostrando timeline de mensagens enviadas/entregues/falhas.
 *
 * @module components/campaign/charts/messages-timeline
 */

"use client"

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Messages Timeline Chart
 *
 * Gráfico de linha mostrando timeline de mensagens enviadas/entregues/falhas.
 *
 * @module components/campaign/charts/messages-timeline
 */

/**
 * Messages Timeline Chart
 *
 * Gráfico de linha mostrando timeline de mensagens enviadas/entregues/falhas.
 *
 * @module components/campaign/charts/messages-timeline
 */

// ============================================================================
// TYPES
// ============================================================================

interface TimelineData {
  date: string
  sent: number
  delivered: number
  failed: number
}

interface MessagesTimelineProps {
  data: TimelineData[]
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MessagesTimeline({ data }: MessagesTimelineProps) {
  // Format data for chart
  const formattedData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), "dd/MM", { locale: ptBR }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline de Mensagens</CardTitle>
        <CardDescription>Evolução diária de mensagens enviadas, entregues e falhas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sent" name="Enviadas" stroke="#3b82f6" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="delivered"
              name="Entregues"
              stroke="#22c55e"
              strokeWidth={2}
            />
            <Line type="monotone" dataKey="failed" name="Falhas" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
