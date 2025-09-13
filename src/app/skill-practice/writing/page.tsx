"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { TestService } from '@/lib/database/testService';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { SkillPracticeSet } from '@/lib/database/types';

export default function WritingPracticePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceSets, setPracticeSets] = useState<SkillPracticeSet[]>([]);
  const [loadingPractice, setLoadingPractice] = useState(true);
  const searchParams = useSearchParams();
  const testType = searchParams.get('test') || 'ielts';
  const language = searchParams.get('lang') || 'en';
  
  const isTEF = testType === 'tef';
  const legacy = searchParams.get('legacy');
  const shouldRedirect = !isTEF && legacy !== '1';

  // All hooks must be called before any conditional returns
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
  }, [isTEF]);

  // Load practice sets from database
  useEffect(() => {
    const loadPracticeSets = async () => {
      try {
        setLoadingPractice(true);
        const testCode = isTEF ? 'TEF' : 'IELTS';
        const sets = await TestService.getSkillPracticeSets(testCode, 'writing');
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

  // Immediate redirect to the new IELTS GT Writing page to avoid showing loading UI
  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/ielts-general-practice/writing');
    }
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null; // prevent flicker
  }

  // Map database practice sets to UI format
  const writingTasks = practiceSets.map(set => ({
    id: set.id.toString(),
    title: set.title,
    subtitle: set.skill?.name || 'Writing',
    description: set.description || '',
    prompt: set.content?.[0]?.instructions,
    timeLimit: set.estimated_duration ? `${set.estimated_duration} minutes` : '30 minutes',
    icon: set.skill?.icon || '📝',
    difficulty: set.difficulty || 'Intermediate',
    link: `/skill-practice/writing/practice/${set.id}?test=${testType}&lang=${language}`
  }));

  const handleStartTask = (taskLink: string) => {
    if (!user) {
      const signupSection = document.getElementById('signup-section');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.location.href = taskLink;
  };

  if (loadingPractice) {
    return (
      <div className="container" style={{ margin: '50px auto' }}>
        <div className="writing-hero">
          <h1>{isTEF ? 'TEF Expression écrite Practice' : 'IELTS Writing Practice'}</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div>Loading writing practice sets...</div>
          </div>
        </div>
      </div>
    );
  }

  if (writingTasks.length === 0) {
    return (
      <div className="container" style={{ margin: '50px auto' }}>
        <div className="writing-hero">
          <h1>{isTEF ? 'TEF Expression écrite Practice' : 'IELTS Writing Practice'}</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>📚 Content Loading...</h3>
            <p>Practice sets are being prepared. Please check back shortly!</p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/tests" className="btn btn-primary">
                Browse All Tests
              </Link>
            </div>
            {!isTEF && (
              <div style={{ marginTop: '12px' }}>
                <Link href="/ielts-general-practice/writing" className="btn">
                  Try IELTS GT Writing Practice (no DB required)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '50px auto' }}>
      <div className="writing-hero">
        <h1>{isTEF ? 'TEF Expression écrite Practice' : 'IELTS Writing Practice'}</h1>
        <p>{isTEF ? 'Maîtrisez les deux sections avec des commentaires alimentés par l&apos;IA et une analyse de notation détaillée' : 'Master both tasks with AI-powered feedback and detailed scoring analysis'}</p>
        {!user && (
          <p className="hero-cta">
            <span style={{ backgroundColor: '#f0f8ff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>
              🎁 Free account required - Join thousands of students improving their scores!
            </span>
          </p>
        )}
      </div>

      <div className="writing-tasks-grid">
        {writingTasks.map((task) => (
          <div key={task.id} className="writing-task-card">
            <div className="task-header">
              <div className="task-icon">{task.icon}</div>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p className="task-subtitle">{task.subtitle}</p>
              </div>
              <div className="difficulty-badge">
                {task.difficulty}
              </div>
            </div>

            <div className="task-details">
              <p className="task-description">{task.description}</p>
              
              {task.prompt && (
                <div className="task-prompt" style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: 'var(--space-md)', 
                  borderRadius: '8px', 
                  marginTop: 'var(--space-md)',
                  border: '1px solid var(--border-light)'
                }}>
                  <h5 style={{ marginBottom: 'var(--space-sm)', color: 'var(--primary)' }}>
                    📋 Instructions:
                  </h5>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'inherit', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {task.prompt}
                  </pre>
                </div>
              )}
              
              <div className="task-specs">
                <div className="spec-item">
                  <span className="spec-icon">⏱️</span>
                  <span>Time: {task.timeLimit}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">🎯</span>
                  <span>{isTEF ? 'Évaluation IA' : 'AI Evaluation'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">📈</span>
                  <span>{isTEF ? 'Score TEF' : 'Band Scoring'}</span>
                </div>
              </div>
            </div>

            <div className="task-footer">
              {user ? (
                <Link 
                  href={task.link} 
                  className="btn btn-primary task-btn"
                >
                  Start {task.title}
                </Link>
              ) : (
                <button 
                  onClick={() => handleStartTask(task.link)}
                  className="btn btn-primary task-btn"
                >
                  Start {task.title} (Free Account)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="writing-features">
        <h2>What You&apos;ll Get:</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>AI-Powered Analysis</h4>
            <p>Comprehensive evaluation using GPT-4 for accurate scoring</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Detailed Scores</h4>
            <p>Individual scores for different assessment criteria</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h4>Improvement Guide</h4>
            <p>Specific suggestions to reach your target score</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Instant Feedback</h4>
            <p>Get your results immediately after submission</p>
          </div>
        </div>
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
          <p>Join thousands of students who improved their scores with AI-powered feedback</p>
          
          <div className="benefits-list" style={{ margin: '24px 0' }}>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>✅ 100% Free</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>⚡ Instant Access</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>🎯 AI Scoring</div>
          </div>

          <Link 
            href="/login" 
            className="btn btn-primary" 
            style={{ fontSize: '18px', padding: '12px 32px' }}
          >
            Create Free Account
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
