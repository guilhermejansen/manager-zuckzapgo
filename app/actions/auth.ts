// Manager ZuckZapGo - Auth Server Actions
// Server Actions para login e logout

"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { COOKIE_OPTIONS, getRedirectPath, validateCredentials } from "@/lib/auth"
import { logger } from "@/lib/logger"
import type { UserRole } from "@/types"

// Manager ZuckZapGo - Auth Server Actions
// Server Actions para login e logout

/**
 * Interface para resposta de login
 */
interface LoginResult {
  success: boolean
  error?: string
  role?: UserRole
}

/**
 * Server Action para fazer login
 */
export async function loginAction(token: string, role: UserRole): Promise<LoginResult> {
  try {
    // Validar credenciais contra API
    const isValid = await validateCredentials(token, role)

    if (!isValid) {
      return {
        success: false,
        error: "Token inválido ou expirado. Verifique suas credenciais.",
      }
    }

    // Criar cookies de autenticação
    const cookieStore = await cookies()

    cookieStore.set("auth_token", token, COOKIE_OPTIONS)
    cookieStore.set("auth_role", role, COOKIE_OPTIONS)

    // Sucesso
    return {
      success: true,
      role,
    }
  } catch (error) {
    logger.error("Login error", error instanceof Error ? error : undefined, {
      component: "AuthActions",
      action: "loginAction",
      metadata: { role },
    })
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    }
  }
}

/**
 * Server Action para fazer logout
 */
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies()

    // Remover cookies de autenticação
    cookieStore.delete("auth_token")
    cookieStore.delete("auth_role")
  } catch (error) {
    logger.error("Logout error", error instanceof Error ? error : undefined, {
      component: "AuthActions",
      action: "logoutAction",
    })
  }

  // Redirecionar para login
  redirect("/login")
}

/**
 * Server Action para verificar autenticação
 */
export async function checkAuthAction(): Promise<{
  authenticated: boolean
  role?: UserRole
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const role = cookieStore.get("auth_role")?.value as UserRole | undefined

    if (!token || !role) {
      return { authenticated: false }
    }

    // Validar token ainda é válido
    const isValid = await validateCredentials(token, role)

    if (!isValid) {
      // Token expirado - limpar cookies
      cookieStore.delete("auth_token")
      cookieStore.delete("auth_role")
      return { authenticated: false }
    }

    return { authenticated: true, role }
  } catch (error) {
    logger.error("Check auth error", error instanceof Error ? error : undefined, {
      component: "AuthActions",
      action: "checkAuthAction",
    })
    return { authenticated: false }
  }
}
