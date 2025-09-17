import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft,
  Phone,
  Webhook,
  Settings,
  MessageCircle,
  Users,
  Newspaper,
  Activity,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  QrCode,
  Copy,
  Power,
  PowerOff,
  Trash
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { fetchInstanceDetails } from '@/lib/api/admin'
import { apiClient } from '@/lib/api/client'

interface InstanceDetailPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

async function InstanceDetails({ instanceId }: { instanceId: string }) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')
  
  if (!authToken?.value) {
    return <div>No authorization</div>
  }

  const instance = await fetchInstanceDetails(authToken.value, instanceId)
  
  if (!instance) {
    notFound()
  }

  // Get additional stats for the instance
  apiClient.setToken(authToken.value)
  
  let sessionStatus = null
  let groupCount = 0
  let contactCount = 0
  
  try {
    // These would be instance-specific API calls
    sessionStatus = await apiClient.getSessionStatus()
  } catch (error) {
    console.error('Failed to fetch session status:', error)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <MagicCard>
        <Card className="border-0 bg-transparent">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>WhatsApp connection details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {instance.connected && instance.loggedIn ? (
                    <>
                      <Wifi className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Connected</span>
                    </>
                  ) : instance.connected && !instance.loggedIn ? (
                    <>
                      <QrCode className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Awaiting QR Code</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Disconnected</span>
                    </>
                  )}
                </div>
                <Badge variant={instance.connected ? "default" : "destructive"}>
                  {instance.connected ? "Online" : "Offline"}
                </Badge>
              </div>
              
              {instance.jid && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Number</span>
                    <span className="font-medium">{instance.jid.split('@')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instance ID</span>
                    <span className="font-medium font-mono text-xs">{instance.id}</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {instance.connected && !instance.loggedIn && (
                  <Button size="sm" variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    Show QR Code
                  </Button>
                )}
                {instance.connected ? (
                  <Button size="sm" variant="outline" className="text-destructive">
                    <PowerOff className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Power className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </MagicCard>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={0} />
              </div>
              <p className="text-xs text-muted-foreground">Total sent</p>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={groupCount} />
              </div>
              <p className="text-xs text-muted-foreground">Active groups</p>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={contactCount} />
              </div>
              <p className="text-xs text-muted-foreground">Total contacts</p>
            </CardContent>
          </Card>
        </MagicCard>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <MagicCard>
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic instance configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instance Name</label>
                  <input
                    type="text"
                    value={instance.name}
                    className="w-full px-3 py-2 border rounded-md"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={instance.token}
                      className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                      readOnly
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(instance.token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <MagicCard>
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>Configure webhook for receiving events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook URL</label>
                  <input
                    type="url"
                    value={instance.webhook || ''}
                    placeholder="https://your-server.com/webhook"
                    className="w-full px-3 py-2 border rounded-md"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Events</label>
                  <input
                    type="text"
                    value={instance.events || 'All events'}
                    className="w-full px-3 py-2 border rounded-md"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          </MagicCard>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <MagicCard>
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Message Filters</CardTitle>
                <CardDescription>Configure what messages to skip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Skip Media Download</p>
                      <p className="text-sm text-muted-foreground">Don't download media files</p>
                    </div>
                    <Badge variant={instance.skip_media_download ? "default" : "secondary"}>
                      {instance.skip_media_download ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Skip Groups</p>
                      <p className="text-sm text-muted-foreground">Ignore group messages</p>
                    </div>
                    <Badge variant={instance.skip_groups ? "default" : "secondary"}>
                      {instance.skip_groups ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Skip Newsletters</p>
                      <p className="text-sm text-muted-foreground">Ignore newsletter messages</p>
                    </div>
                    <Badge variant={instance.skip_newsletters ? "default" : "secondary"}>
                      {instance.skip_newsletters ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Skip Broadcasts</p>
                      <p className="text-sm text-muted-foreground">Ignore broadcast messages</p>
                    </div>
                    <Badge variant={instance.skip_broadcasts ? "default" : "secondary"}>
                      {instance.skip_broadcasts ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Skip Own Messages</p>
                      <p className="text-sm text-muted-foreground">Ignore messages sent by this instance</p>
                    </div>
                    <Badge variant={instance.skip_own_messages ? "default" : "secondary"}>
                      {instance.skip_own_messages ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <MagicCard>
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Storage Configuration</CardTitle>
                <CardDescription>S3 and message queue settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">S3 Storage</h4>
                    <Badge variant={instance.s3_config?.enabled ? "default" : "secondary"}>
                      {instance.s3_config?.enabled ? "Configured" : "Not configured"}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">RabbitMQ</h4>
                    <Badge variant={instance.rabbitmq_config?.enabled ? "default" : "secondary"}>
                      {instance.rabbitmq_config?.enabled ? "Configured" : "Not configured"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MagicCard>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <MagicCard>
        <Card className="border-0 bg-transparent border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Instance
            </Button>
          </CardContent>
        </Card>
      </MagicCard>
    </div>
  )
}

export default async function InstanceDetailPage({ params }: InstanceDetailPageProps) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'admin.instances' })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/instances`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instance Details</h1>
          <p className="text-muted-foreground">
            Manage and configure WhatsApp instance
          </p>
        </div>
      </div>

      {/* Instance Details */}
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      }>
        <InstanceDetails instanceId={id} />
      </Suspense>
    </div>
  )
}