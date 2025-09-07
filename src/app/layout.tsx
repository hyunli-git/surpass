import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Surpass - Master Language Tests with AI',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}