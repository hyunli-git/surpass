// src/components/TestList.tsx

import Link from 'next/link';

interface Test {
  id: string;
  name: string;
  language_group: string;
  badge_type: string;
  badge_text: string;
  subtitle: string;
  features: string[];
}

export default function TestList({ tests }: { tests: Test[] | null }) {
  if (!tests) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="filter-pills">
          <button className="filter-pill active">All Tests (9)</button>
          <button className="filter-pill">English (6)</button>
          <button className="filter-pill">Asian (2)</button>
          <button className="filter-pill">European (1)</button>
        </div>

        <div className="grid grid-3">
          {tests.map((test) => (
            <div key={test.id} className="test-card" data-lang={test.language_group}>
              <div className={`badge badge-${test.badge_type}`}>{test.badge_text}</div>
              <h3>{test.name}</h3>
              <p className="test-card-subtitle">{test.subtitle}</p>
              <ul className="test-card-features">
                {test.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              
              {/* ▼▼▼ 이 부분이 올바른 주소로 수정되었습니다 ▼▼▼ */}
              {test.name.includes('IELTS') ? (
                // 목적지를 /mock-test가 아닌 /ielts-practice로 변경합니다.
                <Link href="/ielts-practice" className="btn btn-primary" style={{ width: '100%' }}>
                  Start Practice
                </Link>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} disabled>Start Practice</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}