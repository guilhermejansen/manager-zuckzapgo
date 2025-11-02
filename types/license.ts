/**
 * License Information Types
 *
 * Types for the /license/info endpoint response
 */

export interface LicenseInfoResponse {
  valid: boolean
  installation_id: string
  customer_id: string
  installation_name: string
  plan_type: string
  expires_at: string
  max_instances: number
  license_key: string
  instance_id: string
  last_validation: string
  days_until_expiry: number
  is_in_grace_period: boolean
  grace_period_end?: string
  status: "active" | "expiring_soon" | "expired" | "grace_period"
  status_message: string
  features: string[]
  support_email: string
  documentation_url: string
}

export interface LicenseError {
  error: string
  message: string
  code?: number
}
