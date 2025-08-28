import './globals.css';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getLocale} from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Surpass - Master Language Tests with AI',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}