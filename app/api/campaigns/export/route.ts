/**
 * Campaign Export API Route
 *
 * API endpoint para exportação de dados de campanhas.
 * Suporta múltiplos formatos e filtros.
 *
 * @module app/api/campaigns/export/route
 */
import { NextRequest, NextResponse } from "next/server"

import Papa from "papaparse"
import * as XLSX from "xlsx"

import { logger } from "@/lib/logger"

// ============================================================================
// TYPES
// ============================================================================

type ExportFormat = "csv" | "excel" | "json"

interface ExportParams {
  format: ExportFormat
  filters?: {
    dateFrom?: string
    dateTo?: string
    status?: string
    instanceId?: string
    campaignId?: string
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Busca dados de campanhas com filtros
 */
async function fetchCampaignData(filters?: ExportParams["filters"]) {
  // TODO: Implement real database query with filters
  // For now, return mock data

  const mockData = [
    {
      id: "1",
      name: "Black Friday 2025",
      status: "completed",
      instance: "Instance 1",
      sent: 15000,
      delivered: 14250,
      failed: 750,
      rate: 95.0,
      createdAt: "2025-10-25T10:00:00Z",
    },
    {
      id: "2",
      name: "Newsletter Semanal",
      status: "active",
      instance: "Instance 2",
      sent: 8500,
      delivered: 8075,
      failed: 425,
      rate: 95.0,
      createdAt: "2025-10-28T09:00:00Z",
    },
    {
      id: "3",
      name: "Promoção Verão",
      status: "completed",
      instance: "Instance 3",
      sent: 12000,
      delivered: 11400,
      failed: 600,
      rate: 95.0,
      createdAt: "2025-10-20T14:00:00Z",
    },
  ]

  logger.debug("Export: Fetched campaign data", null, {
    component: "ExportAPI",
    action: "fetchCampaignData",
    metadata: { count: mockData.length, filters },
  })

  return mockData
}

/**
 * Converte dados para CSV
 */
function convertToCSV(data: any[]): string {
  return Papa.unparse(data)
}

/**
 * Converte dados para Excel buffer
 */
function convertToExcel(data: any[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns")

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
  return buffer
}

// ============================================================================
// GET HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = (searchParams.get("format") as ExportFormat) || "json"

    // Parse filters from query params
    const filters = {
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      status: searchParams.get("status") || undefined,
      instanceId: searchParams.get("instanceId") || undefined,
      campaignId: searchParams.get("campaignId") || undefined,
    }

    // Fetch data
    const data = await fetchCampaignData(filters)

    logger.info("Export: Processing export request", null, {
      component: "ExportAPI",
      action: "GET",
      metadata: { format, recordCount: data.length },
    })

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `campaign-export-${timestamp}`

    // Return appropriate format
    switch (format) {
      case "csv": {
        const csv = convertToCSV(data)
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}.csv"`,
          },
        })
      }

      case "excel": {
        const excel = convertToExcel(data)
        return new NextResponse(excel as any, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
          },
        })
      }

      case "json":
      default: {
        return NextResponse.json(data, {
          headers: {
            "Content-Disposition": `attachment; filename="${filename}.json"`,
          },
        })
      }
    }
  } catch (error: any) {
    logger.error("Export: Failed to export data", error, {
      component: "ExportAPI",
      action: "GET",
    })

    return NextResponse.json(
      { error: "Failed to export data", details: error.message },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST HANDLER (for complex filters)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExportParams

    // Fetch data with filters
    const data = await fetchCampaignData(body.filters)

    logger.info("Export: Processing POST export request", null, {
      component: "ExportAPI",
      action: "POST",
      metadata: { format: body.format, recordCount: data.length },
    })

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `campaign-export-${timestamp}`

    // Return appropriate format
    switch (body.format) {
      case "csv": {
        const csv = convertToCSV(data)
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}.csv"`,
          },
        })
      }

      case "excel": {
        const excel = convertToExcel(data)
        return new NextResponse(excel as any, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
          },
        })
      }

      case "json":
      default: {
        return NextResponse.json(data, {
          headers: {
            "Content-Disposition": `attachment; filename="${filename}.json"`,
          },
        })
      }
    }
  } catch (error: any) {
    logger.error("Export: Failed to export data", error, {
      component: "ExportAPI",
      action: "POST",
    })

    return NextResponse.json(
      { error: "Failed to export data", details: error.message },
      { status: 500 }
    )
  }
}
