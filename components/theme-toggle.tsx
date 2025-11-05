"use client"

import React, { useCallback, useEffect, useState } from "react"

import { motion } from "framer-motion"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// ///////////////////////////////////////////////////////////////////////////
// Type Definitions
// ///////////////////////////////////////////////////////////////////////////

export type AnimationVariant = "circle" | "rectangle" | "gif" | "polygon" | "circle-blur"
export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left"

interface Animation {
  name: string
  css: string
}

// ///////////////////////////////////////////////////////////////////////////
// Animation Helper Functions
// ///////////////////////////////////////////////////////////////////////////

const getClipPathPosition = (position: AnimationStart) => {
  switch (position) {
    case "top-left":
      return "0% 0%"
    case "top-right":
      return "100% 0%"
    case "bottom-left":
      return "0% 100%"
    case "bottom-right":
      return "100% 100%"
    case "top-center":
      return "50% 0%"
    case "bottom-center":
      return "50% 100%"
    default:
      return "50% 50%"
  }
}

export const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart = "center",
  blur = false
): Animation => {
  // Handle circle variants with start positions using clip-path
  if (variant === "circle" && start !== "center") {
    const clipPosition = getClipPathPosition(start)

    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }

      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: circle(0% at ${clipPosition});
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(150.0% at ${clipPosition});
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
        from {
           clip-path: circle(0% at ${clipPosition});
           ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(150.0% at ${clipPosition});
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
    }
  }

  // Default fallback (center circle)
  return {
    name: `${variant}-${start}${blur ? "-blur" : ""}`,
    css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }

      ::view-transition-new(root) {
        animation-name: reveal-light${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark${blur ? "-blur" : ""} {
        from {
          clip-path: circle(0% at 50% 50%);
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light${blur ? "-blur" : ""} {
        from {
           clip-path: circle(0% at 50% 50%);
           ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
  }
}

// ///////////////////////////////////////////////////////////////////////////
// Custom hook for theme toggle functionality with View Transitions
// ///////////////////////////////////////////////////////////////////////////

export const useThemeToggle = ({
  variant = "circle",
  start = "center",
  blur = false,
}: {
  variant?: AnimationVariant
  start?: AnimationStart
  blur?: boolean
} = {}) => {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const [isDark, setIsDark] = useState(false)

  // Sync isDark state with resolved theme after hydration
  useEffect(() => {
    setIsDark(resolvedTheme === "dark")
  }, [resolvedTheme])

  const styleId = "theme-transition-styles"

  const updateStyles = useCallback((css: string) => {
    if (typeof window === "undefined") return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark)

    const animation = createAnimation(variant, start, blur)

    updateStyles(animation.css)

    if (typeof window === "undefined") return

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme, setTheme, variant, start, blur, updateStyles, isDark])

  return {
    isDark,
    toggleTheme,
  }
}

// ///////////////////////////////////////////////////////////////////////////
// Theme Toggle Button Component with ThemeToggleButton2 Icon
// ///////////////////////////////////////////////////////////////////////////

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggleTheme } = useThemeToggle({
    variant: "circle",
    start: "top-left",
    blur: true,
  })

  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      type="button"
      className={cn(
        "size-12 cursor-pointer rounded-full p-2 transition-all duration-300 active:scale-95",
        isDark ? "bg-black text-white" : "bg-white text-black",
        // Fade in after hydration to prevent flash
        mounted ? "opacity-100" : "opacity-0",
        className
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      <span className="sr-only">Toggle theme</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
      >
        <clipPath id="skiper-btn-theme">
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath="url(#skiper-btn-theme)">
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  )
}
