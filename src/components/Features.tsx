// src/components/Features.tsx

// 👇 이 줄의 'export default'를 추가하거나 확인해주세요.
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
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>Speaking Practice</h3>
            <p>Practice with AI tutors that provide instant pronunciation feedback.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Writing Assistant</h3>
            <p>Get detailed feedback on essays with AI-powered evaluation.</p>
          </div>
        </div>
      </div>
    </section>
  )
}