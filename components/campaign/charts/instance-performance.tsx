/**
 * Instance Performance Chart
 *
 * Gráfico de barras mostrando performance por instância.
 *
 * @module components/campaign/charts/instance-performance
 */

"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Instance Performance Chart
 *
 * Gráfico de barras mostrando performance por instância.
 *
 * @module components/campaign/charts/instance-performance
 */

/**
 * Instance Performance Chart
 *
 * Gráfico de barras mostrando performance por instância.
 *
 * @module components/campaign/charts/instance-performance
 */

// ============================================================================
// TYPES
// ============================================================================

interface InstanceData {
  instance: string
  sent: number
  delivered: number
  rate: number
}

interface InstancePerformanceProps {
  data: InstanceData[]
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InstancePerformance({ data }: InstancePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance por Instância</CardTitle>
        <CardDescription>
          Comparação de mensagens enviadas e entregues por instância
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="instance" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" name="Enviadas" fill="#3b82f6" />
            <Bar dataKey="delivered" name="Entregues" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.instance} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.instance}</span>
              <span className="font-medium">{item.rate}% taxa de entrega</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
