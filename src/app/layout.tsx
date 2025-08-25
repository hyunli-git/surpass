// src/app/layout.tsx

import type { Metadata } from 'next'
import Header from '../components/Header' // Header 컴포넌트를 불러옵니다.
import './globals.css' // 전역 CSS 파일을 불러옵니다.

export const metadata: Metadata = {
  title: 'Surpass — AI-Powered Language Test Preparation',
  description: 'Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.',
}

// 모든 페이지는 이 구조 안에 표시됩니다.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}