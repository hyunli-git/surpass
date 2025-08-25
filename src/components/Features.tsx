// src/components/Features.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Test Prep",
      description: "Advanced AI analyzes your performance and creates personalized study plans for maximum score improvement.",
      details: ["Real-time performance tracking", "Adaptive difficulty adjustment", "Weakness identification", "Custom practice schedules"],
      link: "/tests",
      linkText: "Start AI Practice"
    },
    {
      icon: "🗣️", 
      title: "Speaking Practice Studio",
      description: "Practice pronunciation and fluency with our AI voice coach that provides instant, detailed feedback.",
      details: ["Pronunciation analysis", "Fluency scoring", "Accent improvement", "Speaking confidence building"],
      link: "/skill-practice/speaking",
      linkText: "Try Speaking Practice"
    },
    {
      icon: "✍️",
      title: "Writing Assessment Lab",
      description: "Get professional-grade essay feedback with detailed scoring across grammar, vocabulary, and structure.",
      details: ["Grammar error detection", "Vocabulary enhancement", "Structure analysis", "Score prediction"],
      link: "/skill-practice/writing",
      linkText: "Improve Writing Skills"
    },
    {
      icon: "📊",
      title: "30+ Global Tests",
      description: "Comprehensive preparation for all major language certifications including TOEIC, IELTS, HSK, JLPT and more.",
      details: ["TOEIC Business English", "IELTS Academic/General", "HSK Chinese Levels", "JLPT Japanese Certification"],
      link: "/tests",
      linkText: "Browse All Tests"
    }
  ];

  const stats = [
    { number: "30+", label: "Language Tests", icon: "🌍" },
    { number: "10K+", label: "Active Students", icon: "👥" },
    { number: "95%", label: "Success Rate", icon: "🎯" },
    { number: "24/7", label: "AI Support", icon: "🤖" }
  ];

  return (
    <>
      {/* Main Features Section */}
      <section className="features-enhanced">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-accent">Revolutionary</span> Language Learning
            </h2>
            <p className="section-subtitle">
              Experience the future of test preparation with AI-powered tools that adapt to your learning style
            </p>
          </div>

          <div className="features-showcase">
            <div className="features-nav">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-nav-item ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <span className="nav-icon">{feature.icon}</span>
                  <span className="nav-title">{feature.title}</span>
                </button>
              ))}
            </div>

            <div className="feature-content">
              <div className="feature-display">
                <div className="feature-header">
                  <span className="feature-icon-large">{features[activeFeature].icon}</span>
                  <div>
                    <h3 className="feature-title">{features[activeFeature].title}</h3>
                    <p className="feature-description">{features[activeFeature].description}</p>
                  </div>
                </div>

                <div className="feature-details">
                  <ul className="feature-list">
                    {features[activeFeature].details.map((detail, index) => (
                      <li key={index} className="feature-item">
                        <span className="check-icon">✅</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="feature-action">
                  <Link href={features[activeFeature].link} className="btn btn-primary">
                    {features[activeFeature].linkText}
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h3 className="stats-title">Trusted by thousands worldwide</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Tests Showcase */}
      <section className="tests-showcase">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Master Any Language Test</h2>
            <p className="section-subtitle">From global standards to regional certifications</p>
          </div>

          <div className="test-categories">
            <div className="category-card gold">
              <div className="category-header">
                <h4>🏆 Top Global Tests</h4>
                <span className="category-badge">Rank #1-10</span>
              </div>
              <div className="test-list">
                <span className="test-name">TOEIC • IELTS • TOEFL</span>
                <span className="test-name">Cambridge • Duolingo</span>
                <span className="test-name">JLPT • HSK • PTE</span>
              </div>
              <Link href="/tests" className="category-link">Explore Top Tests →</Link>
            </div>

            <div className="category-card silver">
              <div className="category-header">
                <h4>🥈 Regional Leaders</h4>
                <span className="category-badge">Rank #11-20</span>
              </div>
              <div className="test-list">
                <span className="test-name">TOPIK • Goethe • DELE</span>
                <span className="test-name">CELPE-Bras • TCF</span>
                <span className="test-name">TOCFL • YCT • OPIC</span>
              </div>
              <Link href="/tests" className="category-link">View Regional Tests →</Link>
            </div>

            <div className="category-card bronze">
              <div className="category-header">
                <h4>🥉 Specialized Certs</h4>
                <span className="category-badge">Rank #21-30</span>
              </div>
              <div className="test-list">
                <span className="test-name">TestDaF • OET • SIELE</span>
                <span className="test-name">CILS • PLIDA • TORFL</span>
                <span className="test-name">TELC • ÖSD • CAPLE</span>
              </div>
              <Link href="/tests" className="category-link">Discover More →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}