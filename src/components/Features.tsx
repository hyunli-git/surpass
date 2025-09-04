// src/components/Features.tsx

'use client';

import Link from 'next/link';

export default function Features() {
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Why Choose Surpass?</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Learning</h3>
            <p>AI adapts to your learning style and tracks your progress in real-time.</p>
            <Link href="/tests" className="feature-link">
              Start AI Practice
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>Speaking Practice</h3>
            <p>Practice with AI tutors that provide instant pronunciation feedback.</p>
            <Link href="/skill-practice/speaking" className="feature-link">
              Try Speaking Practice
            </Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Writing Assistant</h3>
            <p>Get detailed feedback on your writing with AI-powered analysis.</p>
            <Link href="/skill-practice/writing" className="feature-link">
              Improve Writing
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
            30+ Language Tests Available
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            IELTS, TOEFL, TOEIC, HSK, JLPT, DELE, DELF, and many more
          </p>
          <Link href="/tests" className="btn btn-primary">
            Browse All Tests
          </Link>
        </div>
      </div>
    </section>
  )
}