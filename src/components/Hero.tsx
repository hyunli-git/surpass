// src/components/Hero.tsx

// 👇 여기에도 'export default'가 필요합니다.
export default function Hero() {
  return (
    <section className="hero">
      <div className="container container-narrow">
        <h1>Master any language test with AI</h1>
        <p>Personalized preparation for TOEIC, IELTS, HSK, JLPT, and 30+ language tests worldwide.</p>
        <div className="hero-actions">
          <button className="btn btn-primary">Start Learning</button>
          <button className="btn">Browse All Tests</button>
        </div>
      </div>
    </section>
  )
}