// src/components/Hero.tsx

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  
  const popularTests = [
    { name: 'IELTS', flag: '🇬🇧', users: '12K+' },
    { name: 'TOEFL', flag: '🇺🇸', users: '8K+' },
    { name: 'HSK', flag: '🇨🇳', users: '5K+' },
    { name: 'JLPT', flag: '🇯🇵', users: '7K+' },
    { name: 'DELE', flag: '🇪🇸', users: '3K+' },
    { name: 'DELF', flag: '🇫🇷', users: '4K+' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestIndex((prev) => (prev + 1) % popularTests.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [popularTests.length]);
  
  return (
    <section className="hero-enhanced">
      <div className="hero-background">
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container container-narrow">
        <div className="hero-badge">
          <span className="badge-icon">🎯</span>
          <span className="badge-text">AI-Powered Learning</span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">Master Any Language Test</span>
          <span className="title-gradient">with Personalized AI</span>
        </h1>
        
        <p className="hero-description">
          Join <strong>50,000+ learners</strong> achieving their dream scores with AI-powered practice 
          for <strong>30+ international language tests</strong>. Get instant feedback, 
          personalized study plans, and guaranteed improvement.
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">94%</span>
            <span className="stat-label">Pass Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">+127</span>
            <span className="stat-label">Avg. Score Increase</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">2x</span>
            <span className="stat-label">Faster Learning</span>
          </div>
        </div>
        
        <div className="hero-actions">
          <Link href="/tests" className="btn-hero-primary">
            <span className="btn-text">Start Free Practice</span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link href="/mock-test" className="btn-hero-secondary">
            <span className="btn-icon">📝</span>
            <span>Take Mock Test</span>
          </Link>
        </div>

        <div className="hero-trust">
          <p className="trust-text">Trusted by learners preparing for:</p>
          <div className="test-carousel">
            {popularTests.map((test, index) => (
              <div 
                key={test.name}
                className={`test-badge ${index === activeTestIndex ? 'active' : ''}`}
              >
                <span className="test-flag">{test.flag}</span>
                <span className="test-name">{test.name}</span>
                <span className="test-users">{test.users}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-guarantee">
          <div className="guarantee-badge">
            <span className="guarantee-icon">✓</span>
            <span className="guarantee-text">7-Day Free Trial</span>
          </div>
          <div className="guarantee-badge">
            <span className="guarantee-icon">✓</span>
            <span className="guarantee-text">No Credit Card Required</span>
          </div>
          <div className="guarantee-badge">
            <span className="guarantee-icon">✓</span>
            <span className="guarantee-text">Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}