import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
export const locales = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar'] as const;
export type Locale = typeof locales[number];

export const defaultLocale = 'en' as const;

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語', 
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  ru: 'Русский',
  ar: 'العربية'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ko: '🇰🇷',
  ja: '🇯🇵',
  zh: '🇨🇳', 
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇵🇹',
  it: '🇮🇹',
  ru: '🇷🇺',
  ar: '🇸🇦'
};
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale: locale as string
  };
});