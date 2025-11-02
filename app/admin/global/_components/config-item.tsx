import type { ReactNode } from "react"
import { useState } from "react"

import { Check, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfigItemProps {
  label: string
  value: string | number | boolean | ReactNode
  copyable?: boolean
  sensitive?: boolean
  badge?: "default" | "destructive" | "secondary" | "outline"
  className?: string
}

export function ConfigItem({
  label,
  value,
  copyable = false,
  sensitive = false,
  badge,
  className,
}: ConfigItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (sensitive) return

    const textValue = typeof value === "boolean" ? String(value) : String(value)
    await navigator.clipboard.writeText(textValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayValue = sensitive ? "***REDACTED***" : value
  const isReactNode = typeof value === "object" && value !== null && "type" in value

  return (
    <div className={cn("flex items-center justify-between py-2 gap-4", className)}>
      <span className="text-sm font-medium text-muted-foreground break-words">{label}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {badge && !isReactNode ? (
          <Badge variant={badge}>{String(displayValue)}</Badge>
        ) : isReactNode ? (
          value
        ) : (
          <span className="text-sm break-all text-right">{String(displayValue)}</span>
        )}
        {copyable && !sensitive && (
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => void handleCopy()}>
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        )}
      </div>
    </div>
  )
}
