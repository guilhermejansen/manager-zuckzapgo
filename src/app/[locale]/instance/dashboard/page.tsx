'use client';

import { useTranslations } from 'next-intl';
import { 
  MessageCircle, 
  Users, 
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  User,
  Phone,
  Globe,
  Shield,
  Database,
  Rabbit,
  Settings,
  Eye,
  EyeOff,
  Smartphone,
  Activity,
  Zap,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useInstanceStatus } from '@/hooks/use-instance-status';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardTranslations } from '@/hooks/use-dashboard-translations';
import { useAuthSync } from '@/hooks/use-auth-sync';
import { BorderBeam } from '@/components/magicui/border-beam';
import { MagicCard } from '@/components/magicui/magic-card';
import { ShineBorder } from '@/components/magicui/shine-border';
import { GlobalLoading } from '@/components/ui/global-loading';
import { 
  DashboardPageSkeleton,
  ConnectionStatusSkeleton,
  ConfigurationSkeleton,
  MessageFiltersSkeleton,
  StatsGridSkeleton
} from '@/components/ui/dashboard-skeletons';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InstanceDashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

function StatsCard({ title, value, description, icon: Icon, variant = 'default' }: {
  title: string;
  value: string;
  description: string;
  icon: any;
  variant?: 'default' | 'success' | 'warning' | 'error';
}) {
  const colorMap = {
    default: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  };

  return (
    <div className="relative">
      <MagicCard className="h-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 gap-3">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-bold break-words">{value}</span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">{title}</span>
            <span className="text-xs text-muted-foreground hidden lg:block xl:hidden 2xl:block mt-0.5">{description}</span>
          </div>
          <Icon className={cn('h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-6 xl:w-6 2xl:h-8 2xl:w-8 flex-shrink-0', colorMap[variant])} />
        </div>
      </MagicCard>
    </div>
  );
}

function ConnectionStatusCard() {
  const { status, loading, error, refresh } = useInstanceStatus();
  const t = useDashboardTranslations();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <ConnectionStatusSkeleton />;
  }

  if (error) {
    return (
      <div className="relative">
        <MagicCard>
          <CardContent className="p-6">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t('errors.loadError')}</AlertTitle>
              <AlertDescription>{t('errors.loadErrorDescription')}</AlertDescription>
            </Alert>
          </CardContent>
        </MagicCard>
      </div>
    );
  }

  if (!status) return null;

  // Remove device identifier (:XX) and server part (@s.whatsapp.net) for phone display
  const getPhoneNumber = (jid: string) => {
    if (!jid) return '-';
    return jid.split(':')[0].split('@')[0];
  };

  const formatPhoneNumber = (jid: string) => {
    const phoneNumber = getPhoneNumber(jid);
    if (phoneNumber === '-') return '-';
    
    // Format phone number with international pattern
    const formatted = phoneNumber.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '$1 $2 $3-$4');
    return `+${formatted}`;
  };

  return (
    <div className="relative">
      <MagicCard>
        <div className="relative">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status.connected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                {t('connection.title')}
              </div>
              <Button size="sm" variant="outline" onClick={refresh} className="text-xs sm:text-sm">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('connection.refresh')}</span>
                <span className="sm:hidden">↻</span>
              </Button>
            </CardTitle>
            <CardDescription>{t('connection.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border">
              <div className="relative flex-shrink-0">
                {status.avatar_url ? (
                  <img
                    src={status.avatar_url}
                    alt={`${status.name} avatar`}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    {status.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className={cn(
                  'absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white dark:border-gray-800',
                  status.connected ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {status.connected ? (
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white m-0.5" />
                  ) : (
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white m-0.5" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                    {status.name}
                  </h3>
                  <Badge variant={status.connected ? "default" : "destructive"} className="self-start sm:self-auto">
                    {status.connected ? t('connection.connected') : t('connection.disconnected')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="font-mono text-xs sm:text-sm truncate">{formatPhoneNumber(status.jid)}</span>
                </div>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge variant={status.connected ? "default" : "destructive"} className="text-xs sm:text-sm">
                  {status.connected ? t('connection.connected') : t('connection.disconnected')}
                </Badge>
              </div>

              <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Login</span>
                </div>
                <Badge variant={status.loggedIn ? "default" : "secondary"} className="text-xs sm:text-sm">
                  {status.loggedIn ? t('connection.loggedIn') : t('connection.notLoggedIn')}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Instance Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('connection.instanceDetails')}
              </h4>
              
              <div className="grid gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('connection.instanceId')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded border max-w-48 sm:max-w-64 truncate">
                      {status.id}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(status.id, 'instanceId')}
                    >
                      {copiedId === 'instanceId' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('connection.token')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded border max-w-32 sm:max-w-48 truncate">
                      {showToken ? status.token : '**********************'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowToken(!showToken)}
                      title={showToken ? t('connection.hideToken') : t('connection.showToken')}
                    >
                      {showToken ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(status.token, 'token')}
                    >
                      {copiedId === 'token' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('connection.jid')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded border max-w-44 sm:max-w-64 truncate">
                      {status.jid}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(status.jid, 'jid')}
                    >
                      {copiedId === 'jid' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {status.webhook && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('connection.webhook') || 'Webhook'}
                    </span>
                    <Badge variant="secondary" className="gap-1 self-start sm:self-auto">
                      <Globe className="h-3 w-3" />
                      {t('connection.configured')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </MagicCard>
    </div>
  );
}

function ConfigurationSection() {
  const { status, loading } = useInstanceStatus();
  const t = useDashboardTranslations();

  if (loading) {
    return <ConfigurationSkeleton />;
  }

  if (!status) return null;

  const configs = [
    {
      title: t('configuration.proxy'),
      enabled: status.proxy_config?.enabled || false,
      icon: Shield,
      color: 'text-blue-500',
      details: status.proxy_config?.proxy_url ? [
        { label: 'URL', value: status.proxy_config.proxy_url }
      ] : []
    },
    {
      title: t('configuration.s3Storage'),
      enabled: status.s3_config?.enabled || false,
      icon: Database,
      color: 'text-green-500',
      details: status.s3_config?.enabled ? [
        { label: 'Bucket', value: status.s3_config.bucket },
        { label: 'Endpoint', value: status.s3_config.endpoint },
        { label: 'Region', value: status.s3_config.region },
        { label: 'Delivery', value: status.s3_config.media_delivery || 'both' },
        { label: 'Retention Days', value: status.s3_config.retention_days || '30' }
      ] : []
    },
    {
      title: t('configuration.rabbitMQ'),
      enabled: status.rabbitmq_config?.enabled || false,
      icon: Rabbit,
      color: 'text-orange-500',
      details: status.rabbitmq_config?.enabled ? [
        { label: 'Queue', value: status.rabbitmq_config.queue },
        { label: 'Exchange', value: status.rabbitmq_config.exchange },
        { label: 'Events', value: status.rabbitmq_config.events || 'All' },
        { label: 'Type Exchange', value: status.rabbitmq_config.exchange_type || 'topic' },
        { label: 'Type Queue', value: status.rabbitmq_config.queue_type || 'direct' }
      ] : []
    },
    {
      title: t('connection.webhook'),
      enabled: !!status.webhook,
      icon: Globe,
      color: 'text-purple-500',
      details: status.webhook ? [
        { label: 'URL', value: status.webhook },
        { label: 'Events', value: status.events || 'All' }
      ] : []
    }
  ];

  return (
    <MagicCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('configuration.title')}
        </CardTitle>
        <CardDescription>{t('configuration.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6">
          {configs.map((config, index) => (
            <div key={index} className="relative min-h-fit">
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="flex flex-col gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
                    <config.icon className={cn('h-5 w-5 flex-shrink-0', config.color)} />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                      {config.title}
                    </h3>
                  </div>
                  <div className="self-start">
                    <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
                      {config.enabled ? t('configuration.enabled') : t('configuration.disabled')}
                    </Badge>
                  </div>
                </div>
                
                {config.details.length > 0 && (
                  <div className="space-y-3 flex-1">
                    {config.details.map((detail, i) => (
                      <div key={i} className="text-sm">
                        <div className="text-gray-500 dark:text-gray-400 mb-1 font-medium">{detail.label}:</div>
                        <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border break-words">
                          {detail.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {config.enabled && (
                <ShineBorder
                  className="absolute inset-0 rounded-lg"
                  shineColor={config.color.includes('blue') ? '#3b82f6' : 
                            config.color.includes('green') ? '#10b981' : '#f59e0b'}
                  borderWidth={1}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </MagicCard>
  );
}

function MessageFiltersSection() {
  const { status, loading } = useInstanceStatus();
  const t = useDashboardTranslations();

  if (loading) {
    return <MessageFiltersSkeleton />;
  }

  if (!status) return null;

  const filterOptions = [
    { 
      key: 'skip_media_download', 
      label: t('filters.mediaDownload'), 
      icon: Eye, 
      enabled: Boolean(status.skip_media_download === false),
      color: 'text-purple-500'
    },
    { 
      key: 'skip_groups', 
      label: t('filters.groups'), 
      icon: Users, 
      enabled: Boolean(status.skip_groups === false),
      color: 'text-blue-500'
    },
    { 
      key: 'skip_newsletters', 
      label: t('filters.newsletters'), 
      icon: MessageCircle, 
      enabled: Boolean(status.skip_newsletters === false),
      color: 'text-green-500'
    },
    { 
      key: 'skip_broadcasts', 
      label: t('filters.broadcasts'), 
      icon: Send, 
      enabled: Boolean(status.skip_broadcasts === false),
      color: 'text-orange-500'
    },
    { 
      key: 'skip_own_messages', 
      label: t('filters.ownMessages'), 
      icon: MessageCircle, 
      enabled: Boolean(status.skip_own_messages === false),
      color: 'text-pink-500'
    },
    { 
      key: 'skip_calls', 
      label: t('filters.calls'), 
      icon: Phone, 
      enabled: Boolean(status.skip_calls === false),
      color: 'text-red-500'
    },
  ];

  return (
    <MagicCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <EyeOff className="h-5 w-5" />
          {t('filters.title')}
        </CardTitle>
        <CardDescription>{t('filters.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filterOptions.map((option) => (
            <div key={option.key} className="relative">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <option.icon className={cn('h-4 w-4 flex-shrink-0', option.color)} />
                  <span className="text-sm font-medium truncate">{option.label}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={option.enabled ? "default" : "secondary"} className="text-xs">
                    {option.enabled ? t('filters.on') : t('filters.off')}
                  </Badge>
                  <div className={cn(
                    'h-2 w-2 rounded-full',
                    option.enabled ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                </div>
              </div>
              {option.enabled && (
                <ShineBorder
                  className="absolute inset-0 rounded-lg"
                  shineColor="#10b981"
                  borderWidth={1}
                />
              )}
            </div>
          ))}
        </div>
        
        {status.skip_calls === false && (
          <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('filters.callRejectSettings')}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium">{t('filters.type')}:</span>
                <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono self-start">
                  {status.call_reject_type}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{t('filters.message')}:</span>
                <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs break-words">
                  {status.call_reject_message}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </MagicCard>
  );
}

export default function InstanceDashboardPage({ params }: InstanceDashboardPageProps) {
  const { token, isAuthenticated } = useAuthStore();
  const t = useDashboardTranslations();
  const tCommon = useTranslations('common');
  const { status, loading, error } = useInstanceStatus();
  
  // Sincroniza o token com o cliente da API e aguarda hidratação
  const { hasHydrated } = useAuthSync();

  // Se ainda não hidratou, mostra loading
  if (!hasHydrated) {
    return <GlobalLoading size="full" variant="brand" message={tCommon('loading')} />;
  }

  // Se não está autenticado após a hidratação
  if (!isAuthenticated || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertTitle>{t('errors.authRequired')}</AlertTitle>
          <AlertDescription>{t('errors.authRequiredDescription')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Se há erro de autenticação
  if (error && error.includes('autenticado')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{tCommon('error')}</AlertTitle>
          <AlertDescription>
            {error}. {t('errors.authRequiredDescription')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title={tCommon('status')}
            value={status?.connected ? t('connection.connected') : t('connection.disconnected')}
            description={t('connection.subtitle')}
            icon={status?.connected ? Wifi : WifiOff}
            variant={status?.connected ? 'success' : 'error'}
          />
          <StatsCard
            title="Login"
            value={status?.loggedIn ? t('connection.loggedIn') : t('connection.notLoggedIn')}
            description={t('connection.subtitle')}
            icon={User}
            variant={status?.loggedIn ? 'success' : 'warning'}
          />
          <StatsCard
            title="Proxy"
            value={status?.proxy_config?.enabled ? t('configuration.enabled') : t('configuration.disabled')}
            description={t('configuration.proxy')}
            icon={Shield}
            variant={status?.proxy_config?.enabled ? 'success' : 'default'}
          />
          <StatsCard
            title="S3"
            value={status?.s3_config?.enabled ? t('configuration.enabled') : t('configuration.disabled')}
            description={t('configuration.s3Storage')}
            icon={Database}
            variant={status?.s3_config?.enabled ? 'success' : 'default'}
          />
          <StatsCard
            title="RabbitMQ"
            value={status?.rabbitmq_config?.enabled ? t('configuration.enabled') : t('configuration.disabled')}
            description={t('configuration.rabbitMQ')}
            icon={Rabbit}
            variant={status?.rabbitmq_config?.enabled ? 'success' : 'default'}
          />
          <StatsCard
            title="Webhook"
            value={status?.webhook ? t('connection.configured') : t('configuration.disabled')}
            description={t('connection.webhook')}
            icon={Globe}
            variant={status?.webhook ? 'success' : 'default'}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/instance/settings" className="flex-1">
              <Button className="w-full" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                {tCommon('manage')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 sm:space-y-8">
          {/* Connection Status */}
          <div>
            <ConnectionStatusCard />
          </div>

          {/* Configuration Section */}
          <div>
            <ConfigurationSection />
          </div>
        </div>

        {/* Message Filters - Full width */}
        <div className="mt-6 sm:mt-8">
          <MessageFiltersSection />
        </div>
      </div>
    </div>
  );
}