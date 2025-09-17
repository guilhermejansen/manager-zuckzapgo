import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'pt', 'es'] as const;
export const defaultLocale = 'pt' as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate locale and fallback to default if invalid
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  let messages;
  try {
    messages = (await import(`./messages/${validLocale}.json`)).default;
  } catch (error) {
    // Fallback to Portuguese if messages file not found
    messages = (await import(`./messages/pt.json`)).default;
  }

  return {
    locale: validLocale as string,
    messages,
    timeZone: process.env.TZ || 'America/Sao_Paulo',
    now: new Date(),
  };
});