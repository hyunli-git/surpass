import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { defaultLocale } from '@/i18n';
import Header from '@/components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Surpass - Master Language Tests with AI',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Use default locale since we're not using locale in URL
  const messages = await getMessages({ locale: defaultLocale });

  return (
    <html lang={defaultLocale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}