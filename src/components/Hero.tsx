// src/components/Hero.tsx

'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container container-narrow">
        <h1>Master any language test with AI</h1>
        <p>Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.</p>
        <div className="hero-actions">
          <Link href="/tests" className="btn btn-primary">
            Start Learning
          </Link>
          <Link href="/tests" className="btn">
            Browse All Tests
          </Link>
        </div>
      </div>
    </section>
  )
}