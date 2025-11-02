import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

interface FilterToggleProps {
  label: string
  description: string
  enabled: boolean
  icon: ReactNode
}

export function FilterToggle({ label, description, enabled, icon }: FilterToggleProps) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{label}</h4>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Badge variant={enabled ? "default" : "secondary"} className="flex-shrink-0">
        {enabled ? "Ativo" : "Inativo"}
      </Badge>
    </div>
  )
}
