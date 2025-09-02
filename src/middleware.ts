import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't show locale in URL for default locale
  localePrefix: 'as-needed'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|ko|ja|zh|es|fr|de|pt|it|ru|ar)/:path*']
};