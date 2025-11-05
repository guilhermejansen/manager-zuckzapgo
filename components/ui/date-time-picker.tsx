"use client"

import * as React from "react"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DateTimePicker({
  date,
  setDate,
  disabled = false,
  placeholder = "Selecione data e hora",
  className,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? format(date, "HH:mm") : "09:00"
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setSelectedDateTime(undefined)
      setDate(undefined)
      return
    }

    // Preservar o horário já selecionado
    const [hours, minutes] = timeValue.split(":").map(Number)
    const newDateTime = new Date(selectedDate)
    newDateTime.setHours(hours, minutes, 0, 0)

    setSelectedDateTime(newDateTime)
    setDate(newDateTime)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)

    if (!selectedDateTime) return

    const [hours, minutes] = newTime.split(":").map(Number)
    const newDateTime = new Date(selectedDateTime)
    newDateTime.setHours(hours, minutes, 0, 0)

    setSelectedDateTime(newDateTime)
    setDate(newDateTime)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDateTime && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateTime ? (
              format(selectedDateTime, "PPP", { locale: ptBR })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="time" className="sr-only">
          Horário
        </Label>
        <Input
          id="time"
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled || !selectedDateTime}
          className="w-full"
        />
      </div>

      {selectedDateTime && (
        <p className="text-xs text-muted-foreground">
          {format(selectedDateTime, "PPPp", { locale: ptBR })}
        </p>
      )}
    </div>
  )
}
