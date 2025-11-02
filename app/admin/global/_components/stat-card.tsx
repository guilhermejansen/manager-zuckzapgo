import type { ReactNode } from "react"

import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  variant?: "default" | "success" | "destructive" | "warning"
  icon?: ReactNode
  description?: string
  truncate?: boolean
}

export function StatCard({
  title,
  value,
  trend,
  variant = "default",
  icon,
  description,
  truncate = false,
}: StatCardProps) {
  const variantStyles = {
    default: "",
    success: "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
    destructive: "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
    warning: "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20",
  }

  return (
    <Card className={cn("w-full", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div
          className={cn("text-2xl font-bold", truncate && "truncate")}
          title={truncate ? String(value) : undefined}
        >
          {value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
            <span
              className={cn("text-xs", {
                "text-green-500": trend === "up",
                "text-red-500": trend === "down",
                "text-muted-foreground": trend === "neutral",
              })}
            >
              {trend === "up" && "Crescendo"}
              {trend === "down" && "Decrescendo"}
              {trend === "neutral" && "Estável"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
