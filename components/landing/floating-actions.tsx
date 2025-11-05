"use client"

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"

const whatsappMessage = encodeURIComponent(
  "Olá! Gostaria de conhecer mais detalhes sobre o ZuckZapGo Manager."
)

const whatsappHref = `https://wa.me/5521971532700?text=${whatsappMessage}`

export const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handler = () => {
      setShowTop(window.scrollY > 280)
    }

    handler()
    window.addEventListener("scroll", handler, { passive: true })

    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <Link
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-emerald-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/10">
          <Image src="/landing/icons/whatsapp.svg" alt="WhatsApp" width={18} height={18} />
        </span>
        Fale no WhatsApp
      </Link>

      {showTop ? (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="pointer-events-auto h-10 w-10 rounded-full border-border/60 bg-background/90 shadow-md backdrop-blur transition hover:-translate-y-0.5"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
