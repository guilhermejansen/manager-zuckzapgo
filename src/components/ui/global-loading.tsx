'use client';

import { RefreshCw, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface GlobalLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  message?: string;
  variant?: 'default' | 'brand' | 'minimal';
  className?: string;
}

export function GlobalLoading({ 
  size = 'md', 
  message, 
  variant = 'default',
  className 
}: GlobalLoadingProps) {
  const t = useTranslations('common');

  const sizeClasses = {
    sm: 'h-24',
    md: 'h-48',
    lg: 'h-64',
    full: 'min-h-screen'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    full: 'h-16 w-16'
  };

  const LoadingIcon = variant === 'brand' ? Zap : variant === 'minimal' ? Loader2 : RefreshCw;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      sizeClasses[size],
      size === 'full' && 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
      className
    )}>
      <div className="relative">
        {/* Animated background circle */}
        <div className={cn(
          'absolute inset-0 rounded-full border-2',
          variant === 'brand' 
            ? 'border-blue-200 dark:border-blue-800 animate-pulse' 
            : 'border-gray-200 dark:border-gray-700 animate-pulse'
        )} />
        
        {/* Loading icon */}
        <LoadingIcon 
          className={cn(
            iconSizes[size],
            'animate-spin',
            variant === 'brand' 
              ? 'text-blue-600 dark:text-blue-400' 
              : variant === 'minimal'
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-blue-600 dark:text-blue-400'
          )} 
        />
      </div>
      
      {/* Loading message */}
      <div className="mt-4 text-center">
        <p className={cn(
          'font-medium',
          size === 'sm' ? 'text-sm' : size === 'lg' || size === 'full' ? 'text-lg' : 'text-base',
          variant === 'brand' 
            ? 'text-blue-700 dark:text-blue-300' 
            : 'text-gray-600 dark:text-gray-400'
        )}>
          {message || t('loading')}
        </p>
        
        {/* Loading dots animation */}
        <div className="flex items-center justify-center mt-2 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full',
                size === 'sm' ? 'h-1 w-1' : 'h-2 w-2',
                variant === 'brand' 
                  ? 'bg-blue-400 dark:bg-blue-600' 
                  : 'bg-gray-400 dark:bg-gray-600',
                'animate-bounce'
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading para página inteira com backdrop
export function PageLoading({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-white/80 backdrop-blur-sm dark:bg-gray-900/80',
      className
    )}>
      <GlobalLoading size="lg" variant="brand" message={message} />
    </div>
  );
}

// Loading para cards e componentes
export function ComponentLoading({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <GlobalLoading size="md" variant="default" message={message} />
    </div>
  );
}

// Loading compacto para botões e elementos pequenos
export function InlineLoading({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className="h-4 w-4 animate-spin text-current" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
} 