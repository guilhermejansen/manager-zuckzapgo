/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  AlertCircle,
  CheckCircle,
  Download,
  Link2,
  Megaphone,
  RefreshCw,
  UserRound,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { importContactsAction } from "@/app/actions/contacts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi, apiClient } from "@/lib/api"
import { logger } from "@/lib/logger"
import type { ApiResponse, User } from "@/types"

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

/**
 * Import API Dialog Component
 *
 * Permite importar contatos da API oficial (contatos, participantes de grupos e newsletters).
 * Integra com os endpoints:
 * - GET /user/contacts
 * - GET /group/list
 * - GET /newsletter/list
 */

// ============================================================================
// TYPES
// ============================================================================

type DatasetType = "contacts" | "groups" | "newsletters"
type GroupImportMode = "participants" | "groups"

interface ImportApiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ContactsApiInfo {
  Found?: boolean
  FirstName?: string
  FullName?: string
  PushName?: string
  BusinessName?: string
  RedactedPhone?: string
  [key: string]: unknown
}

type ContactsApiResponse = Record<string, ContactsApiInfo>

interface ApiGroupParticipant {
  DisplayName?: string
  Error?: number
  IsAdmin?: boolean
  IsSuperAdmin?: boolean
  JID?: string
  LID?: string
  PhoneNumber?: string
  [key: string]: unknown
}

interface ApiGroup {
  JID: string
  Name?: string
  Participants?: ApiGroupParticipant[] | null
  AddressingMode?: string
  OwnerJID?: string
  OwnerPN?: string
  IsParent?: boolean
  IsAnnounce?: boolean
  Topic?: string
  [key: string]: unknown
}

interface ApiNewsletter {
  id: string
  state?: { type?: string }
  thread_metadata?: {
    name?: { text?: string }
    description?: { text?: string }
    invite?: string
    verification?: string
    subscribers_count?: string
  }
  viewer_metadata?: {
    role?: string
    mute?: string
  }
  [key: string]: unknown
}

interface ApiContact {
  jid: string
  name?: string
  pushName?: string
  businessName?: string
  firstName?: string
  fullName?: string
  redactedPhone?: string
  phone?: string
  lid?: string
  found?: boolean
  instanceId: string
  instanceName: string
  instanceJid: string
  source: "USER_CONTACTS_API" | "GROUP_PARTICIPANTS_API" | "GROUPS_API" | "NEWSLETTER_API"
  category: "CONTACT" | "GROUP_PARTICIPANT" | "GROUP" | "NEWSLETTER"
  groupJid?: string
  groupName?: string
  groupAddressingMode?: string
  groupParticipantIsAdmin?: boolean
  groupParticipantIsSuperAdmin?: boolean
  groupParticipantPhoneNumber?: string
  groupOwnerJid?: string
  groupOwnerPhone?: string
  groupIsParent?: boolean
  groupIsAnnounce?: boolean
  groupParticipantsCount?: number
  newsletterInvite?: string
  newsletterVerification?: string
  newsletterRole?: string
  newsletterSubscribers?: number
  [key: string]: unknown
}

interface ValidationResult {
  valid: ApiContact[]
  invalid: { row: ApiContact; errors: string[] }[]
}

interface SanitizedParticipantJid {
  jid: string
  lid?: string
  domain: string
  canonicalLocal: string
}

interface FetchSummaryDetail {
  label: string
  value: number
}

interface FetchSummary {
  totalReturned: number
  uniqueContacts: number
  details?: FetchSummaryDetail[]
}

// ============================================================================
// HELPERS
// ============================================================================

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]?.[0] ?? "").concat(parts[parts.length - 1]?.[0] ?? "").toUpperCase()
}

function normalizeJid(jid: string): string {
  return jid.trim().toLowerCase()
}

function isPriorityJid(jid: string): boolean {
  return normalizeJid(jid).endsWith("@s.whatsapp.net")
}

function isObfuscated(value?: string | null): boolean {
  if (!value) return false
  return value.includes("*") || value.includes("∙") || value.includes("•") || value.includes("×")
}

function canonicalizeJidLocal(local: string): string {
  if (!local) return local
  const separators = [":", "."]
  let cutoff = local.length
  for (const sep of separators) {
    const idx = local.indexOf(sep)
    if (idx !== -1 && idx < cutoff) {
      cutoff = idx
    }
  }
  return cutoff === local.length ? local : local.slice(0, cutoff)
}

function sanitizeNormalizedJid(jid: string): {
  jid: string
  local: string
  domain: string
  canonicalLocal: string
} {
  const normalized = normalizeJid(jid)
  const [localPart = normalized, domain = ""] = normalized.split("@")

  if (!domain) {
    return {
      jid: normalized,
      local: localPart,
      domain,
      canonicalLocal: canonicalizeJidLocal(localPart),
    }
  }

  const canonicalLocal = canonicalizeJidLocal(localPart) || localPart
  return {
    jid: `${canonicalLocal}@${domain}`,
    local: localPart,
    domain,
    canonicalLocal,
  }
}

function hasNewsletterSendPermission(newsletter: ApiNewsletter): boolean {
  const role = newsletter.viewer_metadata?.role ?? ""
  return ["admin", "editor", "publisher", "owner", "super_admin"].includes(role.toLowerCase())
}

function formatParticipantName(
  participant: ApiGroupParticipant,
  fallback?: string
): string | undefined {
  if (participant.DisplayName && participant.DisplayName.trim().length > 0) {
    return participant.DisplayName.trim()
  }

  if (participant.PhoneNumber && participant.PhoneNumber.includes("@")) {
    return participant.PhoneNumber.split("@")[0]
  }

  if (participant.JID) return participant.JID.replace(/@.*/, "")
  if (participant.LID) return participant.LID.replace(/@.*/, "")

  return fallback
}

function transformUserContactsResponse(
  data: ContactsApiResponse,
  instance: Pick<User, "id" | "name" | "jid">
): { contacts: ApiContact[]; summary: FetchSummary } {
  const grouped = new Map<
    string,
    { primary?: ApiContact; fallback?: ApiContact; lidCandidate?: string }
  >()

  const entries = Object.entries(data || {})
  for (const [jid, info] of entries) {
    if (!jid || typeof jid !== "string" || !jid.includes("@")) continue

    const sanitized = sanitizeNormalizedJid(jid)
    const mapKey = sanitized.jid
    const current = grouped.get(mapKey) ?? {}

    let phone: string | undefined
    if (sanitized.domain === "s.whatsapp.net") {
      phone = sanitized.canonicalLocal
    } else if (info.RedactedPhone && !isObfuscated(info.RedactedPhone)) {
      const digits = info.RedactedPhone.replace(/\D/g, "")
      phone = digits.length > 0 ? digits : undefined
    }

    const contact: ApiContact = {
      jid: sanitized.jid,
      name: deriveDisplayName(info),
      pushName: typeof info.PushName === "string" ? info.PushName || undefined : undefined,
      businessName:
        typeof info.BusinessName === "string" ? info.BusinessName || undefined : undefined,
      firstName: typeof info.FirstName === "string" ? info.FirstName || undefined : undefined,
      fullName: typeof info.FullName === "string" ? info.FullName || undefined : undefined,
      redactedPhone:
        typeof info.RedactedPhone === "string" ? info.RedactedPhone || undefined : undefined,
      phone,
      lid: sanitized.domain === "lid" ? sanitized.jid : undefined,
      found: typeof info.Found === "boolean" ? info.Found : undefined,
      instanceId: instance.id,
      instanceName: instance.name,
      instanceJid: instance.jid,
      source: "USER_CONTACTS_API",
      category: "CONTACT",
    }

    if (sanitized.domain === "lid") {
      current.lidCandidate = sanitized.jid
    }

    if (isPriorityJid(contact.jid)) {
      current.primary = contact
    } else if (!current.primary && !current.fallback) {
      current.fallback = contact
    } else if (!current.primary) {
      current.fallback = current.fallback ?? contact
    }

    grouped.set(mapKey, current)
  }

  const contacts: ApiContact[] = []
  grouped.forEach(({ primary, fallback, lidCandidate }) => {
    const chosen = primary ?? fallback
    if (!chosen) return

    if (!chosen.lid && lidCandidate && lidCandidate !== chosen.jid) {
      chosen.lid = lidCandidate
    }

    contacts.push(chosen)
  })

  contacts.sort((a, b) => a.jid.localeCompare(b.jid))

  return {
    contacts,
    summary: {
      totalReturned: entries.length,
      uniqueContacts: contacts.length,
    },
  }
}

function deriveDisplayName(info: ContactsApiInfo): string | undefined {
  const candidates = [info.FullName, info.BusinessName, info.FirstName, info.PushName].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0
  )

  return candidates[0]?.trim()
}

function pickParticipantPreferredJid(
  participant: ApiGroupParticipant
): SanitizedParticipantJid | null {
  const candidates: string[] = []

  const phone = participant.PhoneNumber?.trim()
  if (phone && phone.includes("@") && !isObfuscated(phone)) {
    candidates.push(phone)
  }

  if (participant.JID && !isObfuscated(participant.JID)) {
    candidates.push(participant.JID)
  }

  if (participant.LID && !isObfuscated(participant.LID)) {
    candidates.push(participant.LID)
  }

  if (candidates.length === 0) {
    return null
  }

  const sanitizedCandidates = candidates.map((value) => sanitizeNormalizedJid(value))
  const preferred =
    sanitizedCandidates.find((item) => item.domain === "s.whatsapp.net") ?? sanitizedCandidates[0]

  if (!preferred) return null

  let lid: string | undefined
  if (participant.LID && !isObfuscated(participant.LID)) {
    lid = sanitizeNormalizedJid(participant.LID).jid
  } else if (preferred.domain === "lid") {
    lid = preferred.jid
  }

  return {
    jid: preferred.jid,
    lid,
    domain: preferred.domain,
    canonicalLocal: preferred.canonicalLocal,
  }
}

function transformGroupParticipants(
  groups: ApiGroup[],
  selectedGroupIds: string[],
  instance: Pick<User, "id" | "name" | "jid">
): { contacts: ApiContact[]; summary: FetchSummary } {
  const map = new Map<string, ApiContact>()
  let processed = 0
  let selectedGroupsCount = 0
  let skippedObfuscated = 0

  const selectedGroups = groups.filter((group) => selectedGroupIds.includes(group.JID))

  for (const group of selectedGroups) {
    selectedGroupsCount++
    const participants = group.Participants ?? []
    const sanitizedGroup = sanitizeNormalizedJid(group.JID)

    for (const participant of participants) {
      const preferred = pickParticipantPreferredJid(participant)
      if (!preferred) {
        skippedObfuscated++
        continue
      }

      const mapKey = preferred.jid

      if (!mapKey || map.has(mapKey)) continue

      const derivedPhone =
        preferred.domain === "s.whatsapp.net" ? preferred.canonicalLocal : undefined
      const participantPhone =
        preferred.domain === "s.whatsapp.net"
          ? preferred.canonicalLocal
          : participant.PhoneNumber || undefined
      const lid = preferred.lid ?? (preferred.domain === "lid" ? preferred.jid : undefined)

      const contact: ApiContact = {
        jid: mapKey,
        name: formatParticipantName(participant, group.Name),
        pushName: participant.DisplayName || undefined,
        phone: derivedPhone,
        lid,
        instanceId: instance.id,
        instanceName: instance.name,
        instanceJid: instance.jid,
        source: "GROUP_PARTICIPANTS_API",
        category: "GROUP_PARTICIPANT",
        groupJid: sanitizedGroup.jid,
        groupName: group.Name,
        groupAddressingMode: group.AddressingMode,
        groupParticipantIsAdmin: participant.IsAdmin ?? false,
        groupParticipantIsSuperAdmin: participant.IsSuperAdmin ?? false,
        groupParticipantPhoneNumber: participantPhone,
        groupOwnerJid: group.OwnerJID,
        groupOwnerPhone: group.OwnerPN,
        groupIsParent: group.IsParent ?? false,
        groupIsAnnounce: group.IsAnnounce ?? false,
      }

      map.set(mapKey, contact)
      processed++
    }
  }

  return {
    contacts: Array.from(map.values()),
    summary: {
      totalReturned: processed + skippedObfuscated,
      uniqueContacts: map.size,
      details: [
        { label: "Grupos selecionados", value: selectedGroupsCount },
        { label: "Participantes válidos", value: processed },
        { label: "Ignorados", value: skippedObfuscated },
      ],
    },
  }
}

function transformGroupList(
  groups: ApiGroup[],
  selectedGroupIds: string[],
  instance: Pick<User, "id" | "name" | "jid">
): { contacts: ApiContact[]; summary: FetchSummary } {
  const selectedGroups = groups.filter((group) => selectedGroupIds.includes(group.JID))
  const contacts: ApiContact[] = selectedGroups.map((group) => {
    const sanitizedGroup = sanitizeNormalizedJid(group.JID)
    const ownerJid = group.OwnerJID ? sanitizeNormalizedJid(group.OwnerJID).jid : group.OwnerJID

    return {
      jid: sanitizedGroup.jid,
      name: group.Name || sanitizedGroup.jid,
      instanceId: instance.id,
      instanceName: instance.name,
      instanceJid: instance.jid,
      source: "GROUPS_API",
      category: "GROUP",
      groupJid: sanitizedGroup.jid,
      groupName: group.Name,
      groupAddressingMode: group.AddressingMode,
      groupOwnerJid: ownerJid,
      groupOwnerPhone: group.OwnerPN,
      groupIsParent: group.IsParent ?? false,
      groupIsAnnounce: group.IsAnnounce ?? false,
      groupParticipantsCount: group.Participants?.length ?? 0,
    }
  })

  return {
    contacts,
    summary: {
      totalReturned: selectedGroups.length,
      uniqueContacts: contacts.length,
      details: [{ label: "Grupos selecionados", value: selectedGroupIds.length }],
    },
  }
}

function transformNewsletters(
  newsletters: ApiNewsletter[],
  selectedIds: string[],
  instance: Pick<User, "id" | "name" | "jid">
): { contacts: ApiContact[]; summary: FetchSummary } {
  const selected = newsletters.filter((item) => selectedIds.includes(item.id))

  const contacts: ApiContact[] = selected.map((newsletter) => {
    const sanitized = sanitizeNormalizedJid(newsletter.id)

    return {
      jid: sanitized.jid,
      name: newsletter.thread_metadata?.name?.text || sanitized.jid,
      businessName: newsletter.thread_metadata?.description?.text || undefined,
      instanceId: instance.id,
      instanceName: instance.name,
      instanceJid: instance.jid,
      source: "NEWSLETTER_API",
      category: "NEWSLETTER",
      newsletterInvite: newsletter.thread_metadata?.invite,
      newsletterVerification: newsletter.thread_metadata?.verification,
      newsletterRole: newsletter.viewer_metadata?.role,
      newsletterSubscribers: Number.parseInt(
        newsletter.thread_metadata?.subscribers_count ?? "0",
        10
      ),
    }
  })

  return {
    contacts,
    summary: {
      totalReturned: selected.length,
      uniqueContacts: contacts.length,
      details: [{ label: "Newsletters selecionadas", value: selected.length }],
    },
  }
}

function sanitizeContact(contact: ApiContact): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {
    jid: contact.jid,
    source: contact.source,
    category: contact.category,
    instanceId: contact.instanceId,
  }

  const preferredName = contact.name || contact.fullName || contact.pushName || contact.businessName
  if (preferredName) sanitized.name = preferredName
  if (contact.pushName) sanitized.pushName = contact.pushName
  if (contact.businessName) sanitized.businessName = contact.businessName
  if (contact.phone) sanitized.phone = contact.phone
  else if (contact.redactedPhone && !isObfuscated(contact.redactedPhone)) {
    const digits = contact.redactedPhone.replace(/\D/g, "")
    sanitized.phone = digits.length > 0 ? digits : contact.redactedPhone
  }
  if (contact.lid) sanitized.lid = contact.lid

  if (contact.category === "GROUP_PARTICIPANT") {
    if (contact.groupJid) sanitized.groupJid = contact.groupJid
    if (contact.groupName) sanitized.groupName = contact.groupName
    if (contact.groupParticipantIsAdmin) {
      sanitized.groupParticipantIsAdmin = contact.groupParticipantIsAdmin
    }
    if (contact.groupParticipantIsSuperAdmin) {
      sanitized.groupParticipantIsSuperAdmin = contact.groupParticipantIsSuperAdmin
    }
  } else if (contact.category === "GROUP") {
    if (contact.groupJid) sanitized.groupJid = contact.groupJid
    if (contact.groupName) sanitized.groupName = contact.groupName
  } else if (contact.category === "NEWSLETTER") {
    if (contact.newsletterInvite) sanitized.newsletterInvite = contact.newsletterInvite
    if (contact.newsletterVerification) {
      sanitized.newsletterVerification = contact.newsletterVerification
    }
    if (contact.newsletterRole) sanitized.newsletterRole = contact.newsletterRole
    if (typeof contact.newsletterSubscribers === "number") {
      sanitized.newsletterSubscribers = contact.newsletterSubscribers
    }
  }

  return sanitized
}

function validateJid(jid: string): boolean {
  return /^[^@\s]+@[\w.-]+$/.test(jid)
}

function validateContacts(data: ApiContact[]): ValidationResult {
  const valid: ApiContact[] = []
  const invalid: { row: ApiContact; errors: string[] }[] = []

  data.forEach((row) => {
    const errors: string[] = []

    if (!row.jid || !validateJid(row.jid)) {
      errors.push("JID inválido")
    }

    if (errors.length > 0) {
      invalid.push({ row, errors })
    } else {
      valid.push(row)
    }
  })

  return { valid, invalid }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ImportApiDialog({ open, onOpenChange, onSuccess }: ImportApiDialogProps) {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [instances, setInstances] = useState<User[]>([])
  const [instancesLoading, setInstancesLoading] = useState(false)
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("")

  const [listName, setListName] = useState("")

  const [dataset, setDataset] = useState<DatasetType>("contacts")
  const [groupMode, setGroupMode] = useState<GroupImportMode>("participants")

  const [groups, setGroups] = useState<ApiGroup[]>([])
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  const [newsletters, setNewsletters] = useState<ApiNewsletter[]>([])
  const [newslettersLoading, setNewslettersLoading] = useState(false)
  const [selectedNewsletterIds, setSelectedNewsletterIds] = useState<string[]>([])

  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [validationContext, setValidationContext] = useState<{
    dataset: DatasetType
    groupMode: GroupImportMode
  } | null>(null)
  const [fetchSummary, setFetchSummary] = useState<FetchSummary | null>(null)

  const selectedInstance = useMemo(
    () => instances.find((instance) => instance.id === selectedInstanceId),
    [instances, selectedInstanceId]
  )

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) =>
      (a.Name || a.JID).localeCompare(b.Name || b.JID, "pt-BR", { sensitivity: "base" })
    )
  }, [groups])

  const sortedNewsletters = useMemo(() => {
    return [...newsletters].sort((a, b) =>
      (a.thread_metadata?.name?.text || a.id).localeCompare(
        b.thread_metadata?.name?.text || b.id,
        "pt-BR",
        { sensitivity: "base" }
      )
    )
  }, [newsletters])

  const resetValidation = useCallback(() => {
    setValidation(null)
    setValidationContext(null)
    setFetchSummary(null)
  }, [])

  const loadInstances = useCallback(async () => {
    setInstancesLoading(true)
    try {
      const response = await adminApi.users.list()
      if (response.success && Array.isArray(response.data)) {
        setInstances(response.data)

        setSelectedInstanceId((prev) => {
          if (prev) {
            const exists = response.data?.some((instance) => instance.id === prev)
            if (exists) return prev
          }
          const preferred =
            response.data?.find((instance) => instance.connected) ?? response.data?.[0]
          return preferred?.id ?? ""
        })
      } else {
        toast.error(response.error || "Não foi possível carregar as instâncias")
      }
    } catch (error) {
      logger.error("Error loading instances", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "loadInstances",
      })
      toast.error("Erro ao carregar instâncias")
    } finally {
      setInstancesLoading(false)
    }
  }, [])

  const loadGroups = useCallback(async () => {
    if (!selectedInstance) {
      toast.error("Selecione uma instância para listar os grupos")
      return
    }

    setGroupsLoading(true)
    try {
      const response = await apiClient.get<ApiResponse<{ Groups: ApiGroup[] }>>("/group/list", {
        token: selectedInstance.token,
      })

      if (response.success && Array.isArray(response.data?.Groups)) {
        const groupsData = response.data.Groups
        setGroups(groupsData)
        setSelectedGroupIds((prev) => {
          const available = new Set(groupsData.map((group) => group.JID))
          const filtered = prev.filter((id) => available.has(id))
          if (filtered.length > 0) return filtered
          return groupsData.map((group) => group.JID)
        })
      } else {
        toast.error(response.error || "Não foi possível carregar os grupos")
      }
    } catch (error) {
      logger.error("Error loading groups", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "loadGroups",
      })
      toast.error("Erro ao carregar grupos")
    } finally {
      setGroupsLoading(false)
    }
  }, [selectedInstance])

  const loadNewsletters = useCallback(async () => {
    if (!selectedInstance) {
      toast.error("Selecione uma instância para listar newsletters")
      return
    }

    setNewslettersLoading(true)
    try {
      const response = await apiClient.get<ApiResponse<{ Newsletter: ApiNewsletter[] }>>(
        "/newsletter/list",
        {
          token: selectedInstance.token,
        }
      )

      if (response.success && Array.isArray(response.data?.Newsletter)) {
        const allowed = response.data.Newsletter.filter(hasNewsletterSendPermission)
        setNewsletters(allowed)
        setSelectedNewsletterIds((prev) => {
          const available = new Set(allowed.map((item) => item.id))
          const filtered = prev.filter((id) => available.has(id))
          if (filtered.length > 0) return filtered
          return allowed.map((item) => item.id)
        })
        if (allowed.length === 0) {
          toast.info("Nenhuma newsletter com permissão de envio para esta instância")
        }
      } else {
        toast.error(response.error || "Não foi possível carregar newsletters")
      }
    } catch (error) {
      logger.error("Error loading newsletters", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "loadNewsletters",
      })
      toast.error("Erro ao carregar newsletters")
    } finally {
      setNewslettersLoading(false)
    }
  }, [selectedInstance])

  useEffect(() => {
    if (open) {
      void loadInstances()
    }
  }, [open, loadInstances])

  useEffect(() => {
    resetValidation()
    if (!open) return

    if (dataset === "groups" && selectedInstance && groups.length === 0 && !groupsLoading) {
      void loadGroups()
    }

    if (
      dataset === "newsletters" &&
      selectedInstance &&
      newsletters.length === 0 &&
      !newslettersLoading
    ) {
      void loadNewsletters()
    }
  }, [
    dataset,
    selectedInstance,
    groups.length,
    newsletters.length,
    groupsLoading,
    newslettersLoading,
    loadGroups,
    loadNewsletters,
    resetValidation,
    open,
  ])

  useEffect(() => {
    resetValidation()
    setGroups([])
    setSelectedGroupIds([])
    setNewsletters([])
    setSelectedNewsletterIds([])
  }, [selectedInstanceId, resetValidation])

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const toggleNewsletterSelection = (newsletterId: string) => {
    setSelectedNewsletterIds((prev) =>
      prev.includes(newsletterId)
        ? prev.filter((id) => id !== newsletterId)
        : [...prev, newsletterId]
    )
  }

  const handleFetchData = useCallback(async () => {
    if (!selectedInstance) {
      toast.error("Selecione uma instância para continuar")
      return
    }

    setFetching(true)
    resetValidation()

    try {
      if (dataset === "contacts") {
        logger.debug("Fetching contacts from /user/contacts", null, {
          component: "ImportApiDialog",
          action: "handleFetchData",
          metadata: { instanceId: selectedInstance.id, instanceName: selectedInstance.name },
        })

        const response = await apiClient.get<ApiResponse<ContactsApiResponse>>("/user/contacts", {
          token: selectedInstance.token,
        })

        if (!response.success || !response.data) {
          toast.error(response.error || "Não foi possível obter os contatos da instância")
          return
        }

        const { contacts, summary } = transformUserContactsResponse(response.data, selectedInstance)
        const validationResult = validateContacts(contacts)

        setValidation(validationResult)
        setValidationContext({ dataset, groupMode })
        setFetchSummary(summary)

        logger.debug("Contacts fetched from instance", null, {
          component: "ImportApiDialog",
          action: "handleFetchData",
          metadata: {
            instanceId: selectedInstance.id,
            rawCount: summary.totalReturned,
            uniqueCount: summary.uniqueContacts,
            validCount: validationResult.valid.length,
            invalidCount: validationResult.invalid.length,
          },
        })

        if (validationResult.valid.length === 0) {
          toast.error("Nenhum contato válido encontrado para esta instância")
        } else {
          toast.success(
            `${validationResult.valid.length} contatos válidos encontrados${
              validationResult.invalid.length > 0
                ? ` (${validationResult.invalid.length} inválidos)`
                : ""
            }`
          )
        }
        return
      }

      if (dataset === "groups") {
        if (groups.length === 0) {
          await loadGroups()
        }

        if (selectedGroupIds.length === 0) {
          toast.error("Selecione pelo menos um grupo para continuar")
          return
        }

        const transformResult =
          groupMode === "participants"
            ? transformGroupParticipants(groups, selectedGroupIds, selectedInstance)
            : transformGroupList(groups, selectedGroupIds, selectedInstance)

        const validationResult = validateContacts(transformResult.contacts)

        setValidation(validationResult)
        setValidationContext({ dataset, groupMode })
        setFetchSummary(transformResult.summary)

        if (validationResult.valid.length === 0) {
          toast.error("Nenhum registro válido encontrado com os critérios selecionados")
        } else {
          toast.success(
            `${validationResult.valid.length} registros válidos encontrados${
              validationResult.invalid.length > 0
                ? ` (${validationResult.invalid.length} inválidos)`
                : ""
            }`
          )
        }
        return
      }

      if (dataset === "newsletters") {
        if (newsletters.length === 0) {
          await loadNewsletters()
        }

        if (selectedNewsletterIds.length === 0) {
          toast.error("Selecione pelo menos uma newsletter para continuar")
          return
        }

        const transformResult = transformNewsletters(
          newsletters,
          selectedNewsletterIds,
          selectedInstance
        )
        const validationResult = validateContacts(transformResult.contacts)

        setValidation(validationResult)
        setValidationContext({ dataset, groupMode })
        setFetchSummary(transformResult.summary)

        if (validationResult.valid.length === 0) {
          toast.error("Nenhuma newsletter válida encontrada para importação")
        } else {
          toast.success(
            `${validationResult.valid.length} newsletters selecionadas${
              validationResult.invalid.length > 0
                ? ` (${validationResult.invalid.length} inválidas)`
                : ""
            }`
          )
        }
      }
    } catch (error) {
      logger.error("API fetch error", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "handleFetchData",
        metadata: { dataset, groupMode },
      })
      toast.error("Erro ao buscar dados da API")
    } finally {
      setFetching(false)
    }
  }, [
    dataset,
    groupMode,
    groups,
    loadGroups,
    loadNewsletters,
    newsletters,
    resetValidation,
    selectedGroupIds,
    selectedInstance,
    selectedNewsletterIds,
  ])

  const handleReset = useCallback(() => {
    setListName("")
    setSelectedInstanceId("")
    setDataset("contacts")
    setGroupMode("participants")
    setSelectedGroupIds([])
    setSelectedNewsletterIds([])
    setGroups([])
    setNewsletters([])
    resetValidation()
  }, [resetValidation])

  const handleImport = useCallback(async () => {
    if (!listName.trim()) {
      toast.error("Nome da lista é obrigatório")
      return
    }

    if (!validation || validation.valid.length === 0) {
      toast.error("Nenhum registro válido para importar")
      return
    }

    setLoading(true)

    try {
      const sanitizedContacts = validation.valid.map(sanitizeContact)

      logger.debug("Importing contacts from API", null, {
        component: "ImportApiDialog",
        action: "handleImport",
        metadata: {
          listName,
          dataset: validationContext?.dataset,
          contactCount: sanitizedContacts.length,
        },
      })

      const result = await importContactsAction({
        listName,
        contacts: sanitizedContacts as Array<{
          jid: string
          name?: string
          phone?: string
          [key: string]: any
        }>,
      })

      if (result.success) {
        toast.success(`${sanitizedContacts.length} contatos importados com sucesso!`)
        logger.success("Contacts imported successfully", null, {
          component: "ImportApiDialog",
          action: "handleImport",
          metadata: {
            listId: result.data?.listId,
            imported: result.meta?.imported,
            skipped: result.meta?.skipped,
          },
        })
        handleReset()
        onSuccess()
      } else {
        toast.error(result.error || "Erro ao importar contatos")
      }
    } catch (error) {
      logger.error("Error importing contacts", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "handleImport",
      })
      toast.error("Erro ao importar contatos")
    } finally {
      setLoading(false)
    }
  }, [handleReset, listName, onSuccess, validation, validationContext])

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleReset()
        onOpenChange(false)
      } else {
        onOpenChange(true)
      }
    },
    [handleReset, onOpenChange]
  )

  const fetchButtonLabel = useMemo(() => {
    if (dataset === "contacts") return "Buscar contatos da instância"
    if (dataset === "groups") {
      return groupMode === "participants"
        ? "Buscar participantes selecionados"
        : "Buscar grupos selecionados"
    }
    return "Buscar newsletters da instância"
  }, [dataset, groupMode])

  const fetchButtonDisabled = useMemo(() => {
    if (!selectedInstance) return true
    if (dataset === "groups" && selectedGroupIds.length === 0) return true
    if (dataset === "newsletters" && selectedNewsletterIds.length === 0) return true
    return false
  }, [dataset, selectedGroupIds.length, selectedInstance, selectedNewsletterIds.length])

  const previewDataset = validationContext?.dataset
  const previewGroupMode = validationContext?.groupMode

  const previewRows = validation ? validation.valid.slice(0, 10) : []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-5xl overflow-hidden p-0">
        <div className="flex h-full max-h-[92vh] flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle>Importar Contatos via API</DialogTitle>
                <DialogDescription>
                  Selecione uma instância conectada para buscar contatos diretamente da API
                  ZuckZapGo. Você pode importar contatos individuais, participantes de grupos (com
                  priorização de JIDs <code>@s.whatsapp.net</code>) ou newsletters em que a
                  instância possui permissão de envio.
                </DialogDescription>
              </DialogHeader>

              <section className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="listName">Nome da Lista *</Label>
                    <Input
                      id="listName"
                      placeholder="Ex: Contatos Instância 01"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      disabled={loading || fetching}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instanceId">Instância *</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Select
                        value={selectedInstanceId}
                        onValueChange={(value) => setSelectedInstanceId(value)}
                        disabled={loading || fetching || instancesLoading || instances.length === 0}
                      >
                        <SelectTrigger id="instanceId" className="w-full sm:flex-1">
                          <SelectValue
                            placeholder={
                              instancesLoading
                                ? "Carregando instâncias..."
                                : "Selecione a instância"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {instances.map((instance) => (
                            <SelectItem key={instance.id} value={instance.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7">
                                  <AvatarImage src={instance.avatar_url} alt={instance.name} />
                                  <AvatarFallback>{getInitials(instance.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium leading-tight">
                                    {instance.name}
                                  </span>
                                  <span className="font-mono text-xs text-muted-foreground leading-tight">
                                    {instance.jid || "JID não disponível"}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadInstances()}
                        disabled={instancesLoading}
                        className="w-full sm:w-auto sm:flex-none"
                      >
                        <RefreshCw
                          className={`mr-2 h-4 w-4 ${instancesLoading ? "animate-spin" : ""}`}
                        />
                        Atualizar instâncias
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedInstance && (
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
                    <Avatar className="size-10">
                      <AvatarImage src={selectedInstance.avatar_url} alt={selectedInstance.name} />
                      <AvatarFallback>{getInitials(selectedInstance.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-tight">
                        {selectedInstance.name}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {selectedInstance.jid || "JID não disponível"}
                      </p>
                    </div>
                    <Badge
                      variant={selectedInstance.connected ? "default" : "destructive"}
                      className="shrink-0"
                    >
                      {selectedInstance.connected ? "Conectada" : "Desconectada"}
                    </Badge>
                  </div>
                )}
              </section>

              <section className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-sm">
                <Tabs
                  value={dataset}
                  onValueChange={(value) => setDataset(value as DatasetType)}
                  className="space-y-4"
                >
                  <TabsList>
                    <TabsTrigger value="contacts">
                      <UserRound className="h-4 w-4" />
                      Contatos
                    </TabsTrigger>
                    <TabsTrigger value="groups">
                      <Users className="h-4 w-4" />
                      Grupos
                    </TabsTrigger>
                    <TabsTrigger value="newsletters">
                      <Megaphone className="h-4 w-4" />
                      Newsletters
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="contacts" className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                      <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                        A importação utiliza o endpoint {""}
                        <code className="rounded bg-white/80 px-1 py-0.5 text-xs font-semibold text-blue-900 dark:bg-slate-900 dark:text-blue-200">
                          GET /user/contacts
                        </code>{" "}
                        priorizando automaticamente JIDs <code>@s.whatsapp.net</code> e preservando
                        LIDs como referência secundária.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="groups" className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <Switch
                          id="group-mode-switch"
                          checked={groupMode === "groups"}
                          onCheckedChange={(checked) =>
                            setGroupMode(checked ? "groups" : "participants")
                          }
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {groupMode === "participants"
                              ? "Importar participantes dos grupos"
                              : "Importar apenas os grupos"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {groupMode === "participants"
                              ? "Participantes com telefone ofuscado são ignorados automaticamente."
                              : "Serão importados apenas os IDs dos grupos selecionados."}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedGroupIds(sortedGroups.map((group) => group.JID))
                          }
                          disabled={sortedGroups.length === 0}
                        >
                          Selecionar todos
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedGroupIds([])}
                          disabled={selectedGroupIds.length === 0}
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void loadGroups()}
                          disabled={groupsLoading}
                        >
                          <RefreshCw
                            className={`mr-2 h-4 w-4 ${groupsLoading ? "animate-spin" : ""}`}
                          />
                          Recarregar
                        </Button>
                      </div>
                    </div>

                    {groupsLoading ? (
                      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-6 text-center text-sm text-muted-foreground">
                        Carregando grupos da instância…
                      </div>
                    ) : sortedGroups.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-6 text-center text-sm text-muted-foreground">
                        Nenhum grupo disponível para esta instância.
                      </div>
                    ) : (
                      <ScrollArea className="max-h-56 rounded-xl border border-border/60 bg-background/40">
                        <div className="grid gap-2 p-2">
                          {sortedGroups.map((group) => {
                            const isSelected = selectedGroupIds.includes(group.JID)
                            return (
                              <label
                                key={group.JID}
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-background/70 px-3 py-2 transition hover:border-primary/40 focus-within:border-primary/60"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleGroupSelection(group.JID)}
                                  className="mt-1"
                                />
                                <div className="flex flex-1 flex-col gap-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {group.Name || "Grupo sem nome"}
                                    </span>
                                    <Badge variant="outline">
                                      {(group.AddressingMode || "LID").toUpperCase()}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {(group.Participants?.length ?? 0).toString()} participantes
                                    </Badge>
                                  </div>
                                  <span className="font-mono text-xs text-muted-foreground break-all">
                                    {group.JID}
                                  </span>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {selectedGroupIds.length} grupo(s) selecionado(s)
                    </p>
                  </TabsContent>

                  <TabsContent value="newsletters" className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Newsletters disponíveis</span>
                        <span className="text-xs text-muted-foreground">
                          Apenas newsletters em que a instância possui permissão de envio ficam
                          disponíveis.
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedNewsletterIds(sortedNewsletters.map((item) => item.id))
                          }
                          disabled={sortedNewsletters.length === 0}
                        >
                          Selecionar todas
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedNewsletterIds([])}
                          disabled={selectedNewsletterIds.length === 0}
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void loadNewsletters()}
                          disabled={newslettersLoading}
                        >
                          <RefreshCw
                            className={`mr-2 h-4 w-4 ${newslettersLoading ? "animate-spin" : ""}`}
                          />
                          Recarregar
                        </Button>
                      </div>
                    </div>

                    {newslettersLoading ? (
                      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-6 text-center text-sm text-muted-foreground">
                        Carregando newsletters…
                      </div>
                    ) : sortedNewsletters.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-6 text-center text-sm text-muted-foreground">
                        Nenhuma newsletter disponível para importação.
                      </div>
                    ) : (
                      <ScrollArea className="max-h-56 rounded-xl border border-border/60 bg-background/40">
                        <div className="grid gap-2 p-2">
                          {sortedNewsletters.map((newsletter) => {
                            const isSelected = selectedNewsletterIds.includes(newsletter.id)
                            return (
                              <label
                                key={newsletter.id}
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-background/70 px-3 py-2 transition hover:border-primary/40 focus-within:border-primary/60"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleNewsletterSelection(newsletter.id)}
                                  className="mt-1"
                                />
                                <div className="flex flex-1 flex-col gap-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {newsletter.thread_metadata?.name?.text ||
                                        "Newsletter sem nome"}
                                    </span>
                                    <Badge variant="secondary">
                                      {newsletter.viewer_metadata?.role || "sem função"}
                                    </Badge>
                                  </div>
                                  <span className="font-mono text-xs text-muted-foreground break-all">
                                    {newsletter.id}
                                  </span>
                                  {newsletter.thread_metadata?.invite && (
                                    <span className="text-xs text-muted-foreground break-all">
                                      Convite: {newsletter.thread_metadata.invite}
                                    </span>
                                  )}
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {selectedNewsletterIds.length} newsletter(s) selecionada(s)
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col gap-3 border-t border-dashed border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    Execute a busca para atualizar a pré-visualização abaixo.
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    {fetchSummary && (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">Retornados: {fetchSummary.totalReturned}</Badge>
                        <Badge variant="outline">Únicos: {fetchSummary.uniqueContacts}</Badge>
                        {fetchSummary.details?.map((detail) => (
                          <Badge key={detail.label} variant="outline">
                            {detail.label}: {detail.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleFetchData()}
                      disabled={fetching || loading || fetchButtonDisabled}
                      className="min-w-[12rem]"
                    >
                      {fetching ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Buscando dados…
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {fetchButtonLabel}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                  <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                    Os dados são coletados diretamente dos endpoints oficiais da API ZuckZapGo,
                    respeitando as permissões de envio da instância selecionada.
                  </AlertDescription>
                </Alert>
              </section>

              <section className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Pré-visualização
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Revise os primeiros registros retornados antes de confirmar a importação.
                  </p>
                </div>

                {!validation && (
                  <div className="rounded-xl border border-dashed border-border/60 bg-background/50 py-10 text-center text-sm text-muted-foreground">
                    Busque os dados para visualizar a pré-visualização.
                  </div>
                )}

                {validation && (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {validation.valid.length > 0 && (
                        <Alert className="flex-1 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <AlertDescription className="text-green-800 dark:text-green-200">
                            {validation.valid.length} registros válidos
                          </AlertDescription>
                        </Alert>
                      )}
                      {validation.invalid.length > 0 && (
                        <Alert className="flex-1 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <AlertDescription className="text-red-800 dark:text-red-200">
                            {validation.invalid.length} registros inválidos
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {validation.valid.length > 0 ? (
                      <ScrollArea className="h-64 rounded-xl border border-border/60">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>JID</TableHead>
                              {previewDataset === "groups" &&
                                previewGroupMode === "participants" && (
                                  <>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Grupo</TableHead>
                                    <TableHead>Admin</TableHead>
                                  </>
                                )}
                              {previewDataset === "groups" && previewGroupMode === "groups" && (
                                <>
                                  <TableHead>Nome do grupo</TableHead>
                                  <TableHead>Participantes</TableHead>
                                </>
                              )}
                              {previewDataset === "newsletters" && (
                                <>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>Convite</TableHead>
                                  <TableHead>Função</TableHead>
                                </>
                              )}
                              {previewDataset === "contacts" && (
                                <>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>Push/Business</TableHead>
                                  <TableHead>LID</TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewRows.map((contact, index) => (
                              <TableRow key={`${contact.jid}-${index}`}>
                                <TableCell className="font-mono text-xs break-all">
                                  {contact.jid}
                                </TableCell>
                                {previewDataset === "groups" &&
                                  previewGroupMode === "participants" && (
                                    <>
                                      <TableCell>{contact.name || "—"}</TableCell>
                                      <TableCell>
                                        <div className="flex flex-col">
                                          <span className="text-sm">
                                            {contact.groupName || "—"}
                                          </span>
                                          <span className="font-mono text-xs text-muted-foreground break-all">
                                            {contact.groupJid || "—"}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {contact.groupParticipantIsAdmin ||
                                        contact.groupParticipantIsSuperAdmin
                                          ? "Sim"
                                          : "Não"}
                                      </TableCell>
                                    </>
                                  )}
                                {previewDataset === "groups" && previewGroupMode === "groups" && (
                                  <>
                                    <TableCell>{contact.groupName || "—"}</TableCell>
                                    <TableCell>{contact.groupParticipantsCount ?? 0}</TableCell>
                                  </>
                                )}
                                {previewDataset === "newsletters" && (
                                  <>
                                    <TableCell>{contact.name || "—"}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground break-all">
                                      {contact.newsletterInvite || "—"}
                                    </TableCell>
                                    <TableCell>{contact.newsletterRole || "—"}</TableCell>
                                  </>
                                )}
                                {previewDataset === "contacts" && (
                                  <>
                                    <TableCell>{contact.name || contact.fullName || "—"}</TableCell>
                                    <TableCell>
                                      {contact.businessName && (
                                        <div className="text-sm font-medium">
                                          {contact.businessName}
                                        </div>
                                      )}
                                      <div className="text-xs text-muted-foreground">
                                        {contact.pushName || contact.firstName || "—"}
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs break-all">
                                      {contact.lid && contact.lid !== contact.jid
                                        ? contact.lid
                                        : "—"}
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 py-10 text-center text-sm text-muted-foreground">
                        Nenhum registro válido encontrado para a seleção atual.
                      </div>
                    )}

                    {validation.valid.length > previewRows.length && (
                      <p className="text-xs text-muted-foreground">
                        + {validation.valid.length - previewRows.length} registros adicionais
                      </p>
                    )}

                    {validation.invalid.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-destructive">
                          Registros inválidos (primeiros 5)
                        </span>
                        <ScrollArea className="h-40 rounded-xl border border-destructive/40 bg-destructive/5">
                          <div className="space-y-2 p-4">
                            {validation.invalid.slice(0, 5).map((item, index) => (
                              <div
                                key={`${item.row.jid ?? "invalid"}-${index}`}
                                className="rounded border border-destructive/40 bg-destructive/10 p-3 text-sm"
                              >
                                <div className="font-mono text-xs mb-1 break-all">
                                  {item.row.jid || "JID ausente"}
                                </div>
                                <div className="text-xs text-destructive">
                                  {item.errors.join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 border-t border-border/70 bg-background/95 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading || fetching}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => void handleImport()}
              disabled={loading || fetching || !validation || validation.valid.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Importando..." : "Importar contatos"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
