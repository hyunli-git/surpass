"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface OpicLevel {
  id: string;
  name: string;
  description: string;
  targetLevel: string;
  difficulty: string;
  icon: string;
  responseTime: string;
  topics: string[];
}

export default function OpicPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const opicLevels: OpicLevel[] = [
    {
      id: 'novice',
      name: 'Novice Mid - High',
      description: 'Basic personal topics and daily routines',
      targetLevel: 'Beginner Level',
      difficulty: 'Beginner',
      icon: '🌱',
      responseTime: '60 seconds',
      topics: ['Personal Background', 'Daily Routine', 'Family & Home']
    },
    {
      id: 'intermediate-low',
      name: 'Intermediate Low - Mid',
      description: 'Past experiences and personal preferences',
      targetLevel: 'Intermediate Level',
      difficulty: 'Intermediate',
      icon: '🌿',
      responseTime: '90 seconds',
      topics: ['Past Experiences', 'Comparing Past & Present', 'Personal Preferences']
    },
    {
      id: 'intermediate-high',
      name: 'Intermediate High - Advanced Low',
      description: 'Problem solving and hypothetical situations',
      targetLevel: 'Upper Intermediate',
      difficulty: 'Intermediate',
      icon: '🌳',
      responseTime: '90 seconds',
      topics: ['Problem Solving', 'Hypothetical Situations', 'Abstract Topics']
    },
    {
      id: 'advanced',
      name: 'Advanced Mid - High',
      description: 'Complex argumentation and cultural analysis',
      targetLevel: 'Advanced Level',
      difficulty: 'Advanced',
      icon: '🏆',
      responseTime: '120 seconds',
      topics: ['Complex Argumentation', 'Cultural Analysis', 'Philosophical Questions']
    }
  ];

  const handleStartPractice = (levelId: string) => {
    if (!user) {
      const signupSection = document.getElementById('signup-section');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.location.href = `/opic-practice/${levelId}`;
  };

  return (
    <div className="container" style={{ margin: '50px auto' }}>
      {/* Hero Section */}
      <div className="opic-hero">
        <h1>🎙️ OPIc Practice - Oral Proficiency Interview</h1>
        <p>Master computer-based speaking assessment with AI-powered feedback and authentic practice scenarios</p>
        
        <div className="opic-info" style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px', 
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <h3>🎯 What is OPIc?</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '15px' }}>
            <div style={{ margin: '10px' }}>
              <strong>⏱️ Duration</strong><br/>
              40 minutes total
            </div>
            <div style={{ margin: '10px' }}>
              <strong>🎙️ Format</strong><br/>
              Computer-based speaking
            </div>
            <div style={{ margin: '10px' }}>
              <strong>📊 Levels</strong><br/>
              Novice → Advanced
            </div>
            <div style={{ margin: '10px' }}>
              <strong>🎭 Content</strong><br/>
              Personal topics & role-play
            </div>
          </div>
        </div>

        {!user && (
          <p className="hero-cta">
            <span style={{ backgroundColor: '#e3f2fd', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>
              🎁 Free practice with instant AI feedback - Build speaking confidence!
            </span>
          </p>
        )}
      </div>

      {/* Practice Levels */}
      <div className="opic-levels-section" style={{ marginTop: '40px' }}>
        <h2>Choose Your Target Level</h2>
        <div className="opic-levels-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {opicLevels.map((level) => (
            <div key={level.id} className="opic-level-card" style={{
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}>
              <div className="level-header" style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div className="level-icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {level.icon}
                </div>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>
                  {level.name}
                </h3>
                <div className="difficulty-badge" style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  backgroundColor: level.difficulty === 'Beginner' ? '#e8f5e8' : 
                                 level.difficulty === 'Intermediate' ? '#fff3e0' : '#fce4ec',
                  color: level.difficulty === 'Beginner' ? '#2e7d32' : 
                         level.difficulty === 'Intermediate' ? '#f57c00' : '#c2185b'
                }}>
                  {level.difficulty}
                </div>
              </div>

              <div className="level-details">
                <p style={{ margin: '12px 0', color: '#666', textAlign: 'center' }}>
                  {level.description}
                </p>

                <div className="level-specs" style={{ margin: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span>⏱️ Response Time:</span>
                    <strong>{level.responseTime}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span>🎯 Target Level:</span>
                    <strong>{level.targetLevel}</strong>
                  </div>
                </div>

                <div className="topics-preview" style={{ margin: '16px 0' }}>
                  <h5 style={{ margin: '8px 0', fontSize: '14px' }}>📋 Topics Covered:</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {level.topics.map((topic, index) => (
                      <span key={index} style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '12px',
                        color: '#666'
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleStartPractice(level.id)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  {user ? `Start ${level.name} Practice` : `Try ${level.name} (Free)`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Tests Section */}
      <div className="opic-mock-tests" style={{ marginTop: '50px' }}>
        <h2>🎯 Complete OPIc Mock Tests</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Full 40-minute practice tests with self-assessment, warm-up, main questions, and role-play scenarios
        </p>

        <div className="mock-tests-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
            <div key={level} className="mock-test-card" style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
                {index === 0 ? '🌱' : index === 1 ? '🌿' : '🏆'}
              </div>
              <h4>{level} Mock Tests</h4>
              <p style={{ color: '#666', fontSize: '14px', margin: '12px 0' }}>
                3 complete practice tests
              </p>
              <div style={{ margin: '16px 0', fontSize: '12px', color: '#888' }}>
                ⏱️ 40 minutes • 🎙️ Full simulation • 🎭 Role-play included
              </div>
              <button 
                onClick={() => handleStartPractice(`mock-${level.toLowerCase()}`)}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                {user ? `Take ${level} Test` : `Try ${level} Test (Free)`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="opic-features" style={{ marginTop: '50px' }}>
        <h2>🚀 Why Practice OPIc with AI?</h2>
        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div className="feature-card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎙️</div>
            <h4>Authentic Practice</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Real OPIc question formats with proper timing and level-appropriate topics
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤖</div>
            <h4>AI Speech Analysis</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Advanced pronunciation, fluency, and content analysis with detailed feedback
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📈</div>
            <h4>Level Progression</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Track improvement from Novice to Advanced with targeted practice recommendations
            </p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎭</div>
            <h4>Role-Play Scenarios</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Interactive role-play practice for real-world communication situations
            </p>
          </div>
        </div>
      </div>

      {/* Sign-up CTA for non-users */}
      {!user && (
        <div id="signup-section" className="signup-cta-section" style={{ 
          marginTop: '60px', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2>Ready to Master OPIc Speaking? 🎯</h2>
          <p>Join thousands improving their oral proficiency with AI-powered practice</p>
          
          <div className="benefits-list" style={{ margin: '24px 0' }}>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>✅ 100% Free</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>🎙️ Speech Recognition</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>📊 Progress Tracking</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>🤖 AI Feedback</div>
          </div>

          <Link 
            href="/login" 
            className="btn btn-primary" 
            style={{ fontSize: '18px', padding: '12px 32px' }}
          >
            Start Free OPIc Practice
          </Link>
          
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Already have an account? <Link 
              href="/login" 
              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
            >Sign in here</Link>
          </p>
        </div>
      )}
    </div>
  );
}
