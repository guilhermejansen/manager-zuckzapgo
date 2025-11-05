"use client"

import { useEffect, useState } from "react"

import { useTheme } from "next-themes"
import Image from "next/image"

import { motion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { cn } from "@/lib/utils"

const dashboardScreenshots = {
  light: [
    {
      src: "/landing/screenshots/screenshot-dashboard-light.png",
      alt: "Dashboard - Visão geral do sistema em tema claro",
    },
    {
      src: "/landing/screenshots/screenshot-instancias-light.png",
      alt: "Instâncias WhatsApp em tema claro",
    },
    {
      src: "/landing/screenshots/screenshot-eventos-light.png",
      alt: "Monitor de eventos em tema claro",
    },
  ],
  dark: [
    {
      src: "/landing/screenshots/screenshot-dashboard-dark.png",
      alt: "Dashboard - Visão geral do sistema em tema escuro",
    },
    {
      src: "/landing/screenshots/screenshot-instancias-dark.png",
      alt: "Instâncias WhatsApp em tema escuro",
    },
    {
      src: "/landing/screenshots/screenshot-eventos-dark.png",
      alt: "Monitor de eventos em tema escuro",
    },
  ],
}

export const DashboardCarousel = () => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentImages, setCurrentImages] = useState(dashboardScreenshots.dark)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const activeTheme = resolvedTheme || theme || "dark"
      const themeKey = activeTheme === "light" ? "light" : "dark"
      setCurrentImages(dashboardScreenshots[themeKey])
    }
  }, [mounted, theme, resolvedTheme])

  const images = currentImages

  const css = `
    .dashboard-carousel {
      width: 100%;
      height: 280px;
      padding-bottom: 45px !important;
    }

    .dashboard-carousel .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 85%;
      max-width: 320px;
      height: 200px;
    }

    .dashboard-carousel .swiper-pagination-bullet {
      background-color: hsl(var(--primary)) !important;
      opacity: 0.5;
      width: 8px;
      height: 8px;
    }

    .dashboard-carousel .swiper-pagination-bullet-active {
      opacity: 1;
      width: 10px;
      height: 10px;
    }

    .dashboard-carousel .swiper-button-next,
    .dashboard-carousel .swiper-button-prev {
      color: hsl(var(--primary));
      width: 30px;
      height: 30px;
    }

    .dashboard-carousel .swiper-button-next::after,
    .dashboard-carousel .swiper-button-prev::after {
      display: none;
    }

    /* Small Mobile */
    @media (min-width: 375px) {
      .dashboard-carousel {
        height: 300px;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 350px;
        height: 220px;
      }
    }

    /* Mobile Landscape / Small Tablet */
    @media (min-width: 480px) {
      .dashboard-carousel {
        height: 340px;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 420px;
        height: 260px;
      }
    }

    /* Tablet */
    @media (min-width: 640px) {
      .dashboard-carousel {
        height: 380px;
        padding-bottom: 50px !important;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 500px;
        height: 300px;
      }

      .dashboard-carousel .swiper-button-next,
      .dashboard-carousel .swiper-button-prev {
        width: 36px;
        height: 36px;
      }
    }

    /* Tablet Large */
    @media (min-width: 768px) {
      .dashboard-carousel {
        height: 420px;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 580px;
        height: 340px;
      }
    }

    /* Desktop */
    @media (min-width: 1024px) {
      .dashboard-carousel {
        height: 500px;
        padding-bottom: 60px !important;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 700px;
        height: 420px;
      }

      .dashboard-carousel .swiper-button-next,
      .dashboard-carousel .swiper-button-prev {
        width: 40px;
        height: 40px;
      }

      .dashboard-carousel .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
      }

      .dashboard-carousel .swiper-pagination-bullet-active {
        width: 12px;
        height: 12px;
      }
    }

    /* Large Desktop */
    @media (min-width: 1280px) {
      .dashboard-carousel {
        height: 540px;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 800px;
        height: 460px;
      }
    }

    /* Extra Large Desktop */
    @media (min-width: 1536px) {
      .dashboard-carousel {
        height: 580px;
      }

      .dashboard-carousel .swiper-slide {
        max-width: 900px;
        height: 500px;
      }
    }
  `

  if (!mounted) {
    return (
      <div className="relative w-full max-w-7xl px-3 sm:px-5">
        <div className="flex h-[280px] sm:h-[380px] lg:h-[500px] items-center justify-center">
          <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.3,
      }}
      className="relative w-full max-w-7xl px-3 sm:px-5"
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Swiper
          key={`swiper-${images[0]?.src || "default"}`}
          spaceBetween={20}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={true}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="dashboard-carousel"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={`${image.src}-${index}`}
              className="rounded-xl sm:rounded-2xl overflow-hidden"
            >
              <div className="relative h-full w-full rounded-xl sm:rounded-2xl border border-border/40 bg-card shadow-xl sm:shadow-2xl overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 500px, 800px"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </Swiper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 sm:mt-8 text-center px-4"
      >
        <p className="text-xs sm:text-sm text-muted-foreground">
          Interface premium com total responsividade e acessibilidade.
        </p>
      </motion.div>
    </motion.div>
  )
}
