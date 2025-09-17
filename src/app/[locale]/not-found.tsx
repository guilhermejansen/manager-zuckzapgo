import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">
        {t('pageNotFound')}
      </p>
      <Link 
        href="/"
        className="text-primary hover:underline"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}