// src/components/Hero.tsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { number: "30+", label: "Language Tests", detail: "Global Certification Support" },
    { number: "95%", label: "Success Rate", detail: "Students Achieve Goals" },
    { number: "AI", label: "Powered", detail: "Instant Feedback System" },
    { number: "24/7", label: "Available", detail: "Study Anytime, Anywhere" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [stats.length]);

  return (
    <section className="hero-enhanced">
      <div className="hero-background">
        <div className="floating-elements">
          <div className="float-item">🎯</div>
          <div className="float-item">🚀</div>
          <div className="float-item">⭐</div>
          <div className="float-item">🏆</div>
          <div className="float-item">📚</div>
          <div className="float-item">🌟</div>
        </div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🔥</span>
            <span>Top-Rated Language Test Platform</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">Surpass Every</span>
            <span className="title-highlight">Language Test</span>
            <span className="title-sub">with AI-Powered Precision</span>
          </h1>
          
          <p className="hero-description">
            Master <strong>TOEIC, IELTS, HSK, JLPT</strong> and <strong>30+ global language tests</strong> with personalized AI coaching. 
            Get real-time feedback, track progress, and achieve your certification goals faster than ever.
          </p>

          <div className="hero-stats">
            <div className="stat-highlight">
              <span className="stat-number">{stats[currentStat].number}</span>
              <span className="stat-label">{stats[currentStat].label}</span>
              <span className="stat-detail">{stats[currentStat].detail}</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link href="/tests" className="btn btn-primary-xl">
              <span className="btn-icon">🎯</span>
              Start Your Test Prep
              <span className="btn-badge">Free</span>
            </Link>
            <Link href="/tests" className="btn btn-outline-xl">
              <span className="btn-icon">📊</span>
              Browse 30+ Tests
            </Link>
          </div>

          <div className="hero-social-proof">
            <div className="proof-avatars">
              <div className="avatar">👨‍💼</div>
              <div className="avatar">👩‍🎓</div>
              <div className="avatar">👨‍🎓</div>
              <div className="avatar">👩‍💻</div>
            </div>
            <div className="proof-text">
              <strong>10,000+</strong> students achieved their target scores
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}