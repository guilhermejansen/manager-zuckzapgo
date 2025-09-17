'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Wifi, 
  Shield, 
  Database, 
  Rabbit, 
  Filter,
  Smartphone,
  Save,
  RotateCcw,
  TestTube,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GlobalLoading } from '@/components/ui/global-loading';

// Custom Components
import { QRConnection } from '@/components/instance/qr-connection';
import { PhonePairing } from '@/components/instance/phone-pairing';
import { SessionManagement } from '@/components/instance/session-management';

// Store and API
import { useInstanceSettingsStore, populateFormDataFromStatus } from '@/store/instance-settings-store';
import { useAuthStore } from '@/store/auth-store';
import { fetchInstanceStatus } from '@/lib/api/instance';

// Utils
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InstanceSettingsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function InstanceSettingsPage({ params }: InstanceSettingsPageProps) {
  const router = useRouter();
  const t = useTranslations('instanceSettings');
  const tCommon = useTranslations('common');
  
  const { token, isAuthenticated } = useAuthStore();
  const { 
    status, 
    loading, 
    error, 
    activeTab,
    hasUnsavedChanges,
    setStatus, 
    setLoading, 
    setError,
    setActiveTab,
    updateFormData,
    setHasUnsavedChanges,
    reset 
  } = useInstanceSettingsStore();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Load instance status on mount
  useEffect(() => {
    const loadInstanceStatus = async () => {
      if (!isAuthenticated || !token) {
        setError('Não autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const instanceStatus = await fetchInstanceStatus();
        setStatus(instanceStatus);
        
        // Populate form with current status
        const formData = populateFormDataFromStatus(instanceStatus);
        Object.entries(formData).forEach(([section, data]) => {
          updateFormData(section as any, data);
        });
        
        setHasUnsavedChanges(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar status da instância';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadInstanceStatus();
  }, [isAuthenticated, token, setStatus, setLoading, setError, updateFormData, setHasUnsavedChanges]);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // TODO: Implement save functionality
      toast.success(t('messages.saveSuccess'));
      setHasUnsavedChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('messages.saveError');
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAll = async () => {
    setTesting(true);
    try {
      // TODO: Implement test functionality
      toast.success(t('messages.testSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('messages.testError');
      toast.error(errorMessage);
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    if (hasUnsavedChanges) {
      const confirmReset = confirm('Tem certeza que deseja descartar as alterações?');
      if (!confirmReset) return;
    }
    
    reset();
    toast.info('Configurações resetadas');
  };

  const getConnectionStatusBadge = () => {
    if (!status) return null;
    
    if (status.connected && status.loggedIn) {
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Conectado
        </Badge>
      );
    }
    
    if (status.connected && !status.loggedIn) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Conectado (Não logado)
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Desconectado
      </Badge>
    );
  };

  if (initialLoad) {
    return <GlobalLoading size="full" variant="brand" message={tCommon('loading')} />;
  }

  if (!isAuthenticated || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você precisa estar autenticado para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {tCommon('back')}
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {t('title')}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {t('subtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {getConnectionStatusBadge()}
              {status && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{status.name}</p>
                  <p className="text-xs text-blue-200">ID: {status.id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button 
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || saving || loading}
            className="flex-1 sm:flex-none"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('actions.save')}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleTestAll}
            disabled={testing || loading}
            className="flex-1 sm:flex-none"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                {t('actions.testAll')}
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('actions.reset')}
          </Button>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você tem alterações não salvas. Lembre-se de salvar antes de sair da página.
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="general" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.general')}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="session" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.session')}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="proxy" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.proxy')}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="s3" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.s3')}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="rabbitmq" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Rabbit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.rabbitmq')}</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="skips" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4 px-6"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('tabs.skips')}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* General Tab */}
              <TabsContent value="general" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('general.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('general.subtitle')}</p>
                  </div>
                  
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      As configurações gerais serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* Session Tab */}
              <TabsContent value="session" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('session.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('session.subtitle')}</p>
                  </div>

                  {/* Session Management Controls */}
                  <SessionManagement />

                  {/* Connection Methods */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {t('session.qrCode')}
                      </h4>
                      <QRConnection />
                    </div>
                    
                    <div>
                      <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {t('session.phoneCode')}
                      </h4>
                      <PhonePairing />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Proxy Tab */}
              <TabsContent value="proxy" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('proxy.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('proxy.subtitle')}</p>
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      As configurações de proxy serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* S3 Tab */}
              <TabsContent value="s3" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('s3.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('s3.subtitle')}</p>
                  </div>
                  
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      As configurações S3 serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* RabbitMQ Tab */}
              <TabsContent value="rabbitmq" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('rabbitmq.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('rabbitmq.subtitle')}</p>
                  </div>
                  
                  <Alert>
                    <Rabbit className="h-4 w-4" />
                    <AlertDescription>
                      As configurações RabbitMQ serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* Skips Tab */}
              <TabsContent value="skips" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('skips.title')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t('skips.subtitle')}</p>
                  </div>
                  
                  <Alert>
                    <Filter className="h-4 w-4" />
                    <AlertDescription>
                      As configurações de filtros serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}