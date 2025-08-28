import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Hide default locale prefix but show others
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'ko': '/ko',
      'ja': '/ja', 
      'zh': '/zh',
      'es': '/es',
      'fr': '/fr',
      'de': '/de',
      'pt': '/pt',
      'it': '/it',
      'ru': '/ru',
      'ar': '/ar'
    }
  }
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};