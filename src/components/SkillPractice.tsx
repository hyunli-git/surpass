// src/components/SkillPractice.tsx

import Link from 'next/link'; // Link 컴포넌트를 사용하기 위해 import 합니다.

export default function SkillPractice() {
  return (
    <section className="practice-section">
      <div className="container">
        <h2>Practice by Skills</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
          Focus on specific skills to improve your weak areas
        </p>
        <div className="skill-cards">
          {/* Reading Card */}
          <div className="skill-card">
            <div className="skill-icon">📖</div>
            <h3>Reading</h3>
            <p>40 questions • 60 minutes</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }} disabled>Practice Reading</button>
          </div>
          {/* Listening Card */}
          <div className="skill-card">
            <div className="skill-icon">🎧</div>
            <h3>Listening</h3>
            <p>40 questions • 30 minutes</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }} disabled>Practice Listening</button>
          </div>
          {/* Writing Card */}
          <div className="skill-card">
            <div className="skill-icon">✍️</div>
            <h3>Writing</h3>
            <p>2 tasks • 60 minutes</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }} disabled>Practice Writing</button>
          </div>
          
          {/* Speaking Card */}
          <div className="skill-card">
            <div className="skill-icon">🗣️</div>
            <h3>Speaking</h3>
            <p>3 parts • 11-14 minutes</p>
            {/* ▼▼▼ 이 부분이 Link로 수정되었습니다 ▼▼▼ */}
            <Link href="/skill-practice/speaking" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
              Practice Speaking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}