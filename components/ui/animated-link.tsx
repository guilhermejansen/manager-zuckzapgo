"use client"

import React from "react"

import { cn } from "@/lib/utils"

/**
 * Link005 - Premium animated link with full background transition
 * Inspired by cursor.com design patterns
 */
export const AnimatedLink = ({
  children,
  href,
  className,
  target = "_blank",
}: {
  children: React.ReactNode
  href: string
  className?: string
  target?: string
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(
        className,
        "group relative flex items-center",
        "text-primary hover:text-primary",
        "before:pointer-events-none before:absolute before:left-0 before:w-full",
        "before:bg-primary/10 dark:before:bg-primary/20",
        "before:content-['']",
        "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left before:top-0",
        "before:z-0 px-2 before:h-full before:scale-x-0 hover:before:scale-x-100",
        "transition-colors duration-300 rounded-md"
      )}
    >
      <span className="relative z-10 font-medium">{children}</span>
      <svg
        className="z-10 ml-[0.6em] mt-[0em] size-[0.55em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  )
}
