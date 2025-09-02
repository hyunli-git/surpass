import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Surpass - Master Language Tests with AI',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}