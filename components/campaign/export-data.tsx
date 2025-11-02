/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

"use client"

import { useCallback, useState } from "react"

import { Download, FileJson, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import Papa from "papaparse"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logger } from "@/lib/logger"

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

/**
 * Export Data Component
 *
 * Componente para exportação de dados em múltiplos formatos.
 * Suporta CSV, Excel e JSON.
 *
 * @module components/campaign/export-data
 */

// ============================================================================
// TYPES
// ============================================================================

type ExportFormat = "csv" | "excel" | "json"

interface ExportDataProps {
  data: any
  filename?: string
  formats?: ExportFormat[]
  disabled?: boolean
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converte dados para CSV e faz download
 */
function exportToCSV(data: any, filename: string) {
  try {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    logger.success("Export: CSV file downloaded", null, {
      component: "ExportData",
      action: "exportToCSV",
      metadata: { filename },
    })

    toast.success("Arquivo CSV exportado com sucesso")
  } catch (error: any) {
    logger.error("Export: Failed to export CSV", error, {
      component: "ExportData",
      action: "exportToCSV",
    })

    toast.error("Erro ao exportar arquivo CSV")
  }
}

/**
 * Converte dados para Excel e faz download
 */
function exportToExcel(data: any, filename: string) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

    XLSX.writeFile(workbook, `${filename}.xlsx`)

    logger.success("Export: Excel file downloaded", null, {
      component: "ExportData",
      action: "exportToExcel",
      metadata: { filename },
    })

    toast.success("Arquivo Excel exportado com sucesso")
  } catch (error: any) {
    logger.error("Export: Failed to export Excel", error, {
      component: "ExportData",
      action: "exportToExcel",
    })

    toast.error("Erro ao exportar arquivo Excel")
  }
}

/**
 * Converte dados para JSON e faz download
 */
function exportToJSON(data: any, filename: string) {
  try {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    logger.success("Export: JSON file downloaded", null, {
      component: "ExportData",
      action: "exportToJSON",
      metadata: { filename },
    })

    toast.success("Arquivo JSON exportado com sucesso")
  } catch (error: any) {
    logger.error("Export: Failed to export JSON", error, {
      component: "ExportData",
      action: "exportToJSON",
    })

    toast.error("Erro ao exportar arquivo JSON")
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ExportData({
  data,
  filename = "export",
  formats = ["csv", "excel", "json"],
  disabled = false,
}: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsExporting(true)

      try {
        // Add timestamp to filename
        const timestampedFilename = `${filename}-${new Date().toISOString().split("T")[0]}`

        switch (format) {
          case "csv":
            exportToCSV(data, timestampedFilename)
            break
          case "excel":
            exportToExcel(data, timestampedFilename)
            break
          case "json":
            exportToJSON(data, timestampedFilename)
            break
        }
      } catch (error: any) {
        logger.error("Export: Failed to export data", error, {
          component: "ExportData",
          action: "handleExport",
        })

        toast.error("Erro ao exportar dados")
      } finally {
        setIsExporting(false)
      }
    },
    [data, filename]
  )

  // ============================================================================
  // RENDER
  // ============================================================================

  const formatIcons = {
    csv: <FileText className="h-4 w-4 mr-2" />,
    excel: <FileSpreadsheet className="h-4 w-4 mr-2" />,
    json: <FileJson className="h-4 w-4 mr-2" />,
  }

  const formatLabels = {
    csv: "Exportar como CSV",
    excel: "Exportar como Excel",
    json: "Exportar como JSON",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((format) => (
          <DropdownMenuItem key={format} onClick={() => handleExport(format)}>
            {formatIcons[format]}
            {formatLabels[format]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
