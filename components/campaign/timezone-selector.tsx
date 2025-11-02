/**
 * Timezone Selector Component
 *
 * Seletor de fuso horário com busca e preview.
 * Usa date-fns-tz para manipulação de timezones.
 *
 * @module components/campaign/timezone-selector
 */

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { format } from "date-fns"
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz"
import { ptBR } from "date-fns/locale"
import { Clock, Globe, Info, Search } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { logger } from "@/lib/logger"

/**
 * Timezone Selector Component
 *
 * Seletor de fuso horário com busca e preview.
 * Usa date-fns-tz para manipulação de timezones.
 *
 * @module components/campaign/timezone-selector
 */

/**
 * Timezone Selector Component
 *
 * Seletor de fuso horário com busca e preview.
 * Usa date-fns-tz para manipulação de timezones.
 *
 * @module components/campaign/timezone-selector
 */

// ============================================================================
// TYPES
// ============================================================================

interface TimezoneSelectorProps {
  value?: string
  onChange?: (timezone: string) => void
  disabled?: boolean
  showPreview?: boolean
}

interface TimezoneInfo {
  value: string
  label: string
  offset: string
  region: string
}

// ============================================================================
// TIMEZONE DATA
// ============================================================================

const TIMEZONE_REGIONS = {
  americas: "Américas",
  europe: "Europa",
  asia: "Ásia",
  africa: "África",
  oceania: "Oceania",
  atlantic: "Atlântico",
  pacific: "Pacífico",
  indian: "Índico",
} as const

/**
 * Lista de timezones mais comuns do Brasil e do mundo
 */
const COMMON_TIMEZONES: TimezoneInfo[] = [
  // Brasil
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)", offset: "", region: "americas" },
  { value: "America/Manaus", label: "Manaus (AMT)", offset: "", region: "americas" },
  { value: "America/Recife", label: "Recife (BRT)", offset: "", region: "americas" },
  { value: "America/Fortaleza", label: "Fortaleza (BRT)", offset: "", region: "americas" },
  { value: "America/Belem", label: "Belém (BRT)", offset: "", region: "americas" },
  { value: "America/Maceio", label: "Maceió (BRT)", offset: "", region: "americas" },
  { value: "America/Bahia", label: "Salvador (BRT)", offset: "", region: "americas" },
  { value: "America/Cuiaba", label: "Cuiabá (AMT)", offset: "", region: "americas" },
  { value: "America/Porto_Velho", label: "Porto Velho (AMT)", offset: "", region: "americas" },
  { value: "America/Boa_Vista", label: "Boa Vista (AMT)", offset: "", region: "americas" },
  { value: "America/Rio_Branco", label: "Rio Branco (ACT)", offset: "", region: "americas" },
  { value: "America/Noronha", label: "Fernando de Noronha (FNT)", offset: "", region: "americas" },

  // Américas
  { value: "America/New_York", label: "Nova York (EST)", offset: "", region: "americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)", offset: "", region: "americas" },
  { value: "America/Chicago", label: "Chicago (CST)", offset: "", region: "americas" },
  { value: "America/Denver", label: "Denver (MST)", offset: "", region: "americas" },
  { value: "America/Mexico_City", label: "Cidade do México", offset: "", region: "americas" },
  { value: "America/Buenos_Aires", label: "Buenos Aires", offset: "", region: "americas" },
  { value: "America/Santiago", label: "Santiago", offset: "", region: "americas" },
  { value: "America/Bogota", label: "Bogotá", offset: "", region: "americas" },
  { value: "America/Lima", label: "Lima", offset: "", region: "americas" },
  { value: "America/Caracas", label: "Caracas", offset: "", region: "americas" },

  // Europa
  { value: "Europe/London", label: "Londres (GMT)", offset: "", region: "europe" },
  { value: "Europe/Paris", label: "Paris (CET)", offset: "", region: "europe" },
  { value: "Europe/Berlin", label: "Berlim (CET)", offset: "", region: "europe" },
  { value: "Europe/Madrid", label: "Madri (CET)", offset: "", region: "europe" },
  { value: "Europe/Rome", label: "Roma (CET)", offset: "", region: "europe" },
  { value: "Europe/Lisbon", label: "Lisboa (WET)", offset: "", region: "europe" },
  { value: "Europe/Amsterdam", label: "Amsterdã (CET)", offset: "", region: "europe" },
  { value: "Europe/Brussels", label: "Bruxelas (CET)", offset: "", region: "europe" },
  { value: "Europe/Vienna", label: "Viena (CET)", offset: "", region: "europe" },
  { value: "Europe/Stockholm", label: "Estocolmo (CET)", offset: "", region: "europe" },
  { value: "Europe/Moscow", label: "Moscou (MSK)", offset: "", region: "europe" },

  // Ásia
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "", region: "asia" },
  { value: "Asia/Shanghai", label: "Xangai (CST)", offset: "", region: "asia" },
  { value: "Asia/Tokyo", label: "Tóquio (JST)", offset: "", region: "asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", offset: "", region: "asia" },
  { value: "Asia/Singapore", label: "Singapura (SGT)", offset: "", region: "asia" },
  { value: "Asia/Seoul", label: "Seul (KST)", offset: "", region: "asia" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", offset: "", region: "asia" },
  { value: "Asia/Kolkata", label: "Kolkata (IST)", offset: "", region: "asia" },
  { value: "Asia/Jakarta", label: "Jacarta (WIB)", offset: "", region: "asia" },

  // África
  { value: "Africa/Cairo", label: "Cairo (EET)", offset: "", region: "africa" },
  { value: "Africa/Johannesburg", label: "Joanesburgo (SAST)", offset: "", region: "africa" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "", region: "africa" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT)", offset: "", region: "africa" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney (AEDT)", offset: "", region: "oceania" },
  { value: "Australia/Melbourne", label: "Melbourne (AEDT)", offset: "", region: "oceania" },
  { value: "Australia/Brisbane", label: "Brisbane (AEST)", offset: "", region: "oceania" },
  { value: "Australia/Perth", label: "Perth (AWST)", offset: "", region: "oceania" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT)", offset: "", region: "oceania" },

  // Pacífico
  { value: "Pacific/Honolulu", label: "Honolulu (HST)", offset: "", region: "pacific" },
  { value: "Pacific/Fiji", label: "Fiji (FJT)", offset: "", region: "pacific" },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calcula offset do timezone em relação ao UTC
 */
function calculateOffset(timezone: string): string {
  try {
    const offsetMinutes = getTimezoneOffset(timezone)
    const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    const minutes = Math.abs(offsetMinutes) % 60
    const sign = offsetMinutes >= 0 ? "+" : "-"

    if (minutes === 0) {
      return `UTC${sign}${hours}`
    }
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`
  } catch {
    return "UTC"
  }
}

/**
 * Obtém horário atual no timezone especificado
 */
function getCurrentTimeInTimezone(timezone: string): string {
  try {
    return formatInTimeZone(new Date(), timezone, "HH:mm:ss", { locale: ptBR })
  } catch {
    return "--:--:--"
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TimezoneSelector({
  value = "America/Sao_Paulo",
  onChange,
  disabled = false,
  showPreview = true,
}: TimezoneSelectorProps) {
  const [selectedTimezone, setSelectedTimezone] = useState(value)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState("")

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  // Add offsets to timezone data
  const timezonesWithOffsets = useMemo(() => {
    return COMMON_TIMEZONES.map((tz) => ({
      ...tz,
      offset: calculateOffset(tz.value),
    }))
  }, [])

  // Filter timezones by search
  const filteredTimezones = useMemo(() => {
    if (!searchTerm) return timezonesWithOffsets

    const search = searchTerm.toLowerCase()
    return timezonesWithOffsets.filter(
      (tz) =>
        tz.label.toLowerCase().includes(search) ||
        tz.value.toLowerCase().includes(search) ||
        tz.offset.toLowerCase().includes(search)
    )
  }, [timezonesWithOffsets, searchTerm])

  // Group timezones by region
  const groupedTimezones = useMemo(() => {
    const groups: Record<string, TimezoneInfo[]> = {}

    filteredTimezones.forEach((tz) => {
      if (!groups[tz.region]) {
        groups[tz.region] = []
      }
      groups[tz.region].push(tz)
    })

    return groups
  }, [filteredTimezones])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeInTimezone(selectedTimezone))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [selectedTimezone])

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedTimezone)
    }

    logger.debug("Timezone: Selected", null, {
      component: "TimezoneSelector",
      action: "selectTimezone",
      metadata: { timezone: selectedTimezone },
    })
  }, [selectedTimezone, onChange])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleTimezoneChange = useCallback((timezone: string) => {
    setSelectedTimezone(timezone)
  }, [])

  // ============================================================================
  // RENDER
  // ============================================================================

  const selectedTimezoneInfo = timezonesWithOffsets.find((tz) => tz.value === selectedTimezone)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Fuso Horário
        </CardTitle>
        <CardDescription>Selecione o fuso horário para execução da campanha</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Timezone</Label>
          <Select value={selectedTimezone} onValueChange={handleTimezoneChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar timezone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              {Object.entries(groupedTimezones).map(([region, timezones]) => (
                <SelectGroup key={region}>
                  <SelectLabel>
                    {TIMEZONE_REGIONS[region as keyof typeof TIMEZONE_REGIONS]}
                  </SelectLabel>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showPreview && selectedTimezoneInfo && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Horário atual:</strong> {currentTime}
                </div>
                <Badge variant="secondary">{selectedTimezoneInfo.offset}</Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            A campanha será executada de acordo com o fuso horário selecionado. Certifique-se de
            escolher o timezone correto para garantir que as mensagens sejam enviadas no horário
            desejado.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
