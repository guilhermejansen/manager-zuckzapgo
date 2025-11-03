export function formatTransportLabel(transport: string, fallback = "Todos os transportes"): string {
  if (!transport) return fallback

  let scopeLabel = ""
  let base = transport

  if (transport.startsWith("global-")) {
    base = transport.replace(/^global-/, "")
    scopeLabel = "Global"
  } else if (transport.includes(":")) {
    const [prefix, identifier] = transport.split(":")
    base = prefix
    const truncated = identifier.length > 6 ? `${identifier.slice(0, 6)}…` : identifier
    scopeLabel = `Usuário ${truncated}`
  }

  const normalized = base.replace(/[-_]/g, " ")
  const pretty = normalized.charAt(0).toUpperCase() + normalized.slice(1)

  return scopeLabel ? `${pretty} (${scopeLabel})` : pretty
}
