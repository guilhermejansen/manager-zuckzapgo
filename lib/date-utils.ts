/**
 * Date Utility Functions
 * Safe date handling to prevent "Invalid time value" errors
 */

/**
 * Validates if a date string can be safely converted to Date object
 * @param dateStr - Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(dateStr: string | undefined | null): boolean {
  if (!dateStr) return false
  if (dateStr === "0001-01-01T00:00:00Z") return false // Go zero time value
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

/**
 * Safely creates a Date object, returning null if invalid
 * @param dateStr - Date string to convert
 * @returns Date object or null
 */
export function safeDate(dateStr: string | undefined | null): Date | null {
  if (!isValidDate(dateStr)) return null
  return new Date(dateStr!)
}

/**
 * Safely formats a date string, returning fallback if invalid
 * @param dateStr - Date string to format
 * @param fallback - Fallback value if invalid (default: "-")
 * @returns Formatted date or fallback
 */
export function safeDateFormat(
  dateStr: string | undefined | null,
  formatter: (date: Date) => string,
  fallback: string = "-"
): string {
  const date = safeDate(dateStr)
  if (!date) return fallback
  return formatter(date)
}
