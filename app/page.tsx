import { redirect } from "next/navigation"

/**
 * Página root - redireciona para login
 * O middleware cuidará do redirecionamento apropriado
 * baseado no status de autenticação
 */
export default function HomePage() {
  redirect("/login")
}
