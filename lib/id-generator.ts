let counter = 0

/**
 * Gera ID determinístico usando timestamp + counter
 * Evita problemas de hidratação com nanoid()
 *
 * @param prefix - Prefixo para o ID (ex: "btn", "item", "node")
 * @returns ID único determinístico
 *
 * @example
 * generateDeterministicId("btn") // "btn-1730608800000-1"
 * generateDeterministicId("item") // "item-1730608800000-2"
 */
export function generateDeterministicId(prefix: string = "item"): string {
  counter++
  return `${prefix}-${Date.now()}-${counter}`
}

/**
 * Reset counter (útil para testes)
 */
export function resetIdCounter(): void {
  counter = 0
}
