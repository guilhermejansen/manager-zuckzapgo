import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if it's an API route or static file
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const token = request.cookies.get('auth-token')?.value;
  const userType = request.cookies.get('user-type')?.value;
  
  // Protected routes that require authentication
  const isProtectedRoute = pathname.includes('/admin') || pathname.includes('/instance');
  
  if (isProtectedRoute && !token) {
    // Get locale from pathname
    const locale = pathname.split('/')[1];
    const redirectUrl = locales.includes(locale as any) 
      ? `/${locale}/auth/login`
      : `/${defaultLocale}/auth/login`;
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  // Admin routes require admin token
  if (pathname.includes('/admin') && userType !== 'admin') {
    const locale = pathname.split('/')[1];
    const redirectUrl = locales.includes(locale as any) 
      ? `/${locale}/auth/login`
      : `/${defaultLocale}/auth/login`;
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};