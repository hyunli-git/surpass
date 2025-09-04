// src/components/Hero.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  return (
    <section className="hero">
      <div className="container container-narrow">
        <h1>Master any language test with AI</h1>
        <p>Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.</p>
        <div className="hero-actions">
          <button 
            onClick={() => handleNavigation('/tests')} 
            className="btn btn-primary"
          >
            Start Learning
          </button>
          <button 
            onClick={() => handleNavigation('/tests')} 
            className="btn"
          >
            Browse All Tests
          </button>
        </div>
      </div>
    </section>
  )
}