// Manager ZuckZapGo - Auth Utilities
// Funções auxiliares para autenticação e autorização
import { logger } from "@/lib/logger"
import type { UserRole } from "@/types"

/**
 * Valida token Admin contra API ZuckZapGo
 */
export async function validateAdminToken(token: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    const response = await fetch(`${apiUrl}/admin/users`, {
      headers: {
        Authorization: `${token}`,
      },
    })

    return response.ok
  } catch (error) {
    logger.error("Failed to validate admin token", error instanceof Error ? error : undefined, {
      component: "Auth",
      action: "validateAdminToken",
    })
    return false
  }
}

/**
 * Valida token User contra API ZuckZapGo
 */
export async function validateUserToken(token: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    const response = await fetch(`${apiUrl}/session/status`, {
      headers: {
        token: token,
      },
    })

    return response.ok
  } catch (error) {
    logger.error("Failed to validate user token", error instanceof Error ? error : undefined, {
      component: "Auth",
      action: "validateUserToken",
    })
    return false
  }
}

/**
 * Valida credenciais de login
 */
export async function validateCredentials(token: string, role: UserRole): Promise<boolean> {
  if (role === "admin") {
    return validateAdminToken(token)
  }

  return validateUserToken(token)
}

/**
 * Verifica se usuário está autenticado (server-side)
 */
export async function isAuthenticated(
  cookies: any
): Promise<{ authenticated: boolean; role?: UserRole }> {
  const token = cookies.get("auth_token")?.value
  const role = cookies.get("auth_role")?.value as UserRole | undefined

  if (!token || !role) {
    return { authenticated: false }
  }

  const valid = await validateCredentials(token, role)

  if (!valid) {
    return { authenticated: false }
  }

  return { authenticated: true, role }
}

/**
 * Extrai role do request (middleware/server components)
 */
export function getRole(cookies: any): UserRole | null {
  const role = cookies.get("auth_role")?.value

  if (role === "admin" || role === "user") {
    return role
  }

  return null
}

/**
 * Extrai token do request
 */
export function getToken(cookies: any): string | null {
  return cookies.get("auth_token")?.value || null
}

/**
 * Verifica se usuário é admin
 */
export function isAdmin(cookies: any): boolean {
  return getRole(cookies) === "admin"
}

/**
 * Verifica se usuário é user
 */
export function isUser(cookies: any): boolean {
  return getRole(cookies) === "user"
}

/**
 * Configurações de cookies
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  path: "/",
}

/**
 * Rotas protegidas por role
 */
export const PROTECTED_ROUTES = {
  admin: ["/admin"],
  user: ["/user"],
  public: ["/login"],
}

/**
 * Verifica se rota é protegida
 */
export function isProtectedRoute(pathname: string, role: UserRole): boolean {
  if (role === "admin") {
    return PROTECTED_ROUTES.admin.some((route) => pathname.startsWith(route))
  }

  if (role === "user") {
    return PROTECTED_ROUTES.user.some((route) => pathname.startsWith(route))
  }

  return false
}

/**
 * Retorna rota de redirect baseada no role
 */
export function getRedirectPath(role: UserRole | null): string {
  if (role === "admin") {
    return "/admin/dashboard"
  }

  if (role === "user") {
    return "/user/dashboard"
  }

  return "/login"
}
