// src/components/MockTests.tsx

// onStartMockTest 함수를 props로 받도록 정의합니다.
interface MockTestsProps {
  onStartMockTest: () => void;
}

export default function MockTests({ onStartMockTest }: MockTestsProps) {
  return (
    <section className="practice-section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <h2>General Training Mock Tests</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
          Simulate the real exam experience with complete practice tests
        </p>
        <div className="mock-test-cards">
          {/* Full Mock Test Card */}
          <div className="mock-test-card">
            <h3>🎯 Full Mock Test</h3>
            <div className="test-duration">
              ⏱️ 2 hours 45 minutes
            </div>
            <ul className="test-sections">
              <li>✓ Complete GT simulation</li>
              <li>✓ All 4 sections included</li>
            </ul>
            {/* 버튼을 누르면 props로 받은 함수를 실행합니다. */}
            <button onClick={onStartMockTest} className="btn btn-primary" style={{ width: '100%' }}>
              Start Full Test
            </button>
          </div>

          {/* Quick Mock Test Card */}
          <div className="mock-test-card">
            <h3>⚡ Quick Mock Test</h3>
            <div className="test-duration">
              ⏱️ 1 hour 30 minutes
            </div>
            <ul className="test-sections">
              <li>✓ Shortened version</li>
              <li>✓ Key question types</li>
            </ul>
            <button className="btn" style={{ width: '100%' }} disabled>Start Quick Test</button>
          </div>
        </div>
      </div>
    </section>
  );
}