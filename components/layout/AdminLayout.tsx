/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

"use client"

import { ReactNode, useState, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Archive,
  ChevronRight,
  Database,
  Globe,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Rss,
  Satellite,
  User,
  Users,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSidebar, rehydrateSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

/**
 * Admin Layout Component
 *
 * Layout principal para páginas administrativas com:
 * - Sidebar de navegação
 * - Header com breadcrumb
 * - Área de conteúdo principal
 * - User menu
 */

interface AdminLayoutProps {
  children: ReactNode
  user: {
    role: "admin" | "user"
  }
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Instâncias",
    href: "/admin/instances",
    icon: Users,
  },
  {
    title: "Campanhas",
    href: "/admin/campaigns",
    icon: Rss,
  },
  {
    title: "Monitor de Eventos",
    href: "/admin/monitoring",
    icon: Satellite,
  },

  {
    title: "Monitor de DLQ",
    href: "/admin/dlq",
    icon: Database,
  },
  {
    title: "Eventos Arquivados",
    href: "/admin/archive",
    icon: Archive,
  },
  {
    title: "Configurações Globais",
    href: "/admin/global",
    icon: Globe,
  },
]

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isCollapsed, toggle } = useSidebar()
  const pathname = usePathname()

  // Rehydrate sidebar state from localStorage after mount
  useEffect(() => {
    rehydrateSidebar()
    setMounted(true)
  }, [])

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/")
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { title, href }
    })

  async function handleLogout() {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <h2 className="text-lg font-bold">ZuckZapGo Manager</h2>
            </div>
            <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r bg-muted/40 transition-all duration-300 ease-in-out lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:z-30 lg:flex lg:h-screen lg:flex-col",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Fade in after hydration to prevent flash
          mounted ? "opacity-100" : "opacity-0"
        )}
        suppressHydrationWarning
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            {!isCollapsed && (
              <div className="flex-1">
                <h2 className="text-lg font-bold">ZuckZapGo Manager</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className={cn(
                "h-8 w-8 transition-transform hover:scale-110",
                isCollapsed && "mx-auto"
              )}
              title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin,opacity] duration-300 ease-in-out",
          isCollapsed ? "lg:ml-16" : "lg:ml-64",
          // Fade in after hydration to prevent flash
          mounted ? "opacity-100" : "opacity-0"
        )}
        suppressHydrationWarning
      >
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 w-full items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
              </Sheet>

              <nav className="hidden items-center space-x-1 text-sm text-muted-foreground sm:flex">
                <Link href="/" className="hover:text-foreground">
                  <Home className="h-4 w-4" />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    <ChevronRight className="mx-1 h-4 w-4" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-foreground">{crumb.title}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-foreground">
                        {crumb.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="flex items-center text-sm sm:hidden">
                <span className="truncate font-medium text-foreground">
                  {breadcrumbs[breadcrumbs.length - 1]?.title || "Dashboard"}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.role}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-full overflow-hidden">{children}</div>
        </main>
      </div>
    </div>
  )
}
