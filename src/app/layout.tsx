import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10B981' },
    { media: '(prefers-color-scheme: dark)', color: '#065F46' },
  ],
};

export const metadata: Metadata = {
  title: 'ZuckZapGo Manager',
  description: 'WhatsApp Business API Management Platform',
  keywords: 'WhatsApp, Business API, Automation, Messaging, CRM, Marketing',
  authors: [{ name: 'ZuckZapGo Team' }],
  creator: 'ZuckZapGo',
  publisher: 'ZuckZapGo',
  applicationName: 'ZuckZapGo Manager',
  generator: 'Next.js',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  
  // Open Graph
  openGraph: {
    title: 'ZuckZapGo Manager - WhatsApp Business API Platform',
    description: 'A solução definitiva para automatizar e gerenciar suas comunicações via WhatsApp Business.',
    url: '/',
    siteName: 'ZuckZapGo Manager',
    images: [
      {
        url: '/logo_logo.png',
        width: 1200,
        height: 630,
        alt: 'ZuckZapGo Manager',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ZuckZapGo Manager',
    description: 'A solução definitiva para automatizar e gerenciar suas comunicações via WhatsApp Business.',
    images: ['/logo_logo.png'],
    creator: '@zuckzapgo',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Other
  category: 'Business Software',
  classification: 'Business Application',

  // MS Application
  other: {
    'msapplication-TileColor': '#10B981',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileImage': '/mstile-144x144.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}