"use client"

import { useState, useSyncExternalStore } from "react"

import Image from "next/image"
import { useTheme } from "next-themes"

import { useReducedMotion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { A11y, Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const dashboardScreenshots = {
  light: [
    {
      src: "/landing/screenshots/screenshot-dashboard-light.png",
      alt: "Dashboard do Manager em tema claro, com os cartões de visão geral",
    },
    {
      src: "/landing/screenshots/screenshot-instancias-light.png",
      alt: "Lista de instâncias WhatsApp em tema claro, com o status de cada conexão",
    },
    {
      src: "/landing/screenshots/screenshot-eventos-light.png",
      alt: "Monitor de eventos em tema claro, com o stream de eventos recebidos",
    },
  ],
  dark: [
    {
      src: "/landing/screenshots/screenshot-dashboard-dark.png",
      alt: "Dashboard do Manager em tema escuro, com os cartões de visão geral",
    },
    {
      src: "/landing/screenshots/screenshot-instancias-dark.png",
      alt: "Lista de instâncias WhatsApp em tema escuro, com o status de cada conexão",
    },
    {
      src: "/landing/screenshots/screenshot-eventos-dark.png",
      alt: "Monitor de eventos em tema escuro, com o stream de eventos recebidos",
    },
  ],
}

/**
 * Marca a hidratação sem `setState` dentro de efeito: o servidor lê `false`,
 * o cliente lê `true` já no primeiro render e a store nunca notifica.
 */
const subscribeNothing = () => () => {}
const getMounted = () => true
const getMountedOnServer = () => false

/**
 * Proporção real dos arquivos em `public/landing/screenshots` (~1,91:1).
 * Antes o slide tinha altura fixa por breakpoint, com proporções de 1,6 a 1,8,
 * o que recortava a captura. Uma proporção única mantém a tela inteira visível.
 */
const carouselCss = `
  .landing-carousel {
    width: 100%;
    padding-bottom: 3.5rem !important;
  }

  .landing-carousel .swiper-slide {
    width: min(90%, 900px);
    aspect-ratio: 1.9 / 1;
    height: auto;
  }

  /*
    O ponto continua com 10 px, mas o alvo clicável tem 44 px: o recheio entra
    no hit box e \`background-clip: content-box\` pinta só o miolo. O raio do
    content box é 22px - 17px = 5px, então o ponto segue redondo.
    Por isso o \`pagination\` não usa \`dynamicBullets\`: ele escala e desloca os
    pontos por transform e cortaria esse alvo. Com 3 telas não acrescenta nada.
  */
  .landing-carousel .swiper-pagination-bullet {
    box-sizing: content-box;
    width: 10px;
    height: 10px;
    padding: 17px;
    margin: 0 !important;
    background-color: var(--primary);
    background-clip: content-box;
    opacity: 0.45;
  }

  .landing-carousel .swiper-pagination-bullet-active {
    opacity: 1;
  }

  .landing-carousel .swiper-pagination-bullet:focus-visible {
    outline: 3px solid var(--ring);
    outline-offset: -12px;
  }
`

export const DashboardCarousel = () => {
  const { theme, resolvedTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const mounted = useSyncExternalStore(subscribeNothing, getMounted, getMountedOnServer)
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null)

  const activeTheme = resolvedTheme || theme || "dark"
  const images =
    mounted && activeTheme === "light" ? dashboardScreenshots.light : dashboardScreenshots.dark

  // Antes da montagem (e sem JavaScript) a primeira captura já aparece, no mesmo
  // espaço que o carrossel vai ocupar: nada de giro de carregamento nem salto.
  if (!mounted) {
    return (
      <div className="w-full max-w-7xl px-3 sm:px-5">
        <div className="mx-auto w-[min(90%,900px)]">
          <div className="relative aspect-[1.9/1] overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg sm:rounded-2xl">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 900px"
              unoptimized
            />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
          Telas reais do Manager: dashboard, instâncias e monitor de eventos, nos temas claro e
          escuro.
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-7xl px-3 sm:px-5">
      <style>{carouselCss}</style>

      <div className="relative">
        <Swiper
          key={images[0]?.src}
          spaceBetween={20}
          autoplay={
            prefersReducedMotion
              ? false
              : { delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }
          }
          effect="coverflow"
          grabCursor
          slidesPerView="auto"
          centeredSlides
          loop
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={{ prevEl, nextEl }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{
            prevSlideMessage: "Tela anterior",
            nextSlideMessage: "Próxima tela",
            paginationBulletMessage: "Ir para a tela {{index}}",
            firstSlideMessage: "Esta é a primeira tela",
            lastSlideMessage: "Esta é a última tela",
          }}
          className="landing-carousel"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation, Keyboard, A11y]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.src} className="overflow-hidden rounded-xl sm:rounded-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg sm:rounded-2xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 900px"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          ref={setPrevEl}
          aria-label="Tela anterior"
          className="absolute left-0 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40"
        >
          <ChevronLeftIcon aria-hidden className="h-5 w-5" />
        </button>
        <button
          type="button"
          ref={setNextEl}
          aria-label="Próxima tela"
          className="absolute right-0 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40"
        >
          <ChevronRightIcon aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
        Telas reais do Manager: dashboard, instâncias e monitor de eventos, nos temas claro e
        escuro.
      </p>
    </div>
  )
}
