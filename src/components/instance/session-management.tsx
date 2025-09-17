'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Wifi, 
  WifiOff, 
  LogOut, 
  Power, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInstanceSettingsStore } from '@/store/instance-settings-store';
import { connectInstance, disconnectInstance, logoutInstance, fetchInstanceStatus } from '@/lib/api/instance';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SessionManagement() {
  const t = useTranslations('instanceSettings.session');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('instanceSettings.messages');
  
  const { 
    status, 
    isConnecting,
    isDisconnecting,
    isLoggingOut,
    setStatus,
    setIsConnecting,
    setIsDisconnecting,
    setIsLoggingOut 
  } = useInstanceSettingsStore();
  
  const [refreshing, setRefreshing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Connect with default events
      await connectInstance(["All"], true);
      
      // Refresh status to get updated data
      await refreshStatus();
      
      toast.success(tMessages('connectionSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : tMessages('connectionError');
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    
    try {
      await disconnectInstance();
      
      // Refresh status to get updated data
      await refreshStatus();
      
      toast.success(tMessages('disconnectionSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : tMessages('disconnectionError');
      toast.error(errorMessage);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await logoutInstance();
      
      // Refresh status to get updated data
      await refreshStatus();
      
      toast.success(tMessages('logoutSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : tMessages('logoutError');
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      const newStatus = await fetchInstanceStatus();
      setStatus(newStatus);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getConnectionStatusInfo = () => {
    if (!status) {
      return {
        icon: XCircle,
        text: t('unknownStatus'),
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        variant: 'secondary' as const
      };
    }

    if (status.connected && status.loggedIn) {
      return {
        icon: CheckCircle2,
        text: t('connectedAndLoggedIn'),
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        variant: 'default' as const
      };
    }

    if (status.connected && !status.loggedIn) {
      return {
        icon: AlertTriangle,
        text: t('connectedNotLoggedIn'),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        variant: 'outline' as const
      };
    }

    return {
      icon: XCircle,
      text: t('disconnected'),
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      variant: 'destructive' as const
    };
  };

  const connectionInfo = getConnectionStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            {t('sessionControl')}
          </div>
          <Badge variant={connectionInfo.variant} className={cn('gap-1', connectionInfo.color)}>
            <connectionInfo.icon className="h-3 w-3" />
            {connectionInfo.text}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('sessionControlSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Display */}
        <div className={cn('p-4 rounded-lg border', connectionInfo.bgColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <connectionInfo.icon className={cn('h-6 w-6', connectionInfo.color)} />
              <div>
                <h3 className={cn('font-semibold', connectionInfo.color)}>
                  {connectionInfo.text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {status?.connected 
                    ? `Conectado em ${status.jid ? status.jid.split('@')[0] : 'N/A'}`
                    : 'Instância não está conectada ao WhatsApp'
                  }
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStatus}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t('sessionActions')}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={isConnecting || status?.connected || isDisconnecting || isLoggingOut}
              className="h-auto p-4 flex flex-col items-center gap-2"
              variant="default"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{t('connecting')}</span>
                </>
              ) : (
                <>
                  <Wifi className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('connect')}</span>
                </>
              )}
            </Button>

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnect}
              disabled={isDisconnecting || !status?.connected || isConnecting || isLoggingOut}
              className="h-auto p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{t('disconnecting')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('disconnect')}</span>
                </>
              )}
            </Button>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut || !status?.connected || isConnecting || isDisconnecting}
              className="h-auto p-4 flex flex-col items-center gap-2"
              variant="destructive"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{t('loggingOut')}</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('logout')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Action Descriptions */}
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t('connect')}</span>
              </div>
              <p className="text-xs">
                {t('connectDescription')}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t('disconnect')}</span>
              </div>
              <p className="text-xs">
                {t('disconnectDescription')}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-red-500" />
                <span className="font-medium">{t('logout')}</span>
              </div>
              <p className="text-xs">
                {t('logoutDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> {t('importantNote')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}