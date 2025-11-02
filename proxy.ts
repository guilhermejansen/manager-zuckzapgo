// Manager ZuckZapGo - Middleware
// Route protection e redirecionamento baseado em role
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getRedirectPath, getRole } from "@/lib/auth"

/**
 * Proxy para proteção de rotas (anteriormente middleware no Next.js 15)
 * - Admin não acessa rotas /user
 * - User não acessa rotas /admin
 * - Usuários não autenticados são redirecionados para /login
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso público
  const publicPaths = ["/login", "/_next", "/api", "/favicon.ico"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar autenticação
  const role = getRole(request.cookies)

  // Não autenticado - redirecionar para login
  if (!role) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Admin tentando acessar rotas de User
  if (role === "admin" && pathname.startsWith("/user")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/dashboard"
    return NextResponse.redirect(url)
  }

  // User tentando acessar rotas de Admin
  if (role === "user" && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone()
    url.pathname = "/user/dashboard"
    return NextResponse.redirect(url)
  }

  // Redirecionar root para dashboard apropriado
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = getRedirectPath(role)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

/**
 * Configuração de rotas para aplicar o middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
