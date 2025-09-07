// src/app/ielts-practice/page.tsx

"use client";

import Link from 'next/link';

export default function IeltsPracticePage() {
  return (
    <>
      <section className="hero">
        <div className="container container-narrow">
          <h1>IELTS Practice</h1>
          <p>Choose your test format to begin preparation</p>
        </div>
      </section>

      <section className="practice-section">
        <div className="container">
          <h2>Select Your Test Format</h2>
          <div className="format-cards">
            {/* Academic Card */}
            <div className="format-card">
              <div className="format-icon">🎓</div>
              <h3>IELTS Academic</h3>
              <p className="format-subtitle">For university admission and professional registration</p>
              <ul className="format-features">
                <li>✓ Academic reading passages</li>
                <li>✓ Report writing (Task 1)</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled>Practice Academic</button>
            </div>

            {/* General Training Card */}
            <div className="format-card">
              <div className="format-icon">💼</div>
              <h3>IELTS General Training</h3>
              <p className="format-subtitle">For work, migration, and general English proficiency</p>
              <ul className="format-features">
                <li>✓ Everyday reading materials</li>
                <li>✓ Letter writing (Task 1)</li>
              </ul>
              {/* General Training 페이지로 가는 링크를 추가합니다. */}
              <Link href="/ielts-general-practice" className="btn btn-primary" style={{ width: '100%' }}>
                Practice General
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}