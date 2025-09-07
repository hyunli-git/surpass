"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { TestService } from '@/lib/database/testService';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import type { SkillPracticeSet } from '@/lib/database/types';

export default function ReadingPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceSets, setPracticeSets] = useState<SkillPracticeSet[]>([]);
  const [loadingPractice, setLoadingPractice] = useState(true);
  
  const searchParams = useSearchParams();
  const testType = searchParams.get('test') || 'ielts';
  const language = searchParams.get('lang') || 'en';
  const isTEF = testType === 'tef';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load practice sets from database
  useEffect(() => {
    const loadPracticeSets = async () => {
      try {
        setLoadingPractice(true);
        const testCode = isTEF ? 'TEF' : 'IELTS';
        const sets = await TestService.getSkillPracticeSets(testCode, 'reading');
        setPracticeSets(sets);
      } catch (error) {
        console.error('Error loading practice sets:', error);
        setPracticeSets([]);
      } finally {
        setLoadingPractice(false);
      }
    };

    loadPracticeSets();
  }, [testType, isTEF]);

  const handleStartPractice = (setId: number) => {
    if (!user) {
      const signupSection = document.getElementById('signup-section');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.location.href = `/skill-practice/reading/practice/${setId}?test=${testType}&lang=${language}`;
  };

  if (loadingPractice) {
    return (
      <div className="container" style={{ margin: '50px auto' }}>
        <h1>{isTEF ? 'TEF Compréhension écrite' : 'IELTS Reading Practice'}</h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading reading practice sets...</div>
        </div>
      </div>
    );
  }

  if (practiceSets.length === 0) {
    return (
      <div className="container" style={{ margin: '50px auto' }}>
        <h1>{isTEF ? 'TEF Compréhension écrite' : 'IELTS Reading Practice'}</h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>📚 Content Loading...</h3>
          <p>Reading practice sets are being prepared. Please check back shortly!</p>
          <Link href="/tests" className="btn btn-primary">Browse All Tests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '50px auto' }}>
      <h1>{isTEF ? 'TEF Compréhension écrite' : 'IELTS Reading Practice'}</h1>
      <p>Practice with authentic reading passages and questions</p>

      <div className="practice-sets-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        {practiceSets.map((set) => (
          <div key={set.id} className="practice-set-card" style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="set-header">
              <h3>{set.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{set.description}</p>
            </div>
            
            <div className="set-details" style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                <span>📊 Difficulty:</span>
                <strong>{set.difficulty}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                <span>⏱️ Duration:</span>
                <strong>{set.estimated_duration} minutes</strong>
              </div>
              {set.topics && set.topics.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <span>🏷️ Topics:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {set.topics.map((topic, index) => (
                      <span key={index} style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '12px'
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleStartPractice(set.id)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {user ? 'Start Practice' : 'Start Practice (Free Account)'}
            </button>
          </div>
        ))}
      </div>

      {!user && (
        <div id="signup-section" className="signup-cta-section" style={{ 
          marginTop: '60px', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2>Ready to Start Practicing? 🚀</h2>
          <p>Create a free account to access all reading practice sets</p>
          
          <Link href="/login" className="btn btn-primary" style={{ fontSize: '18px', padding: '12px 32px' }}>
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  );
}