import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't show locale in URL for default locale
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  // Add CORS headers for VPN compatibility
  const response = intlMiddleware(request);
  
  // Add additional headers for VPN/proxy compatibility
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(en|ko|ja|zh|es|fr|de|pt|it|ru|ar)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'
  ]
};