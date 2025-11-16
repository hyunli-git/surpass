import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Header from '@/components/Header';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { TestModeProvider } from '@/contexts/TestModeContext';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
});

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
      <body className={outfit.variable}>
        <NextIntlClientProvider messages={messages}>
          <TestModeProvider>
            <Header />
            <main>{children}</main>
          </TestModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}