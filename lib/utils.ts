import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gera um token aleatório criptograficamente seguro
 * @param length Comprimento do token (padrão: 32)
 * @returns Token aleatório com letras maiúsculas, minúsculas e números
 */
export function generateToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const array = new Uint8Array(length)

  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array)
  } else if (typeof globalThis !== "undefined" && globalThis.crypto) {
    globalThis.crypto.getRandomValues(array)
  } else {
    // Fallback para Node.js (não deve acontecer no client)
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(array, (byte) => chars[byte % chars.length]).join("")
}

/**
 * Formata o payload do formulário para envio à API
 * Remove campos undefined, null ou strings vazias
 * Converte arrays para comma-separated strings onde necessário
 * @param data Dados do formulário
 * @returns Payload formatado para a API
 */
export function formatPayload<T extends Record<string, any>>(data: T): Partial<T> {
  const formatted: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    // Pula valores undefined, null ou strings vazias
    if (value === undefined || value === null || value === "") {
      continue
    }

    // Se for array vazio, pula
    if (Array.isArray(value) && value.length === 0) {
      continue
    }

    // Se for objeto, processa recursivamente
    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = formatPayload(value)
      // Só adiciona se o objeto tiver propriedades
      if (Object.keys(nested).length > 0) {
        formatted[key] = nested
      }
      continue
    }

    // Adiciona o valor
    formatted[key] = value
  }

  return formatted as Partial<T>
}
