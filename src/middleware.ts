// Temporarily disable middleware to troubleshoot 404 issues
// import createMiddleware from 'next-intl/middleware';
// import {defaultLocale} from './i18n';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple pass-through middleware for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Static files (_next/static, _next/image, favicon.ico)
    // - Assets with extensions
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'
  ]
};