import type { ArchiveEvent } from "@/types"

const ARCHIVE_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function parseArchiveDate(input?: string | null): Date | null {
  if (!input) return null

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export function resolveArchivedAt(event: ArchiveEvent): Date | null {
  return (
    parseArchiveDate(event.archived_at) ||
    parseArchiveDate(event.delivered_at) ||
    parseArchiveDate(event.created_at)
  )
}

export function formatArchiveEventDate(event: ArchiveEvent): string {
  const date = resolveArchivedAt(event)
  return date ? ARCHIVE_DATE_FORMATTER.format(date) : "—"
}

export function formatArchiveDateString(dateString?: string | null): string {
  const date = parseArchiveDate(dateString)
  return date ? ARCHIVE_DATE_FORMATTER.format(date) : "—"
}
