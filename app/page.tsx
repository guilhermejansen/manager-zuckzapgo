import { LandingPage } from "@/components/landing/landing-page"

/**
 * Landing page pública
 * Usuários autenticados continuam sendo redirecionados via proxy.ts
 */
export default function HomePage() {
  return <LandingPage />
}
