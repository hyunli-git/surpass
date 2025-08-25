// src/components/Testimonials.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Kim",
      role: "Marketing Manager",
      test: "TOEIC",
      score: "985/990",
      avatar: "👩‍💼",
      country: "🇰🇷",
      quote: "Surpass helped me achieve my dream TOEIC score! The AI feedback was incredibly detailed and helped me identify my weak points quickly.",
      improvement: "+185 points"
    },
    {
      name: "Miguel Rodriguez", 
      role: "Graduate Student",
      test: "IELTS",
      score: "8.5/9.0",
      avatar: "👨‍🎓",
      country: "🇲🇽",
      quote: "The speaking practice was game-changing. I went from nervous and stuttering to confident and fluent in just 3 weeks!",
      improvement: "+2.5 bands"
    },
    {
      name: "Yuki Tanaka",
      role: "Software Engineer",
      test: "TOEFL",
      score: "118/120",
      avatar: "👨‍💻",
      country: "🇯🇵",
      quote: "Amazing platform! The writing feedback helped me structure my essays perfectly. Got into my dream US university!",
      improvement: "+38 points"
    },
    {
      name: "Li Wei",
      role: "Business Analyst",
      test: "HSK Level 6",
      score: "280/300",
      avatar: "👨‍💼",
      country: "🇺🇸",
      quote: "Learning Chinese seemed impossible until I found Surpass. The personalized study plan made all the difference!",
      improvement: "Passed Level 6"
    }
  ];

  const achievements = [
    { metric: "Average Score Improvement", value: "+127 points", icon: "📈" },
    { metric: "Study Time Reduction", value: "60% faster", icon: "⚡" },
    { metric: "Success Rate", value: "94.7%", icon: "🎯" },
    { metric: "Countries Served", value: "150+", icon: "🌍" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-accent">Real Results</span> from Real Students
          </h2>
          <p className="section-subtitle">
            Join thousands of successful test-takers who achieved their certification goals
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="testimonial-showcase">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">&ldquo;</div>
              <blockquote className="testimonial-quote">
                {testimonials[currentTestimonial].quote}
              </blockquote>
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span className="avatar-emoji">{testimonials[currentTestimonial].avatar}</span>
                  <span className="country-flag">{testimonials[currentTestimonial].country}</span>
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonials[currentTestimonial].name}</div>
                  <div className="author-role">{testimonials[currentTestimonial].role}</div>
                </div>
                <div className="test-results">
                  <div className="test-name">{testimonials[currentTestimonial].test}</div>
                  <div className="test-score">{testimonials[currentTestimonial].score}</div>
                  <div className="improvement">{testimonials[currentTestimonial].improvement}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="testimonial-nav">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${currentTestimonial === index ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-value">{achievement.value}</div>
              <div className="achievement-metric">{achievement.metric}</div>
            </div>
          ))}
        </div>

        {/* Social Proof Bar */}
        <div className="social-proof-bar">
          <div className="proof-item">
            <span className="proof-icon">⭐</span>
            <span className="proof-text"><strong>4.9/5</strong> App Store Rating</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">🏆</span>
            <span className="proof-text"><strong>#1</strong> Language Learning App</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">👥</span>
            <span className="proof-text"><strong>50K+</strong> Monthly Active Users</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">🌟</span>
            <span className="proof-text"><strong>Featured</strong> in TechCrunch</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="testimonials-cta">
          <h3>Ready to Join Our Success Stories?</h3>
          <p>Start your journey to test mastery today</p>
          <div className="cta-buttons">
            <Link href="/tests" className="btn btn-primary-xl">
              <span className="btn-icon">🚀</span>
              Start Free Practice
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              View Plans & Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}