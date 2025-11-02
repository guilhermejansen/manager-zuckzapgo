"use client"

import { useEffect, useState } from "react"

const SIDEBAR_STATE_KEY = "zuckzapgo-sidebar-collapsed"

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY)
    return stored === "true"
  })

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed))
  }, [isCollapsed])

  const toggle = () => setIsCollapsed((prev) => !prev)
  const collapse = () => setIsCollapsed(true)
  const expand = () => setIsCollapsed(false)

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
  }
}
