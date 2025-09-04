// src/components/Features.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function Features() {
  const router = useRouter();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Why Choose Surpass?</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Learning</h3>
            <p>AI adapts to your learning style and tracks your progress in real-time.</p>
            <button 
              onClick={() => handleNavigation('/tests')} 
              className="feature-link"
              style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Start AI Practice
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>Speaking Practice</h3>
            <p>Practice with AI tutors that provide instant pronunciation feedback.</p>
            <button 
              onClick={() => handleNavigation('/skill-practice/speaking')} 
              className="feature-link"
              style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Try Speaking Practice
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Writing Assistant</h3>
            <p>Get detailed feedback on your writing with AI-powered analysis.</p>
            <button 
              onClick={() => handleNavigation('/skill-practice/writing')} 
              className="feature-link"
              style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Improve Writing
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
            30+ Language Tests Available
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            IELTS, TOEFL, TOEIC, HSK, JLPT, DELE, DELF, and many more
          </p>
          <button 
            onClick={() => handleNavigation('/tests')} 
            className="btn btn-primary"
          >
            Browse All Tests
          </button>
        </div>
      </div>
    </section>
  )
}