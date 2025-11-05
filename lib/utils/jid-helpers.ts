/**
 * JID Helper Functions
 *
 * Utilitários para manipulação e validação de JIDs (WhatsApp Jabber IDs).
 * Suporta todos os 11 tipos de ContactType do whatsmeow.
 *
 * @see https://github.com/tulir/whatsmeow
 */

import type { ContactType } from "@prisma/client"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

/**
 * Mapeamento de ContactType para sufixo JID
 */
export const JID_SUFFIXES: Record<ContactType, string> = {
  INDIVIDUAL: "@s.whatsapp.net",
  LID: "@lid",
  GROUP: "@g.us",
  NEWSLETTER: "@newsletter",
  BROADCAST: "@broadcast",
  BOT: "@bot",
  HOSTED: "@hosted",
  HOSTED_LID: "@hosted.lid",
  MESSENGER: "@msgr",
  INTEROP: "@interop",
  STATUS: "@broadcast", // status@broadcast is fixed
}

/**
 * Regex patterns para validação de JIDs por tipo
 */
export const JID_PATTERNS: Record<ContactType, RegExp> = {
  INDIVIDUAL: /^\d{10,15}@s\.whatsapp\.net$/,
  LID: /^\d{10,20}@lid$/,
  GROUP: /^\d{15,20}@g\.us$/,
  NEWSLETTER: /^[\d\w]+@newsletter$/,
  BROADCAST: /^[\d\w]+@broadcast$/,
  BOT: /^[\d\w]+@bot$/,
  HOSTED: /^[\d\w]+@hosted$/,
  HOSTED_LID: /^[\d\w]+@hosted\.lid$/,
  MESSENGER: /^[\d\w]+@msgr$/,
  INTEROP: /^[\d\w]+@interop$/,
  STATUS: /^status@broadcast$/,
}

/**
 * Mapeamento de sufixo JID para ContactType
 */
export const SUFFIX_TO_TYPE: Record<string, ContactType> = {
  "@s.whatsapp.net": "INDIVIDUAL",
  "@c.us": "INDIVIDUAL", // Legacy
  "@lid": "LID",
  "@g.us": "GROUP",
  "@newsletter": "NEWSLETTER",
  "@broadcast": "BROADCAST",
  "@bot": "BOT",
  "@hosted": "HOSTED",
  "@hosted.lid": "HOSTED_LID",
  "@msgr": "MESSENGER",
  "@interop": "INTEROP",
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Valida se um número de telefone é válido
 *
 * @param number - Número de telefone (apenas dígitos)
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidPhoneNumber("5511999999999") // true
 * isValidPhoneNumber("123") // false
 */
export function isValidPhoneNumber(number: string): boolean {
  // Remove non-digits
  const cleaned = number.replace(/\D/g, "")

  // Phone numbers should be 10-15 digits
  return /^\d{10,15}$/.test(cleaned)
}

/**
 * Valida se um ID de grupo é válido
 *
 * @param groupId - ID do grupo (apenas dígitos)
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidGroupId("120363123456789012") // true
 * isValidGroupId("123") // false
 */
export function isValidGroupId(groupId: string): boolean {
  // Group IDs are typically 18-20 digits starting with 120363
  const cleaned = groupId.replace(/\D/g, "")
  return /^120363\d{12,14}$/.test(cleaned)
}

/**
 * Valida se um JID está no formato correto
 *
 * @param jid - JID completo (ex: "5511999999999@s.whatsapp.net")
 * @param type - Tipo de contato esperado (opcional)
 * @returns true se válido, false caso contrário
 *
 * @example
 * validateJIDFormat("5511999999999@s.whatsapp.net") // true
 * validateJIDFormat("5511999999999@s.whatsapp.net", "INDIVIDUAL") // true
 * validateJIDFormat("invalid") // false
 */
export function validateJIDFormat(jid: string, type?: ContactType): boolean {
  if (!jid || typeof jid !== "string") {
    return false
  }

  // If type is specified, use specific pattern
  if (type && JID_PATTERNS[type]) {
    return JID_PATTERNS[type].test(jid)
  }

  // Otherwise, check if it matches any valid pattern
  const allPatterns = Object.values(JID_PATTERNS)
  return allPatterns.some((pattern) => pattern.test(jid))
}

// ============================================================================
// DETECTION FUNCTIONS
// ============================================================================

/**
 * Detecta o tipo de contato baseado no sufixo do JID
 *
 * @param jid - JID completo (ex: "5511999999999@s.whatsapp.net")
 * @returns ContactType detectado ou null se não reconhecido
 *
 * @example
 * detectContactTypeFromJID("5511999999999@s.whatsapp.net") // "INDIVIDUAL"
 * detectContactTypeFromJID("120363123456789012@g.us") // "GROUP"
 * detectContactTypeFromJID("status@broadcast") // "STATUS"
 */
export function detectContactTypeFromJID(jid: string): ContactType | null {
  if (!jid || typeof jid !== "string") {
    return null
  }

  // Special case: status@broadcast
  if (jid === "status@broadcast") {
    return "STATUS"
  }

  // Extract suffix
  const suffixMatch = jid.match(/@(.+)$/)
  if (!suffixMatch) {
    return null
  }

  const suffix = `@${suffixMatch[1]}`

  // Map suffix to type
  return SUFFIX_TO_TYPE[suffix] || null
}

// ============================================================================
// FORMATTING FUNCTIONS
// ============================================================================

/**
 * Obtém o sufixo JID para um tipo de contato
 *
 * @param type - Tipo de contato
 * @returns Sufixo JID correspondente
 *
 * @example
 * getJIDSuffix("INDIVIDUAL") // "@s.whatsapp.net"
 * getJIDSuffix("GROUP") // "@g.us"
 * getJIDSuffix("NEWSLETTER") // "@newsletter"
 */
export function getJIDSuffix(type: ContactType): string {
  return JID_SUFFIXES[type] || "@s.whatsapp.net"
}

/**
 * Formata um número/ID com o sufixo correto baseado no tipo
 *
 * @param number - Número ou ID (sem sufixo)
 * @param type - Tipo de contato
 * @returns JID completo formatado
 *
 * @example
 * formatJID("5511999999999", "INDIVIDUAL") // "5511999999999@s.whatsapp.net"
 * formatJID("120363123456789012", "GROUP") // "120363123456789012@g.us"
 * formatJID("1234567890", "NEWSLETTER") // "1234567890@newsletter"
 */
export function formatJID(number: string, type: ContactType): string {
  // Special case: STATUS is always "status@broadcast"
  if (type === "STATUS") {
    return "status@broadcast"
  }

  // Remove any existing suffix
  const cleanNumber = number.replace(/@.*$/, "").trim()

  if (!cleanNumber) {
    throw new Error("Número/ID não pode estar vazio")
  }

  // Get suffix for type
  const suffix = getJIDSuffix(type)

  // Format and return
  return `${cleanNumber}${suffix}`
}

/**
 * Extrai o número/ID de um JID completo
 *
 * @param jid - JID completo (ex: "5511999999999@s.whatsapp.net")
 * @returns Número/ID sem sufixo
 *
 * @example
 * extractNumberFromJID("5511999999999@s.whatsapp.net") // "5511999999999"
 * extractNumberFromJID("120363123456789012@g.us") // "120363123456789012"
 * extractNumberFromJID("status@broadcast") // "status"
 */
export function extractNumberFromJID(jid: string): string {
  if (!jid || typeof jid !== "string") {
    return ""
  }

  // Remove suffix
  return jid.replace(/@.*$/, "").trim()
}

/**
 * Normaliza um JID para o formato padrão
 *
 * @param jid - JID em qualquer formato
 * @param type - Tipo de contato (opcional, será detectado se não fornecido)
 * @returns JID normalizado ou null se inválido
 *
 * @example
 * normalizeJID("5511999999999@c.us") // "5511999999999@s.whatsapp.net"
 * normalizeJID("5511999999999@s.whatsapp.net") // "5511999999999@s.whatsapp.net"
 */
export function normalizeJID(jid: string, type?: ContactType): string | null {
  if (!jid || typeof jid !== "string") {
    return null
  }

  // Detect type if not provided
  const detectedType = type || detectContactTypeFromJID(jid)
  if (!detectedType) {
    return null
  }

  // Extract number
  const number = extractNumberFromJID(jid)
  if (!number) {
    return null
  }

  // Format with correct suffix
  try {
    return formatJID(number, detectedType)
  } catch {
    return null
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Valida e retorna um objeto com informações sobre o JID
 *
 * @param jid - JID completo
 * @returns Objeto com informações do JID ou null se inválido
 *
 * @example
 * parseJID("5511999999999@s.whatsapp.net")
 * // {
 * //   jid: "5511999999999@s.whatsapp.net",
 * //   number: "5511999999999",
 * //   type: "INDIVIDUAL",
 * //   suffix: "@s.whatsapp.net",
 * //   isValid: true
 * // }
 */
export function parseJID(jid: string): {
  jid: string
  number: string
  type: ContactType | null
  suffix: string
  isValid: boolean
} | null {
  if (!jid || typeof jid !== "string") {
    return null
  }

  const number = extractNumberFromJID(jid)
  const type = detectContactTypeFromJID(jid)
  const suffix = jid.replace(/^[^@]+/, "")
  const isValid = validateJIDFormat(jid, type || undefined)

  return {
    jid,
    number,
    type,
    suffix,
    isValid,
  }
}

/**
 * Valida múltiplos JIDs e retorna estatísticas
 *
 * @param jids - Array de JIDs
 * @returns Estatísticas de validação
 *
 * @example
 * validateMultipleJIDs([
 *   "5511999999999@s.whatsapp.net",
 *   "invalid",
 *   "120363123456789012@g.us"
 * ])
 * // {
 * //   total: 3,
 * //   valid: 2,
 * //   invalid: 1,
 * //   byType: { INDIVIDUAL: 1, GROUP: 1 },
 * //   errors: ["JID inválido na posição 1: invalid"]
 * // }
 */
export function validateMultipleJIDs(jids: string[]): {
  total: number
  valid: number
  invalid: number
  byType: Partial<Record<ContactType, number>>
  errors: string[]
} {
  const result = {
    total: jids.length,
    valid: 0,
    invalid: 0,
    byType: {} as Partial<Record<ContactType, number>>,
    errors: [] as string[],
  }

  jids.forEach((jid, index) => {
    const parsed = parseJID(jid)

    if (!parsed || !parsed.isValid) {
      result.invalid++
      result.errors.push(`JID inválido na posição ${index}: ${jid}`)
    } else {
      result.valid++
      if (parsed.type) {
        result.byType[parsed.type] = (result.byType[parsed.type] || 0) + 1
      }
    }
  })

  return result
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gera um JID de exemplo para um tipo de contato
 *
 * @param type - Tipo de contato
 * @returns JID de exemplo
 *
 * @example
 * generateExampleJID("INDIVIDUAL") // "5511999999999@s.whatsapp.net"
 * generateExampleJID("GROUP") // "120363123456789012@g.us"
 */
export function generateExampleJID(type: ContactType): string {
  const examples: Record<ContactType, string> = {
    INDIVIDUAL: "5511999999999@s.whatsapp.net",
    LID: "1234567890@lid",
    GROUP: "120363123456789012@g.us",
    NEWSLETTER: "1234567890@newsletter",
    BROADCAST: "1234567890@broadcast",
    BOT: "1234567890@bot",
    HOSTED: "1234567890@hosted",
    HOSTED_LID: "1234567890@hosted.lid",
    MESSENGER: "1234567890@msgr",
    INTEROP: "1234567890@interop",
    STATUS: "status@broadcast",
  }

  return examples[type]
}

/**
 * Obtém descrição amigável de um tipo de contato
 *
 * @param type - Tipo de contato
 * @returns Descrição em português
 *
 * @example
 * getContactTypeDescription("INDIVIDUAL") // "Contato Individual"
 * getContactTypeDescription("GROUP") // "Grupo do WhatsApp"
 */
export function getContactTypeDescription(type: ContactType): string {
  const descriptions: Record<ContactType, string> = {
    INDIVIDUAL: "Contato Individual",
    LID: "LID (Hidden User Server)",
    GROUP: "Grupo do WhatsApp",
    NEWSLETTER: "Canal/Newsletter",
    BROADCAST: "Lista de Transmissão",
    BOT: "Bot do WhatsApp",
    HOSTED: "Servidor Hospedado",
    HOSTED_LID: "Servidor LID Hospedado",
    MESSENGER: "Messenger Interop",
    INTEROP: "Interoperabilidade Geral",
    STATUS: "Status do WhatsApp",
  }

  return descriptions[type] || type
}
