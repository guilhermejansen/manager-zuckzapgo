/**
 * Status Distribution Chart
 *
 * Gráfico de pizza mostrando distribuição de status das mensagens.
 *
 * @module components/campaign/charts/status-distribution
 */

"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Status Distribution Chart
 *
 * Gráfico de pizza mostrando distribuição de status das mensagens.
 *
 * @module components/campaign/charts/status-distribution
 */

/**
 * Status Distribution Chart
 *
 * Gráfico de pizza mostrando distribuição de status das mensagens.
 *
 * @module components/campaign/charts/status-distribution
 */

/**
 * Status Distribution Chart
 *
 * Gráfico de pizza mostrando distribuição de status das mensagens.
 *
 * @module components/campaign/charts/status-distribution
 */

/**
 * Status Distribution Chart
 *
 * Gráfico de pizza mostrando distribuição de status das mensagens.
 *
 * @module components/campaign/charts/status-distribution
 */

// ============================================================================
// TYPES
// ============================================================================

interface StatusData {
  name: string
  value: number
  fill: string
  [key: string]: any
}

interface StatusDistributionProps {
  data: StatusData[]
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StatusDistribution({ data }: StatusDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Status</CardTitle>
        <CardDescription>Proporção de mensagens entregues vs falhas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Total: {total.toLocaleString()} mensagens
        </div>
      </CardContent>
    </Card>
  )
}
