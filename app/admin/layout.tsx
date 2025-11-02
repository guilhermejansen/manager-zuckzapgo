/**
 * Admin Layout Wrapper
 *
 * Protege todas as páginas administrativas e fornece layout consistente.
 * Verifica autenticação e role de admin antes de renderizar.
 */
import type { ReactNode } from "react"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AdminLayout } from "@/components/layout"
import { getRole, getToken } from "@/lib/auth"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function Layout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies()
  const role = getRole(cookieStore)
  const token = getToken(cookieStore)

  // Redireciona se não autenticado ou não é admin
  if (!token || role !== "admin") {
    redirect("/login")
  }

  // Define dados do usuário admin
  const user = {
    role: "admin" as const,
  }

  return <AdminLayout user={user}>{children}</AdminLayout>
}
