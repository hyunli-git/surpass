'use client';

import Link from 'next/link';
import { useTestMode } from '@/contexts/TestModeContext';
import { Play, BookOpen, BarChart3, Clock, Target, TrendingUp, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function TestModeHomepage() {
  const { selectedTest } = useTestMode();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!selectedTest) return null;

  const getTestSpecificLinks = () => {
    const testSlug = selectedTest.name.toLowerCase().replace(/\s+/g, '-');
    console.log('TestModeHomepage - selectedTest:', selectedTest);
    console.log('TestModeHomepage - testSlug:', testSlug);
    
    const links = {
      practice: '/skill-practice',
      mockTest: `/mock-test/${testSlug}`
    };
    
    console.log('TestModeHomepage - generated links:', links);
    return links;
  };

  const links = getTestSpecificLinks();

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <section className="hero" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{selectedTest.flag}</div>
            <h1 style={{ marginBottom: '16px', fontSize: '2.5rem' }}>
              {selectedTest.name} Practice Mode
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {selectedTest.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                background: 'var(--bg-active)', 
                color: 'var(--accent-blue)', 
                padding: '6px 12px', 
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                #{selectedTest.rank} Most Popular
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {selectedTest.testTakers} test takers worldwide
              </span>
            </div>
            {user && (
              <div style={{ 
                marginTop: '24px', 
                padding: '12px 20px', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <User style={{ width: '16px', height: '16px' }} />
                Welcome back, {user.email}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-3" style={{ marginBottom: '60px' }}>
            <Link href={links.practice} className="test-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ 
                  background: 'var(--bg-active)', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px' 
                }}>
                  <BookOpen style={{ width: '36px', height: '36px', color: 'var(--accent-blue)' }} />
                </div>
                <h3 style={{ marginBottom: '12px' }}>Skill Practice</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Practice individual skills: reading, writing, listening, speaking
                </p>
              </div>
            </Link>

            <Link href={links.mockTest} className="test-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ 
                  background: 'var(--bg-active)', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px' 
                }}>
                  <Play style={{ width: '36px', height: '36px', color: 'var(--accent-green)' }} />
                </div>
                <h3 style={{ marginBottom: '12px' }}>Full Mock Test</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Take a complete practice test under real exam conditions
                </p>
              </div>
            </Link>

            <Link href="/my-page" className="test-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ 
                  background: 'var(--bg-active)', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px' 
                }}>
                  <BarChart3 style={{ width: '36px', height: '36px', color: 'var(--accent-purple)' }} />
                </div>
                <h3 style={{ marginBottom: '12px' }}>Track Progress</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Monitor your improvement and see detailed performance analytics
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Test Information */}
      <section style={{ marginBottom: '60px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
            About the {selectedTest.name}
          </h2>
          
          <div className="grid grid-3">
            <div className="instruction-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Clock style={{ width: '24px', height: '24px', color: 'var(--accent-blue)' }} />
                <h3>Test Format</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Format: {selectedTest.format || 'Computer-based'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)' }}>
                {selectedTest.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="instruction-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Target style={{ width: '24px', height: '24px', color: 'var(--accent-green)' }} />
                <h3>Target Audience</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                {selectedTest.targetAudience || 'Students, professionals, and immigrants seeking to demonstrate language proficiency'}
              </p>
            </div>

            <div className="instruction-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <TrendingUp style={{ width: '24px', height: '24px', color: 'var(--accent-purple)' }} />
                <h3>Popularity</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Ranked #{selectedTest.rank} globally
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Over {selectedTest.testTakers} people take this test annually
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ marginBottom: '40px' }}>
        <div className="container">
          <div className="cta-card" style={{ 
            textAlign: 'center', 
            padding: '40px', 
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', 
            borderRadius: '12px',
            color: 'white',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ marginBottom: '16px', color: 'white' }}>
              {user ? `Continue your ${selectedTest.name} journey` : `Ready to start your ${selectedTest.name} journey?`}
            </h2>
            <p style={{ marginBottom: '32px', opacity: 0.9 }}>
              {user 
                ? `Welcome back! Continue practicing or take a new mock test to track your progress.`
                : `Begin with skill-specific practice or jump into a full mock test to assess your current level.`
              }
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={links.practice} className="btn" style={{ 
                background: 'white', 
                color: 'var(--accent-blue)',
                fontWeight: '600'
              }}>
                {user ? 'Continue Practice' : 'Start Practice'}
              </Link>
              <Link href={links.mockTest} className="btn" style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                border: '2px solid white'
              }}>
                Take Mock Test
              </Link>
              {!user && (
                <Link href="/login" className="btn" style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  Sign In to Save Progress
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}