'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth-store';
import { fetchInstances } from '@/lib/api/admin';
import { UserInstance } from '@/types';
import { 
  Search, 
  Filter, 
  Plus, 
  Wifi, 
  WifiOff, 
  Phone,
  Globe,
  Shield,
  Database,
  MessageSquare,
  Calendar,
  Eye,
  Edit,
  Trash2,
  QrCode,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Webhook,
  Cloud,
  Rabbit,
  MoreHorizontal,
  RefreshCw,
  Download,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MagicCard } from '@/components/ui/magic-card';
import { NumberTicker } from '@/components/ui/number-ticker';
import { AnimatedList } from '@/components/ui/animated-list';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface AdminInstancesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

type FilterType = 'all' | 'connected' | 'disconnected' | 'withWebhook' | 'withProxy' | 'withS3' | 'withRabbitMQ';

export default function AdminInstancesPage({ params }: AdminInstancesPageProps) {
  const t = useTranslations('admin.instances');
  const tCommon = useTranslations('common');
  
  const { token } = useAuthStore();
  const [instances, setInstances] = useState<UserInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; instance: UserInstance | null }>({
    open: false,
    instance: null
  });

  const loadInstances = async (showRefresh = false) => {
    if (!token) return;
    
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchInstances(token);
      setInstances(data);
    } catch (error) {
      console.error('Failed to load instances:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, [token]);

  const filteredInstances = useMemo(() => {
    let filtered = instances;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        instance =>
          instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instance.jid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instance.token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'connected':
        filtered = filtered.filter(instance => instance.connected);
        break;
      case 'disconnected':
        filtered = filtered.filter(instance => !instance.connected);
        break;
      case 'withWebhook':
        filtered = filtered.filter(instance => instance.webhook);
        break;
      case 'withProxy':
        filtered = filtered.filter(instance => instance.proxy_config?.enabled);
        break;
      case 'withS3':
        filtered = filtered.filter(instance => instance.s3_config?.enabled);
        break;
      case 'withRabbitMQ':
        filtered = filtered.filter(instance => instance.rabbitmq_config?.enabled);
        break;
    }

    return filtered;
  }, [instances, searchTerm, filterType]);

  const stats = useMemo(() => {
    return {
      total: instances.length,
      connected: instances.filter(i => i.connected).length,
      withWebhook: instances.filter(i => i.webhook).length,
      withProxy: instances.filter(i => i.proxy_config?.enabled).length,
      withS3: instances.filter(i => i.s3_config?.enabled).length,
      withRabbitMQ: instances.filter(i => i.rabbitmq_config?.enabled).length,
    };
  }, [instances]);

  const getStatusBadge = (instance: UserInstance) => {
    if (instance.connected && instance.loggedIn) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('status.connected')}</Badge>;
    } else if (instance.connected) {
      return <Badge variant="secondary">{t('status.loggedOut')}</Badge>;
    } else {
      return <Badge variant="destructive">{t('status.disconnected')}</Badge>;
    }
  };

  const getPhoneNumber = (jid: string) => {
    if (!jid) return '-';
    // Remove device identifier (:XX) and server part (@s.whatsapp.net)
    return jid.split(':')[0].split('@')[0];
  };

  const formatExpiration = (expiration: number) => {
    if (!expiration || expiration === 0) return '-';
    const date = new Date(expiration * 1000);
    return date.toLocaleDateString();
  };

  const renderAvatar = (instance: UserInstance) => {
    const hasAvatar = instance.avatar_url && instance.avatar_url !== '';
    const initials = instance.name.substring(0, 2).toUpperCase();
    
    if (hasAvatar) {
      return (
        <img
          src={instance.avatar_url}
          alt={`${instance.name} avatar`}
          className="h-8 w-8 rounded-full object-cover"
          onError={(e) => {
            // Fallback para iniciais se a imagem falhar
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      );
    }
    
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium">
        {initials}
      </div>
    );
  };

  const getSkipOptions = (instance: UserInstance) => {
    const skipCount = [
      instance.skip_media_download,
      instance.skip_groups,
      instance.skip_newsletters,
      instance.skip_broadcasts,
      instance.skip_own_messages,
      instance.skip_calls
    ].filter(Boolean).length;
    
    return skipCount;
  };

  const handleDeleteInstance = (instance: UserInstance) => {
    setDeleteDialog({ open: true, instance });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.instance || !token) return;
    
    try {
      // Here you would call the delete API
      console.log('Deleting instance:', deleteDialog.instance.id);
      await loadInstances();
    } catch (error) {
      console.error('Failed to delete instance:', error);
    } finally {
      setDeleteDialog({ open: false, instance: null });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadInstances(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {tCommon('refresh')}
          </Button>
          <ShimmerButton>
            <Plus className="h-4 w-4 mr-2" />
            {t('createInstance')}
          </ShimmerButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('table.name')} Total
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={stats.total} />
              </div>
              <p className="text-xs text-muted-foreground">
                <NumberTicker value={stats.connected} /> {t('status.connected').toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('table.webhook')}
              </CardTitle>
              <Webhook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={stats.withWebhook} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('config.configured')}
              </p>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('table.s3')}
              </CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={stats.withS3} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('config.enabled')}
              </p>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard>
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('table.rabbitmq')}
              </CardTitle>
              <Rabbit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={stats.withRabbitMQ} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('config.enabled')}
              </p>
            </CardContent>
          </Card>
        </MagicCard>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all')}</SelectItem>
                <SelectItem value="connected">{t('filters.connected')}</SelectItem>
                <SelectItem value="disconnected">{t('filters.disconnected')}</SelectItem>
                <SelectItem value="withWebhook">{t('filters.withWebhook')}</SelectItem>
                <SelectItem value="withProxy">{t('filters.withProxy')}</SelectItem>
                <SelectItem value="withS3">{t('filters.withS3')}</SelectItem>
                <SelectItem value="withRabbitMQ">{t('filters.withRabbitMQ')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredInstances.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">{t('noInstancesFound')}</h3>
              <p className="text-muted-foreground">{t('noInstancesDescription')}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b bg-muted/50">
                      <TableHead className="w-[250px] min-w-[200px]">{t('table.name')}</TableHead>
                      <TableHead className="w-[140px] min-w-[120px]">{t('table.status')}</TableHead>
                      <TableHead className="w-[120px] min-w-[100px]">{t('table.phone')}</TableHead>
                      <TableHead className="w-[80px] text-center">{t('table.webhook')}</TableHead>
                      <TableHead className="w-[80px] text-center">{t('table.proxy')}</TableHead>
                      <TableHead className="w-[80px] text-center">{t('table.s3')}</TableHead>
                      <TableHead className="w-[80px] text-center">{t('table.rabbitmq')}</TableHead>
                      <TableHead className="w-[120px] text-center">{t('table.events')}</TableHead>
                      <TableHead className="w-[120px] text-center">{t('table.expiration')}</TableHead>
                      <TableHead className="w-[80px] text-center">{t('table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  <AnimatedList delay={100}>
                    {filteredInstances.map((instance, index) => (
                      <TableRow key={instance.id} className="group hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {renderAvatar(instance)}
                              {/* Fallback div (hidden by default, shown when image fails) */}
                              <div 
                                className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-medium absolute top-0 left-0"
                                style={{ display: 'none' }}
                              >
                                {instance.name.substring(0, 2).toUpperCase()}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{instance.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {instance.token.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(instance)}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {instance.connected ? (
                                <Wifi className="h-3 w-3 text-green-500" />
                              ) : (
                                <WifiOff className="h-3 w-3 text-red-500" />
                              )}
                              {instance.connected ? t('status.online') : t('status.offline')}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {getPhoneNumber(instance.jid) !== '-' ? 
                                `+${getPhoneNumber(instance.jid).replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '$1 $2 $3-$4')}` : 
                                '-'
                              }
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center justify-center gap-1">
                                  <Webhook className="h-4 w-4 text-muted-foreground" />
                                  {instance.webhook ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {instance.webhook ? instance.webhook : t('config.notConfigured')}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {instance.proxy_config?.enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Cloud className="h-4 w-4 text-muted-foreground" />
                            {instance.s3_config?.enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Rabbit className="h-4 w-4 text-muted-foreground" />
                            {instance.rabbitmq_config?.enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {instance.events ? instance.events.split(',').length : 0}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Skip: {getSkipOptions(instance)}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatExpiration(instance.expiration)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('actions.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <QrCode className="h-4 w-4 mr-2" />
                                {t('actions.qrCode')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                {t('actions.logs')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteInstance(instance)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('actions.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatedList>
                  </TableBody>
                </Table>
              </div>
            </div>
           )}
         </CardContent>
       </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDelete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('confirmDelete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t('confirmDelete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}