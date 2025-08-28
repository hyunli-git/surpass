import createMiddleware from 'next-intl/middleware';
import {defaultLocale} from './i18n';
 
export default createMiddleware({
  // Only use default locale since we're not using locale prefixes
  locales: ['en'],
  defaultLocale,
  localeDetection: false,
  localePrefix: 'never'
});
 
export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Static files (_next/static, _next/image, favicon.ico)
    // - Assets with extensions
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'
  ]
};