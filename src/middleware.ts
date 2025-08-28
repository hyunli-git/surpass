import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Never show the locale in the URL
  localePrefix: 'never',
  
  // Detect locale from cookie
  localeDetection: true
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};