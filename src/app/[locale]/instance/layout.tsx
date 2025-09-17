import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

interface InstanceLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function InstanceLayout({
  children,
  params
}: InstanceLayoutProps) {
  const { locale } = await params
  
  // This check happens in middleware too, but we double-check here
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  const userType = cookieStore.get('user-type')

  if (!authToken || !userType) {
    redirect(`/${locale}/auth/login`)
  }

  // Ensure only instance users can access instance routes
  if (userType.value !== 'instance') {
    redirect(`/${locale}/auth/login`)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        locale={locale} 
        userType={userType.value as 'admin' | 'instance'} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header locale={locale} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 