// Manager ZuckZapGo - API Proxy
// Proxy para evitar CORS e centralizar autenticação
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/lib/logger"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

function headersInitToRecord(headers: HeadersInit): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries())
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }
  return { ...headers }
}

function buildForwardHeaders(
  request: NextRequest,
  authHeaders: HeadersInit
): Record<string, string> {
  const forwardHeaders: Record<string, string> = headersInitToRecord(authHeaders)
  const incomingHeaders = request.headers

  const tokenHeader = incomingHeaders.get("token")
  if (tokenHeader) {
    forwardHeaders["token"] = tokenHeader
  }

  const authorizationOverride = incomingHeaders.get("authorization")
  if (authorizationOverride) {
    forwardHeaders["Authorization"] = authorizationOverride
  }

  const contentType = incomingHeaders.get("content-type")
  if (contentType) {
    forwardHeaders["Content-Type"] = contentType
  } else if (request.method !== "GET" && !forwardHeaders["Content-Type"]) {
    forwardHeaders["Content-Type"] = "application/json"
  }

  return forwardHeaders
}

/**
 * Constrói headers de autenticação baseado no role
 */
async function getAuthHeaders(request: NextRequest): Promise<HeadersInit> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const role = cookieStore.get("auth_role")?.value

  // Debug: Log cookies recebidos
  logger.debug("Proxy auth headers", null, {
    component: "Proxy",
    action: "getAuthHeaders",
    metadata: {
      hasToken: !!token,
      hasRole: !!role,
      role: role || "none",
      tokenPrefix: token ? token.substring(0, 10) + "..." : "none",
      allCookies: cookieStore.getAll().map((c) => c.name),
    },
  })

  if (!token || !role) {
    logger.warn("No auth cookies found in proxy", null, {
      component: "Proxy",
      action: "getAuthHeaders",
      metadata: {
        requestHeaders: Object.fromEntries(request.headers.entries()),
      },
    })
    return {}
  }

  // Admin usa token no Authorization header
  if (role === "admin") {
    return {
      Authorization: `${token}`,
    }
  }

  // User usa token header
  if (role === "user") {
    return {
      token: token,
    }
  }

  return {}
}

/**
 * Handler para requisições GET
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let url = ""
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const searchParams = request.nextUrl.searchParams.toString()
    url = `${API_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

    const authHeaders = await getAuthHeaders(request)
    const headers = buildForwardHeaders(request, authHeaders)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json().catch(() => ({}))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("Proxy GET error", error instanceof Error ? error : undefined, {
      component: "Proxy",
      action: "GET",
      metadata: { url },
    })
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}

/**
 * Handler para requisições POST
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let url = ""
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    url = `${API_URL}/${path}`
    const body = await request.json().catch(() => ({}))

    const authHeaders = await getAuthHeaders(request)
    const headers = buildForwardHeaders(request, authHeaders)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("Proxy POST error", error instanceof Error ? error : undefined, {
      component: "Proxy",
      action: "POST",
      metadata: { url },
    })
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}

/**
 * Handler para requisições PUT
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let url = ""
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    url = `${API_URL}/${path}`
    const body = await request.json().catch(() => ({}))

    const authHeaders = await getAuthHeaders(request)
    const headers = buildForwardHeaders(request, authHeaders)

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("Proxy PUT error", error instanceof Error ? error : undefined, {
      component: "Proxy",
      action: "PUT",
      metadata: { url },
    })
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}

/**
 * Handler para requisições DELETE
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let url = ""
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    url = `${API_URL}/${path}`

    const authHeaders = await getAuthHeaders(request)
    const headers = buildForwardHeaders(request, authHeaders)

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    const data = await response.json().catch(() => ({}))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("Proxy DELETE error", error instanceof Error ? error : undefined, {
      component: "Proxy",
      action: "DELETE",
      metadata: { url },
    })
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
