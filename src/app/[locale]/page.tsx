import { LandingPage } from '@/components/landing-page';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  return <LandingPage locale={locale} />;
}