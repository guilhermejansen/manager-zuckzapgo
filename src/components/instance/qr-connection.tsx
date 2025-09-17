'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { QrCode, RefreshCw, Smartphone, Wifi, WifiOff, CheckCircle2, XCircle, Loader2, Settings, LogOut, Unplug } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useInstanceSettingsStore } from '@/store/instance-settings-store';
import { getQRCode, connectInstance, disconnectInstance, logoutInstance, fetchInstanceStatus } from '@/lib/api/instance';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Supported event types from backend
const SUPPORTED_EVENT_TYPES = [
  "Message",
  "UndecryptableMessage", 
  "Receipt",
  "MediaRetry",
  "ReadReceipt",
  "Star",
  "LabelAssociationChat",
  "LabelEdit",
  "GroupInfo",
  "JoinedGroup",
  "Picture",
  "BlocklistChange",
  "Blocklist",
  "Connected",
  "Disconnected",
  "ConnectFailure",
  "KeepAliveRestored",
  "KeepAliveTimeout",
  "LoggedOut",
  "ClientOutdated",
  "TemporaryBan",
  "StreamError",
  "StreamReplaced",
  "PairSuccess",
  "PairError",
  "QR",
  "QRScannedWithoutMultidevice",
  "PrivacySettings",
  "PushNameSetting",
  "UserAbout",
  "AppState",
  "AppStateSyncComplete",
  "HistorySync",
  "OfflineSyncCompleted",
  "OfflineSyncPreview",
  "CallOffer",
  "CallAccept",
  "CallTerminate",
  "CallOfferNotice",
  "CallRelayLatency",
  "Presence",
  "ChatPresence",
  "IdentityChange",
  "CATRefreshError",
  "NewsletterJoin",
  "NewsletterLeave",
  "NewsletterMuteChange",
  "NewsletterLiveUpdate",
  "FBMessage",
  "All"
];

export function QRConnection() {
  const t = useTranslations('instanceSettings.session');
  const tCommon = useTranslations('common');
  
  const { 
    status, 
    qrCode, 
    isConnecting,
    setQRCode, 
    setIsConnecting,
    setStatus 
  } = useInstanceSettingsStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Connection options
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["All"]);
  const [immediateConnection, setImmediateConnection] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-refresh QR code every 30 seconds
  useEffect(() => {
    if (!status?.connected && !isConnecting) {
      const interval = setInterval(() => {
        handleRefreshQR();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [status?.connected, isConnecting]);

  const handleRefreshQR = async () => {
    if (isConnecting || status?.connected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getQRCode();
      setQRCode(result.QRCode);
      setLastUpdate(new Date());
      toast.success('QR Code atualizado');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar QR Code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connectInstance(selectedEvents, immediateConnection);
      toast.success('Conectado com sucesso');
      
      // Refresh status to get updated data
      const updatedStatus = await fetchInstanceStatus();
      setStatus(updatedStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conectar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);
    
    try {
      await disconnectInstance();
      toast.success('Desconectado com sucesso');
      
      // Refresh status to get updated data
      const updatedStatus = await fetchInstanceStatus();
      setStatus(updatedStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desconectar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);
    
    try {
      await logoutInstance();
      toast.success('Logout realizado com sucesso');
      
      // Refresh status to get updated data
      const updatedStatus = await fetchInstanceStatus();
      setStatus(updatedStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Event selection handlers
  const handleEventToggle = (event: string, checked: boolean) => {
    if (event === "All") {
      setSelectedEvents(checked ? ["All"] : []);
    } else {
      setSelectedEvents(prev => {
        const filtered = prev.filter(e => e !== "All");
        if (checked) {
          return [...filtered, event];
        } else {
          return filtered.filter(e => e !== event);
        }
      });
    }
  };

  const handleSelectAllEvents = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(["All"]);
    } else {
      setSelectedEvents([]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConnectionStatus = () => {
    if (isConnecting) {
      return {
        icon: Loader2,
        text: 'Conectando...',
        variant: 'default' as const,
        color: 'text-blue-500',
        spin: true
      };
    }
    
    if (status?.connected) {
      return {
        icon: CheckCircle2,
        text: t('connectionStatus'),
        variant: 'default' as const,
        color: 'text-green-500',
        spin: false
      };
    }
    
    return {
      icon: XCircle,
      text: 'Desconectado',
      variant: 'secondary' as const,
      color: 'text-red-500',
      spin: false
    };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {t('qrCode')}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={connectionStatus.variant} className={cn('gap-1', connectionStatus.color)}>
              <connectionStatus.icon className={cn('h-3 w-3', connectionStatus.spin && 'animate-spin')} />
              {connectionStatus.text}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefreshQR}
              disabled={loading || isConnecting}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              {tCommon('refresh')}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Configure os eventos e conecte sua instância WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        {status?.connected && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Conectado com sucesso!</strong> Sua instância está ativa e funcionando.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code para Conexão
            </h4>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {qrCode ? (
                  <div className="relative p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Image
                      src={`data:image/png;base64,${qrCode}`}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                      priority
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-52 h-52 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    {loading ? (
                      <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                        <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <QrCode className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-sm text-muted-foreground">Clique em atualizar para gerar</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {lastUpdate && (
                <p className="text-xs text-muted-foreground">
                  Última atualização: {formatTime(lastUpdate)}
                </p>
              )}

              <Button 
                onClick={handleRefreshQR}
                variant="outline"
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
                Atualizar QR Code
              </Button>
            </div>
          </div>

          {/* Connection Options Section */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('connectionOptions')}
            </h4>

            {/* Immediate Connection Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="immediate"
                  checked={immediateConnection}
                  onCheckedChange={(checked) => setImmediateConnection(checked === 'indeterminate' ? true : checked as boolean)}
                />
                <Label htmlFor="immediate" className="text-sm font-medium">
                  {t('immediateConnection')}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Conecta imediatamente após o pareamento
              </p>
            </div>

            <Separator />

            {/* Events Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('selectEvents')}:</Label>
              
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {/* Select All Option */}
                <div className="flex items-center space-x-2 font-medium">
                  <Checkbox
                    id="all-events"
                    checked={selectedEvents.includes("All")}
                    onCheckedChange={handleSelectAllEvents}
                  />
                  <Label htmlFor="all-events" className="text-sm">
                    {t('allEvents')}
                  </Label>
                </div>
                
                <Separator />
                
                {/* Individual Events */}
                <div className="space-y-1">
                  {SUPPORTED_EVENT_TYPES.filter(event => event !== "All").map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={selectedEvents.includes(event) || selectedEvents.includes("All")}
                        onCheckedChange={(checked) => handleEventToggle(event, checked as boolean)}
                        disabled={selectedEvents.includes("All")}
                      />
                      <Label htmlFor={event} className="text-xs">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Eventos selecionados: {selectedEvents.length === 1 && selectedEvents[0] === "All" ? "Todos" : selectedEvents.length}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Session Control Buttons */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Controle de Sessão
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={handleConnect}
              disabled={selectedEvents.length === 0 || loading || isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  {tCommon('connect')}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              disabled={loading || isDisconnecting}
              className="w-full"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Desconectando...
                </>
              ) : (
                <>
                  <Unplug className="h-4 w-4 mr-2" />
                  {tCommon('disconnect')}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="destructive"
              disabled={loading || isLoggingOut}
              className="w-full"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fazendo logout...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
            <p><strong>💡 Dicas:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Conectar:</strong> Inicia conexão com eventos selecionados</li>
              <li><strong>Desconectar:</strong> Para a conexão mas mantém a sessão</li>
              <li><strong>Logout:</strong> Encerra tudo (precisará escanear QR novamente)</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Como conectar:
          </h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              Configure os eventos e opções desejadas
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              Abra o WhatsApp no seu celular
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              Vá em Configurações → Dispositivos conectados
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
              Escaneie o QR Code e clique em "Conectar"
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}