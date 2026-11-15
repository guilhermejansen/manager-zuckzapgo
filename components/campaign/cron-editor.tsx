/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import cronParser from "cron-parser"
import cronstrue from "cronstrue/i18n"
import { Clock, Info } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { logger } from "@/lib/logger"

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

/**
 * Cron Editor Component
 *
 * Editor visual para expressões cron.
 * Permite criar expressões cron de forma intuitiva.
 *
 * @module components/campaign/cron-editor
 */

// ============================================================================
// TYPES
// ============================================================================

type CronMode = "simple" | "advanced"
type SimpleInterval = "minute" | "hourly" | "daily" | "weekly" | "monthly" | "custom"

interface CronEditorProps {
  value?: string
  onChange?: (cronExpression: string) => void
  disabled?: boolean
}

interface SimpleCronState {
  interval: SimpleInterval
  minute?: number // 0-59
  hour?: number // 0-23
  dayOfMonth?: number // 1-31
  month?: number // 1-12
  dayOfWeek?: number[] // 0-6 (0 = Sunday)
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converte estado simples para expressão cron
 */
function simpleToCron(state: SimpleCronState): string {
  const { interval, minute = 0, hour = 0, dayOfMonth = 1, month = 1, dayOfWeek = [] } = state

  switch (interval) {
    case "minute":
      return "* * * * *" // Every minute
    case "hourly":
      return `${minute} * * * *` // Every hour at specified minute
    case "daily":
      return `${minute} ${hour} * * *` // Every day at specified time
    case "weekly":
      if (dayOfWeek.length === 0) {
        return `${minute} ${hour} * * 0` // Every Sunday
      }
      return `${minute} ${hour} * * ${dayOfWeek.join(",")}` // Specific days of week
    case "monthly":
      return `${minute} ${hour} ${dayOfMonth} * *` // Specific day of month
    default:
      return "0 0 * * *" // Default: midnight daily
  }
}

/**
 * Tenta converter expressão cron para estado simples
 */
function cronToSimple(cron: string): SimpleCronState | null {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return null

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  // Every minute
  if (cron === "* * * * *") {
    return { interval: "minute" }
  }

  // Hourly
  if (hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return {
      interval: "hourly",
      minute: minute === "*" ? 0 : parseInt(minute),
    }
  }

  // Daily
  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return {
      interval: "daily",
      minute: parseInt(minute),
      hour: parseInt(hour),
    }
  }

  // Weekly
  if (dayOfMonth === "*" && month === "*" && dayOfWeek !== "*") {
    return {
      interval: "weekly",
      minute: parseInt(minute),
      hour: parseInt(hour),
      dayOfWeek: dayOfWeek.split(",").map((d) => parseInt(d)),
    }
  }

  // Monthly
  if (month === "*" && dayOfWeek === "*" && dayOfMonth !== "*") {
    return {
      interval: "monthly",
      minute: parseInt(minute),
      hour: parseInt(hour),
      dayOfMonth: parseInt(dayOfMonth),
    }
  }

  return null
}

/**
 * Valida expressão cron
 */
function validateCron(cron: string): { valid: boolean; error?: string } {
  try {
    cronParser.parse(cron)
    return { valid: true }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}

/**
 * Converte expressão cron para texto legível
 */
function cronToText(cron: string): string {
  try {
    return cronstrue.toString(cron, { locale: "pt_BR", use24HourTimeFormat: true })
  } catch {
    return "Expressão cron inválida"
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CronEditor({ value = "0 0 * * *", onChange, disabled = false }: CronEditorProps) {
  const [mode, setMode] = useState<CronMode>("simple")
  const [cronExpression, setCronExpression] = useState(value)
  const [simpleState, setSimpleState] = useState<SimpleCronState>(() => {
    const parsed = cronToSimple(value)
    return parsed || { interval: "daily", minute: 0, hour: 0 }
  })
  const cronText = useMemo(() => cronToText(cronExpression), [cronExpression])
  const validation = useMemo(() => validateCron(cronExpression), [cronExpression])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Only logging is a side effect; display text and validity are derived above.
  useEffect(() => {
    if (validation.valid) {
      logger.debug("Cron: Expression updated", null, {
        component: "CronEditor",
        action: "updateExpression",
        metadata: { expression: cronExpression, text: cronText },
      })
    }
  }, [cronExpression, cronText, validation.valid])

  // Notify parent of changes
  useEffect(() => {
    if (validation.valid && onChange) {
      onChange(cronExpression)
    }
  }, [cronExpression, validation.valid, onChange])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSimpleChange = useCallback((newState: SimpleCronState) => {
    setSimpleState(newState)
    const cron = simpleToCron(newState)
    setCronExpression(cron)
  }, [])

  const handleAdvancedChange = useCallback((value: string) => {
    setCronExpression(value)
    const parsed = cronToSimple(value)
    if (parsed) {
      setSimpleState(parsed)
    }
  }, [])

  const toggleDayOfWeek = useCallback(
    (day: number) => {
      const current = simpleState.dayOfWeek || []
      const newDays = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]

      handleSimpleChange({
        ...simpleState,
        dayOfWeek: newDays.sort(),
      })
    },
    [simpleState, handleSimpleChange]
  )

  // ============================================================================
  // RENDER
  // ============================================================================

  const weekDays = [
    { label: "Dom", value: 0 },
    { label: "Seg", value: 1 },
    { label: "Ter", value: 2 },
    { label: "Qua", value: 3 },
    { label: "Qui", value: 4 },
    { label: "Sex", value: 5 },
    { label: "Sáb", value: 6 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Editor de Agendamento
        </CardTitle>
        <CardDescription>Configure quando a campanha deve ser executada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <Badge
            variant={mode === "simple" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => !disabled && setMode("simple")}
          >
            Simples
          </Badge>
          <Badge
            variant={mode === "advanced" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => !disabled && setMode("advanced")}
          >
            Avançado
          </Badge>
        </div>

        {/* Simple Mode */}
        {mode === "simple" && (
          <div className="space-y-4">
            <div>
              <Label>Intervalo</Label>
              <Select
                value={simpleState.interval}
                onValueChange={(value: SimpleInterval) =>
                  handleSimpleChange({ ...simpleState, interval: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minute">A cada minuto</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hourly options */}
            {simpleState.interval === "hourly" && (
              <div>
                <Label>Minuto</Label>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={simpleState.minute || 0}
                  onChange={(e) =>
                    handleSimpleChange({
                      ...simpleState,
                      minute: parseInt(e.target.value),
                    })
                  }
                  disabled={disabled}
                />
              </div>
            )}

            {/* Daily options */}
            {simpleState.interval === "daily" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={simpleState.hour || 0}
                    onChange={(e) =>
                      handleSimpleChange({
                        ...simpleState,
                        hour: parseInt(e.target.value),
                      })
                    }
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Label>Minuto</Label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={simpleState.minute || 0}
                    onChange={(e) =>
                      handleSimpleChange({
                        ...simpleState,
                        minute: parseInt(e.target.value),
                      })
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            )}

            {/* Weekly options */}
            {simpleState.interval === "weekly" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hora</Label>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={simpleState.hour || 0}
                      onChange={(e) =>
                        handleSimpleChange({
                          ...simpleState,
                          hour: parseInt(e.target.value),
                        })
                      }
                      disabled={disabled}
                    />
                  </div>
                  <div>
                    <Label>Minuto</Label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={simpleState.minute || 0}
                      onChange={(e) =>
                        handleSimpleChange({
                          ...simpleState,
                          minute: parseInt(e.target.value),
                        })
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div>
                  <Label>Dias da semana</Label>
                  <div className="flex gap-2 mt-2">
                    {weekDays.map((day) => (
                      <div key={day.value} className="flex items-center gap-2">
                        <Checkbox
                          checked={(simpleState.dayOfWeek || []).includes(day.value)}
                          onCheckedChange={() => toggleDayOfWeek(day.value)}
                          disabled={disabled}
                        />
                        <Label className="cursor-pointer text-sm">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Monthly options */}
            {simpleState.interval === "monthly" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Dia do mês</Label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={simpleState.dayOfMonth || 1}
                    onChange={(e) =>
                      handleSimpleChange({
                        ...simpleState,
                        dayOfMonth: parseInt(e.target.value),
                      })
                    }
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={simpleState.hour || 0}
                    onChange={(e) =>
                      handleSimpleChange({
                        ...simpleState,
                        hour: parseInt(e.target.value),
                      })
                    }
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Label>Minuto</Label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={simpleState.minute || 0}
                    onChange={(e) =>
                      handleSimpleChange({
                        ...simpleState,
                        minute: parseInt(e.target.value),
                      })
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Mode */}
        {mode === "advanced" && (
          <div>
            <Label>Expressão Cron</Label>
            <Input
              value={cronExpression}
              onChange={(e) => handleAdvancedChange(e.target.value)}
              disabled={disabled}
              placeholder="* * * * *"
              className={!validation.valid ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formato: minuto hora dia-do-mês mês dia-da-semana
            </p>
          </div>
        )}

        {/* Cron expression display */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Agendamento:</strong> {cronText}
            <br />
            <span className="text-xs text-muted-foreground font-mono">{cronExpression}</span>
          </AlertDescription>
        </Alert>

        {/* Validation error */}
        {!validation.valid && (
          <Alert variant="destructive">
            <AlertDescription>{validation.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
