"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarStore {
  isCollapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
    }),
    {
      name: "sidebar-state",
    }
  )
)

export const useSidebar = () => {
  return useSidebarStore()
}
