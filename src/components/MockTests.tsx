// src/components/MockTests.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import Link from 'next/link';

// onStartMockTest 함수를 props로 받도록 정의합니다.
interface MockTestsProps {
  onStartMockTest: () => void;
}

export default function MockTests({ onStartMockTest }: MockTestsProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleMockTestClick = () => {
    if (!user) {
      const signupSection = document.getElementById('mock-test-signup');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    onStartMockTest();
  };

  return (
    <>
      <section className="practice-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2>General Training Mock Tests</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
            Simulate the real exam experience with complete practice tests
            {!user && (
              <span style={{ display: 'block', marginTop: '8px', fontSize: '14px', color: '#0066cc' }}>
                🎁 Free account required for full mock tests
              </span>
            )}
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
              <button 
                onClick={handleMockTestClick} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                {user ? 'Start Full Test' : 'Start Full Test (Free Account)'}
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
              <button 
                onClick={handleMockTestClick}
                className="btn" 
                style={{ width: '100%' }}
              >
                {user ? 'Start Quick Test' : 'Start Quick Test (Free Account)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section id="mock-test-signup" style={{ 
          padding: '40px 20px',
          backgroundColor: '#fff',
          borderTop: '2px solid #f0f0f0'
        }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h3>Ready for Your Mock Test? 📝</h3>
            <p>Get detailed scoring analysis and personalized feedback on your performance</p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px', 
              margin: '20px 0',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#28a745' }}>✅ Detailed Band Scores</span>
              <span style={{ color: '#28a745' }}>⚡ Instant Results</span>
              <span style={{ color: '#28a745' }}>🎯 Performance Analysis</span>
            </div>

            <Link 
              href="/login" 
              className="btn btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
