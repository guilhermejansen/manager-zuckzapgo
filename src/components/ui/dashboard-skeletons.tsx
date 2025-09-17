'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Skeleton para os cards de estatísticas principais
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('h-full', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 gap-3">
        <div className="flex flex-col flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          <Skeleton className="h-3 w-24 sm:w-32 hidden lg:block xl:hidden 2xl:block" />
        </div>
        <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-6 xl:w-6 2xl:h-8 2xl:w-8 flex-shrink-0 rounded-full" />
      </div>
    </Card>
  );
}

// Skeleton para o grid de estatísticas
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para o card de status de conexão
export function ConnectionStatusSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Profile Section Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border">
          <div className="relative flex-shrink-0">
            <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full" />
            <Skeleton className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Status Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t" />

        {/* Instance Details Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-32" />
          </div>
          
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-32 sm:w-48" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para seção de configuração
export function ConfigurationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm h-full flex flex-col">
              <div className="flex flex-col gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              
              <div className="space-y-3 flex-1">
                {Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((_, j) => (
                  <div key={j} className="text-sm">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para filtros de mensagem
export function MessageFiltersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-4 w-60 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Call settings skeleton */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para header da página
export function DashboardHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center space-y-3 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 md:h-12 lg:h-16 w-64 sm:w-80 md:w-96 mx-auto bg-white/20" />
          <Skeleton className="h-4 sm:h-5 lg:h-6 w-48 sm:w-64 lg:w-80 mx-auto bg-white/20" />
        </div>
      </div>
    </div>
  );
}

// Skeleton completo da página
export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Skeleton */}
      <DashboardHeaderSkeleton />

      {/* Dashboard Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Quick Stats */}
        <StatsGridSkeleton />

        {/* Main Content Grid */}
        <div className="space-y-6 sm:space-y-8">
          {/* Connection Status */}
          <ConnectionStatusSkeleton />

          {/* Configuration Section */}
          <ConfigurationSkeleton />
        </div>

        {/* Message Filters */}
        <div className="mt-6 sm:mt-8">
          <MessageFiltersSkeleton />
        </div>
      </div>
    </div>
  );
} 