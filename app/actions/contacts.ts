// Manager ZuckZapGo - Contact Server Actions
// Server Actions para gerenciamento de contatos e importação

"use server"


import ExcelJS from "exceljs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import Papa from "papaparse"

import { getRole, getToken } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"
import {
  type AddContactFormData,
  addContactSchema,
  type CreateContactListFormData,
  createContactListSchema,
} from "@/lib/validations"

// Manager ZuckZapGo - Contact Server Actions
// Server Actions para gerenciamento de contatos e importação

// ============================================================================
// TYPES
// ============================================================================

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
  meta?: Record<string, any>
}

// ============================================================================
// CONTACT LIST CRUD
// ============================================================================

/**
 * Criar nova lista de contatos
 */
export async function createContactListAction(
  data: CreateContactListFormData
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Validar dados
    const validated = createContactListSchema.parse(data)

    // Criar lista
    const list = await prisma.contactList.create({
      data: {
        name: validated.name,
        description: validated.description || null,
        source: validated.source as any,
        type: validated.type as any,
      },
    })

    logger.success("Contact list created", null, {
      component: "ContactActions",
      action: "createContactListAction",
      metadata: { listId: list.id, userId },
    })

    revalidatePath("/contacts")

    return {
      success: true,
      data: list,
    }
  } catch (error) {
    logger.error("Failed to create contact list", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "createContactListAction",
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar lista de contatos",
    }
  }
}

/**
 * Listar listas de contatos
 */
export async function getContactListsAction(): Promise<ActionResult> {
  return listContactListsAction()
}

export async function listContactListsAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    const lists = await prisma.contactList.findMany({
      include: {
        contacts: true,
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      data: lists,
    }
  } catch (error) {
    logger.error("Failed to list contact lists", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "listContactListsAction",
    })

    return {
      success: false,
      error: "Erro ao listar listas de contatos",
    }
  }
}

/**
 * Obter lista de contatos por ID
 */
export async function getContactListAction(listId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    const list = await prisma.contactList.findUnique({
      where: { id: listId },
      include: {
        contacts: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    return {
      success: true,
      data: list,
    }
  } catch (error) {
    logger.error("Failed to get contact list", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "getContactListAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: "Erro ao buscar lista de contatos",
    }
  }
}

/**
 * Deletar lista de contatos
 */
export async function deleteContactListAction(listId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    await prisma.contactList.delete({
      where: { id: listId },
    })

    logger.success("Contact list deleted", null, {
      component: "ContactActions",
      action: "deleteContactListAction",
      metadata: { listId, userId },
    })

    revalidatePath("/contacts")

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to delete contact list", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "deleteContactListAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: "Erro ao deletar lista de contatos",
    }
  }
}

// ============================================================================
// CONTACT CRUD
// ============================================================================

/**
 * Adicionar contato manualmente
 */
export async function addContactAction(
  listId: string,
  data: AddContactFormData
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Validar dados
    const validated = addContactSchema.parse(data)

    // Verificar se lista existe
    const list = await prisma.contactList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    // Criar contato
    const contact = await prisma.contact.create({
      data: {
        contactListId: listId,
        jid: validated.jid,
        name: validated.name || null,
        pushName: validated.pushName || null,
        type: validated.type as any,
        customFields: validated.customFields || undefined,
      },
    })

    logger.success("Contact added", null, {
      component: "ContactActions",
      action: "addContactAction",
      metadata: { listId, contactId: contact.id },
    })

    revalidatePath(`/contacts/${listId}`)

    return {
      success: true,
      data: contact,
    }
  } catch (error) {
    logger.error("Failed to add contact", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "addContactAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao adicionar contato",
    }
  }
}

/**
 * Remover contato da lista
 */
export async function removeContactAction(contactId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!contact) {
      return {
        success: false,
        error: "Contato não encontrado",
      }
    }

    await prisma.contact.delete({
      where: { id: contactId },
    })

    logger.success("Contact removed", null, {
      component: "ContactActions",
      action: "removeContactAction",
      metadata: { contactId, userId },
    })

    revalidatePath(`/contacts/${contact.contactListId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to remove contact", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "removeContactAction",
      metadata: { contactId },
    })

    return {
      success: false,
      error: "Erro ao remover contato",
    }
  }
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Importar contatos (cria lista + adiciona contatos)
 * Usado pelos componentes de importação (CSV, Excel, API)
 */
export async function importContactsAction(data: {
  listName: string
  contacts: Array<{
    jid: string
    name?: string
    phone?: string
    [key: string]: any
  }>
}): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Criar lista de contatos
    const list = await prisma.contactList.create({
      data: {
        name: data.listName,
        source: "MANUAL",
        type: "INDIVIDUAL", // Detectado pelo JID posteriormente
      },
    })

    // Importar contatos
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 0; i < data.contacts.length; i++) {
      const contact = data.contacts[i]
      const jid = contact.jid?.trim()

      if (!jid) {
        skipped++
        continue
      }

      // Detectar tipo pelo JID
      let contactType: any = "INDIVIDUAL"
      if (jid.endsWith("@lid")) contactType = "LID"
      else if (jid.endsWith("@g.us")) contactType = "GROUP"
      else if (jid.endsWith("@newsletter")) contactType = "NEWSLETTER"
      else if (jid.endsWith("@broadcast") || jid === "status@broadcast") contactType = "BROADCAST"
      else if (jid.endsWith("@bot")) contactType = "BOT"
      else if (jid.endsWith("@hosted")) contactType = "HOSTED"
      else if (jid.endsWith("@hosted.lid")) contactType = "HOSTED_LID"
      else if (jid.endsWith("@msgr")) contactType = "MESSENGER"
      else if (jid.endsWith("@interop")) contactType = "INTEROP"

      try {
        // Verificar se já existe
        const existing = await prisma.contact.findUnique({
          where: {
            contactListId_jid: {
              contactListId: list.id,
              jid,
            },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Criar contato
        await prisma.contact.create({
          data: {
            contactListId: list.id,
            jid,
            name: contact.name || null,
            pushName: null,
            type: contactType,
            customFields: contact,
          },
        })

        imported++
      } catch (error) {
        errors.push(`JID ${jid}: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
        skipped++
      }
    }

    logger.success("Contacts imported", null, {
      component: "ContactActions",
      action: "importContactsAction",
      metadata: { listId: list.id, imported, skipped, errorCount: errors.length },
    })

    revalidatePath("/contacts")

    return {
      success: true,
      data: {
        listId: list.id,
        imported,
        skipped,
        errors,
      },
      meta: { imported, skipped, errorCount: errors.length },
    }
  } catch (error) {
    logger.error("Failed to import contacts", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "importContactsAction",
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao importar contatos",
    }
  }
}

/**
 * Importar contatos de CSV
 */
export async function importContactsCSVAction(
  listId: string,
  csvContent: string,
  options: {
    hasHeader?: boolean
    jidColumn: number
    nameColumn?: number
    delimiter?: string
  }
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar se lista existe
    const list = await prisma.contactList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    // Parse CSV
    const parsed = Papa.parse(csvContent, {
      delimiter: options.delimiter || ",",
      skipEmptyLines: true,
    })

    if (parsed.errors.length > 0) {
      logger.error("CSV parse errors", new Error("CSV parsing failed"), {
        component: "ContactActions",
        action: "importContactsCSVAction",
        metadata: { errors: parsed.errors },
      })
      return {
        success: false,
        error: "Erro ao processar CSV: " + parsed.errors[0].message,
      }
    }

    const rows = parsed.data as string[][]
    const startIndex = options.hasHeader ? 1 : 0
    const dataRows = rows.slice(startIndex)

    // Validar e importar contatos
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const jid = row[options.jidColumn]?.trim()
      const name = options.nameColumn !== undefined ? row[options.nameColumn]?.trim() : undefined

      if (!jid) {
        skipped++
        continue
      }

      // Validar formato JID (suporta todos os 11 tipos do whatsmeow)
      if (
        !/^[\d]+@(s\.whatsapp\.net|lid|g\.us|newsletter|broadcast|c\.us|bot|hosted|hosted\.lid|msgr|interop)$/.test(
          jid
        )
      ) {
        errors.push(`Linha ${i + startIndex + 1}: JID inválido "${jid}"`)
        skipped++
        continue
      }

      try {
        // Verificar se já existe
        const existing = await prisma.contact.findUnique({
          where: {
            contactListId_jid: {
              contactListId: listId,
              jid,
            },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Criar contato
        await prisma.contact.create({
          data: {
            contactListId: listId,
            jid,
            name: name || null,
            type: list.type as any,
          },
        })

        imported++
      } catch (error) {
        errors.push(
          `Linha ${i + startIndex + 1}: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        )
        skipped++
      }
    }

    logger.success("CSV import completed", null, {
      component: "ContactActions",
      action: "importContactsCSVAction",
      metadata: { listId, imported, skipped, errorCount: errors.length },
    })

    revalidatePath(`/contacts/${listId}`)

    return {
      success: true,
      data: { imported, skipped, errors },
      meta: { imported, skipped, errorCount: errors.length },
    }
  } catch (error) {
    logger.error("Failed to import CSV", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "importContactsCSVAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao importar CSV",
    }
  }
}

/**
 * Importar contatos de Excel
 */
export async function importContactsExcelAction(
  listId: string,
  fileBuffer: ArrayBuffer,
  options: {
    sheetName?: string
    hasHeader?: boolean
    jidColumn: string // Ex: "A"
    nameColumn?: string // Ex: "B"
  }
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar se lista existe
    const list = await prisma.contactList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    // Parse Excel with exceljs
    const workbook = new ExcelJS.Workbook()
    // ExcelJS aceita ArrayBuffer diretamente
    await workbook.xlsx.load(fileBuffer as unknown as ArrayBuffer)

    const sheetName = options.sheetName || workbook.worksheets[0]?.name
    const worksheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0]

    if (!worksheet) {
      return {
        success: false,
        error: `Planilha "${sheetName || 'default'}" não encontrada`,
      }
    }

    // Converter para array de arrays (similar ao xlsx)
    const data: any[][] = []
    worksheet.eachRow((row) => {
      // row.values começa do índice 1 no exceljs, então removemos o primeiro elemento undefined
      const rowValues = (row.values as any[]).slice(1)
      data.push(rowValues)
    })

    const startIndex = options.hasHeader ? 1 : 0
    const dataRows = data.slice(startIndex)

    // Converter colunas (A, B, C) para índices (0, 1, 2)
    const jidColumnIndex = options.jidColumn.toUpperCase().charCodeAt(0) - 65
    const nameColumnIndex = options.nameColumn
      ? options.nameColumn.toUpperCase().charCodeAt(0) - 65
      : undefined

    // Validar e importar contatos
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const jid = row[jidColumnIndex]?.toString().trim()
      const name =
        nameColumnIndex !== undefined ? row[nameColumnIndex]?.toString().trim() : undefined

      if (!jid) {
        skipped++
        continue
      }

      // Validar formato JID (suporta todos os 11 tipos do whatsmeow)
      if (
        !/^[\d]+@(s\.whatsapp\.net|lid|g\.us|newsletter|broadcast|c\.us|bot|hosted|hosted\.lid|msgr|interop)$/.test(
          jid
        )
      ) {
        errors.push(`Linha ${i + startIndex + 1}: JID inválido "${jid}"`)
        skipped++
        continue
      }

      try {
        // Verificar se já existe
        const existing = await prisma.contact.findUnique({
          where: {
            contactListId_jid: {
              contactListId: listId,
              jid,
            },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Criar contato
        await prisma.contact.create({
          data: {
            contactListId: listId,
            jid,
            name: name || null,
            type: list.type as any,
          },
        })

        imported++
      } catch (error) {
        errors.push(
          `Linha ${i + startIndex + 1}: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        )
        skipped++
      }
    }

    logger.success("Excel import completed", null, {
      component: "ContactActions",
      action: "importContactsExcelAction",
      metadata: { listId, imported, skipped, errorCount: errors.length },
    })

    revalidatePath(`/contacts/${listId}`)

    return {
      success: true,
      data: { imported, skipped, errors },
      meta: { imported, skipped, errorCount: errors.length },
    }
  } catch (error) {
    logger.error("Failed to import Excel", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "importContactsExcelAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao importar Excel",
    }
  }
}

/**
 * Importar contatos da API ZuckZapGo
 */
export async function importContactsAPIAction(
  listId: string,
  options: {
    instanceId: string
    token: string
    contactType:
      | "INDIVIDUAL"
      | "LID"
      | "GROUP"
      | "NEWSLETTER"
      | "BROADCAST"
      | "BOT"
      | "HOSTED"
      | "HOSTED_LID"
      | "MESSENGER"
      | "INTEROP"
      | "STATUS"
    includeGroups?: boolean
    includeChannels?: boolean
  }
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar se lista existe
    const list = await prisma.contactList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    // Buscar contatos da API ZuckZapGo
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const response = await fetch(`${apiUrl}/api/contacts/list`, {
      headers: {
        token: options.token,
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: "Erro ao buscar contatos da API: " + response.statusText,
      }
    }

    const apiData = await response.json()
    const contacts = apiData.data || []

    // Filtrar por tipo - suporta todos os 11 tipos do whatsmeow
    const filteredContacts = contacts.filter((contact: any) => {
      const jid = contact.jid as string
      if (!jid) return false

      switch (options.contactType) {
        case "INDIVIDUAL":
          return jid.endsWith("@s.whatsapp.net") || jid.endsWith("@c.us")
        case "LID":
          return jid.endsWith("@lid")
        case "GROUP":
          return jid.endsWith("@g.us")
        case "NEWSLETTER":
          return jid.endsWith("@newsletter")
        case "BROADCAST":
          return jid.endsWith("@broadcast") || jid === "status@broadcast"
        case "BOT":
          return jid.endsWith("@bot")
        case "HOSTED":
          return jid.endsWith("@hosted")
        case "HOSTED_LID":
          return jid.endsWith("@hosted.lid")
        case "MESSENGER":
          return jid.endsWith("@msgr")
        case "INTEROP":
          return jid.endsWith("@interop")
        case "STATUS":
          return jid === "status@broadcast"
        default:
          return false
      }
    })

    // Validar e importar contatos
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (const contact of filteredContacts) {
      const jid = contact.jid
      const name = contact.name || contact.pushName

      if (!jid) {
        skipped++
        continue
      }

      try {
        // Verificar se já existe
        const existing = await prisma.contact.findUnique({
          where: {
            contactListId_jid: {
              contactListId: listId,
              jid,
            },
          },
        })

        if (existing) {
          skipped++
          continue
        }

        // Criar contato
        await prisma.contact.create({
          data: {
            contactListId: listId,
            jid,
            name: name || null,
            pushName: contact.pushName || null,
            type: options.contactType as any,
          },
        })

        imported++
      } catch (error) {
        errors.push(`JID ${jid}: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
        skipped++
      }
    }

    logger.success("API import completed", null, {
      component: "ContactActions",
      action: "importContactsAPIAction",
      metadata: { listId, imported, skipped, errorCount: errors.length },
    })

    revalidatePath(`/contacts/${listId}`)

    return {
      success: true,
      data: { imported, skipped, errors },
      meta: { imported, skipped, errorCount: errors.length },
    }
  } catch (error) {
    logger.error("Failed to import from API", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "importContactsAPIAction",
      metadata: { listId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao importar da API",
    }
  }
}

/**
 * Vincular lista de contatos a uma campanha
 */
export async function linkContactListToCampaignAction(
  campaignId: string,
  listId: string
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    // Verificar se lista existe
    const list = await prisma.contactList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return {
        success: false,
        error: "Lista não encontrada",
      }
    }

    // Vincular lista à campanha
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        contactLists: {
          connect: { id: listId },
        },
      },
    })

    logger.success("Contact list linked to campaign", null, {
      component: "ContactActions",
      action: "linkContactListToCampaignAction",
      metadata: { campaignId, listId },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to link contact list", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "linkContactListToCampaignAction",
      metadata: { campaignId, listId },
    })

    return {
      success: false,
      error: "Erro ao vincular lista de contatos",
    }
  }
}

/**
 * Desvincular lista de contatos de uma campanha
 */
export async function unlinkContactListFromCampaignAction(
  campaignId: string,
  listId: string
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    // Desvincular lista da campanha
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        contactLists: {
          disconnect: { id: listId },
        },
      },
    })

    logger.success("Contact list unlinked from campaign", null, {
      component: "ContactActions",
      action: "unlinkContactListFromCampaignAction",
      metadata: { campaignId, listId },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to unlink contact list", error instanceof Error ? error : undefined, {
      component: "ContactActions",
      action: "unlinkContactListFromCampaignAction",
      metadata: { campaignId, listId },
    })

    return {
      success: false,
      error: "Erro ao desvincular lista de contatos",
    }
  }
}
