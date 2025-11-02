/**
 * ZuckZapGo API Client for Campaigns
 *
 * Client simplificado para envio de mensagens via API ZuckZapGo
 * usado pelos workers de campanha.
 */
import { logger } from "@/lib/logger"

// ============================================================================
// TYPES
// ============================================================================

export interface ZuckZapGoMessage {
  type: "text" | "image" | "video" | "audio" | "document" | "buttons" | "list"
  content: Record<string, any>
}

export interface SendMessageRequest {
  instanceToken: string
  contactJid: string
  messages: ZuckZapGoMessage[]
}

export interface SendMessageResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

// ============================================================================
// API CLIENT
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

/**
 * Enviar mensagem de texto
 */
export async function sendTextMessage(
  token: string,
  jid: string,
  text: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        text,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send text message", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendTextMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar imagem
 */
export async function sendImageMessage(
  token: string,
  jid: string,
  imageUrl: string,
  caption?: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        image: imageUrl,
        caption,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send image", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendImageMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar vídeo
 */
export async function sendVideoMessage(
  token: string,
  jid: string,
  videoUrl: string,
  caption?: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        video: videoUrl,
        caption,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send video", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendVideoMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar áudio
 */
export async function sendAudioMessage(
  token: string,
  jid: string,
  audioUrl: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        audio: audioUrl,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send audio", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendAudioMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar documento
 */
export async function sendDocumentMessage(
  token: string,
  jid: string,
  documentUrl: string,
  filename?: string
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        document: documentUrl,
        filename,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send document", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendDocumentMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar botões interativos
 */
export async function sendButtonsMessage(
  token: string,
  jid: string,
  text: string,
  buttons: Array<{ id: string; text: string }>
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/buttons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        text,
        buttons,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send buttons", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendButtonsMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Enviar lista interativa
 */
export async function sendListMessage(
  token: string,
  jid: string,
  text: string,
  buttonText: string,
  sections: Array<{
    title: string
    rows: Array<{ id: string; title: string; description?: string }>
  }>
): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/send/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        jid,
        text,
        buttonText,
        sections,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to send list", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "sendListMessage",
      metadata: { jid },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Listar contatos da instância
 */
export async function listContacts(token: string): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/contacts/list`, {
      method: "GET",
      headers: {
        token,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to list contacts", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "listContacts",
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Verificar status da instância
 */
export async function checkInstanceStatus(token: string): Promise<SendMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/session/status`, {
      method: "GET",
      headers: {
        token,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "API Error")
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    logger.error("Failed to check instance status", error instanceof Error ? error : undefined, {
      component: "ZuckZapGoClient",
      action: "checkInstanceStatus",
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
