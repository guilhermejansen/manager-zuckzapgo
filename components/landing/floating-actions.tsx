"use client"

import { useSyncExternalStore } from "react"

import Image from "next/image"
import Link from "next/link"

import { useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"

import { supportWhatsApp } from "@/components/landing/content"

const whatsappHref = `https://wa.me/${supportWhatsApp.phone}?text=${encodeURIComponent(
  supportWhatsApp.message
)}`

const SHOW_TOP_AFTER = 280

/**
 * Posição de rolagem lida por store externa, não por `setState` dentro de
 * efeito: no servidor o botão não existe e no cliente o valor já vale no
 * primeiro render.
 */
const subscribeScroll = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true })

  return () => window.removeEventListener("scroll", onStoreChange)
}
const getShowTop = () => window.scrollY > SHOW_TOP_AFTER
const getShowTopOnServer = () => false

export const FloatingActions = () => {
  const prefersReducedMotion = useReducedMotion()
  const showTop = useSyncExternalStore(subscribeScroll, getShowTop, getShowTopOnServer)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <Link
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          aria-hidden
          className="relative inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15"
        >
          <Image
            src="/landing/icons/whatsapp.svg"
            alt=""
            aria-hidden
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
            unoptimized
          />
        </span>
        Fale no WhatsApp
      </Link>

      {showTop ? (
        <button
          type="button"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
          }
          aria-label="Voltar ao topo da página"
        >
          <ArrowUp aria-hidden className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
