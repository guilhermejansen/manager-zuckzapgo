'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  MessageSquare,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  Inbox,
  UserCog,
  Building2,
  Phone,
  MessageCircle,
  Bot,
  Bell,
  FileText,
  Shield,
  Activity,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth-store'

interface SidebarProps {
  locale: string
  userType: 'admin' | 'instance'
}

export function Sidebar({ locale, userType }: SidebarProps) {
  const t = useTranslations('sidebar')
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const user = useAuthStore(state => state.user)

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const adminNavigation = [
    {
      title: t('overview'),
      icon: Home,
      href: `/${locale}/admin/dashboard`,
    },
    {
      title: t('instances'),
      icon: Building2,
      href: `/${locale}/admin/instances`,
    },
    {
      title: t('users'),
      icon: Users,
      href: `/${locale}/admin/users`,
    },
    {
      title: t('messages'),
      icon: MessageSquare,
      href: `/${locale}/admin/messages`,
    },
    {
      title: t('analytics'),
      icon: BarChart3,
      href: `/${locale}/admin/analytics`,
    },
    {
      title: t('webhooks'),
      icon: Zap,
      href: `/${locale}/admin/webhooks`,
    },
    {
      title: t('api_keys'),
      icon: Shield,
      href: `/${locale}/admin/api-keys`,
    },
    {
      title: t('settings'),
      icon: Settings,
      href: `/${locale}/admin/settings`,
    },
  ]

  const instanceNavigation = [
    {
      title: t('overview'),
      icon: Home,
      href: `/${locale}/instance/dashboard`,
    },
    {
      title: t('messages'),
      icon: MessageCircle,
      href: `/${locale}/instance/messages`,
    },
    {
      title: t('groups'),
      icon: Users,
      href: `/${locale}/instance/groups`,
    },
    {
      title: t('contacts'),
      icon: UserPlus,
      href: `/${locale}/instance/contacts`,
    },
    {
      title: t('automations'),
      icon: Bot,
      href: `/${locale}/instance/automations`,
    },
    {
      title: t('broadcasts'),
      icon: Globe,
      href: `/${locale}/instance/broadcasts`,
    },
    {
      title: t('analytics'),
      icon: Activity,
      href: `/${locale}/instance/analytics`,
    },
    {
      title: t('settings'),
      icon: Settings,
      href: `/${locale}/instance/settings`,
    },
  ]

  const navigation = userType === 'admin' ? adminNavigation : instanceNavigation

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          isCollapsed && 'justify-center'
        )}
        title={isCollapsed ? item.title : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href={`/${locale}/${userType}/dashboard`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold">DinastiAPI</span>
          )}
        </Link>
        
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User info */}
      {user && !isCollapsed && (
        <div className="border-b px-4 py-4">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.jid || 'Instance'}</p>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <p>{t('version')} 2.0.0</p>
            <p>&copy; 2024 DinastiAPI</p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex h-full flex-col border-r bg-card transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}