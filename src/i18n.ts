import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, defaultLocale, type Locale } from './i18n-config';
 
export default getRequestConfig(async () => {
  // Get locale from cookie
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  
  // Validate that the locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale as string
  };
});