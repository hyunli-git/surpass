// Global root layout (no internationalization here)
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Surpass — AI-Powered Language Test Preparation',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}