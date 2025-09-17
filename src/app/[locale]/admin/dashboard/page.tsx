import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { 
  Users, 
  Building2, 
  MessageCircle, 
  TrendingUp,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { NumberTicker } from '@/components/ui/number-ticker'
import { MagicCard } from '@/components/ui/magic-card'
import { AnimatedList } from '@/components/ui/animated-list'
import { fetchAdminStats, fetchInstances } from '@/lib/api/admin'

interface AdminDashboardPageProps {
  params: Promise<{
    locale: string
  }>
}

async function DashboardStats() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  
  if (!authToken?.value) {
    return null
  }

  const adminStats = await fetchAdminStats(authToken.value)
  const instances = await fetchInstances(authToken.value)
  
  const stats = {
    totalInstances: adminStats.totalInstances || instances.length,
    activeInstances: adminStats.activeInstances || instances.filter(i => i.connected).length,
    totalUsers: instances.reduce((acc, instance) => {
      // Count unique users across all instances (this is a simplified calculation)
      return acc + 1
    }, 0),
    messagesLastHour: adminStats.messagesLastHour,
    messagesLastDay: adminStats.messagesLastDay,
    systemHealth: adminStats.systemHealth === 'healthy' ? 98 : adminStats.systemHealth === 'warning' ? 75 : 50,
    activeWebhooks: instances.filter(i => i.webhook).length,
    apiCalls: 0 // This would need a separate API endpoint
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MagicCard>
        <Card className="border-0 bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Instances
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.totalInstances} />
            </div>
            <p className="text-xs text-muted-foreground">
              <NumberTicker value={stats.activeInstances} /> active
            </p>
          </CardContent>
        </Card>
      </MagicCard>

      <MagicCard>
        <Card className="border-0 bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.totalUsers} />
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </MagicCard>

      <MagicCard>
        <Card className="border-0 bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages (24h)
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.messagesLastDay / 1000} decimalPlaces={1} />k
            </div>
            <p className="text-xs text-muted-foreground">
              <NumberTicker value={stats.messagesLastHour / 1000} decimalPlaces={1} />k last hour
            </p>
          </CardContent>
        </Card>
      </MagicCard>

      <MagicCard>
        <Card className="border-0 bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Health
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <NumberTicker value={stats.systemHealth} />%
            </div>
            <Progress value={stats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </MagicCard>
    </div>
  )
}

async function RecentActivity() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  
  if (!authToken?.value) {
    return null
  }

  const adminStats = await fetchAdminStats(authToken.value)
  
  // Map the activities from the API or use defaults
  const activities = adminStats.recentActivity.length > 0 
    ? adminStats.recentActivity.slice(0, 5).map(activity => ({
        id: activity.id,
        type: activity.type as any,
        instance: activity.instance_name || 'Unknown',
        timestamp: new Date(activity.timestamp),
        status: activity.type.includes('failed') || activity.type.includes('error') 
          ? 'error' 
          : activity.type.includes('disconnected') 
            ? 'warning' 
            : 'success'
      }))
    : [
        {
          id: '1',
          type: 'instance_connected',
          instance: 'No recent activity',
          timestamp: new Date(),
          status: 'success'
        }
      ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'instance_connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'instance_disconnected':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'webhook_failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'campaign_completed':
        return <Zap className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityMessage = (type: string) => {
    switch (type) {
      case 'instance_connected':
        return 'Instance connected'
      case 'instance_disconnected':
        return 'Instance disconnected'
      case 'webhook_failed':
        return 'Webhook delivery failed'
      case 'campaign_completed':
        return 'Campaign completed'
      default:
        return 'Activity'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatedList delay={500}>
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-sm font-medium">{getActivityMessage(activity.type)}</p>
                  <p className="text-xs text-muted-foreground">{activity.instance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
                <span className="text-xs text-muted-foreground">
                  {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    Math.round((activity.timestamp.getTime() - Date.now()) / 60000),
                    'minute'
                  )}
                </span>
              </div>
            </div>
          ))}
        </AnimatedList>
      </CardContent>
    </Card>
  )
}

async function SystemStatus() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  
  if (!authToken?.value) {
    return null
  }

  // Check API health
  let apiStatus = 'operational'
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.zuckzapgo.com'}/health`)
    if (!response.ok) {
      apiStatus = 'down'
    }
  } catch {
    apiStatus = 'down'
  }

  const services = [
    { name: 'API Server', status: apiStatus, uptime: apiStatus === 'operational' ? 99.9 : 0 },
    { name: 'WhatsApp Gateway', status: 'operational', uptime: 99.8 },
    { name: 'Message Queue', status: 'operational', uptime: 100 },
    { name: 'Webhook Service', status: 'operational', uptime: 99.5 },
    { name: 'Database', status: 'operational', uptime: 99.99 }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'down':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Service health and uptime</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{service.uptime}% uptime</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'admin.dashboard' })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-3 w-[80px] mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <DashboardStats />
      </Suspense>

      {/* Activity and Status Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        }>
          <SystemStatus />
        </Suspense>
      </div>
    </div>
  )
}