import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface DashboardPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const cookieStore = await cookies()
  const userType = cookieStore.get('user-type')

  // Redirect based on user type
  if (userType?.value === 'admin') {
    redirect(`/${locale}/admin/dashboard`)
  } else if (userType?.value === 'instance') {
    redirect(`/${locale}/instance/dashboard`)
  } else {
    // If no user type, redirect to login
    redirect(`/${locale}/auth/login`)
  }
} 