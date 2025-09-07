const fs = require('fs');
const path = require('path');

// Script to remove all hardcoded test content and make components purely database-driven
class HardcodedContentRemover {
  
  static updateWritingPage() {
    console.log('✂️ Removing hardcoded content from Writing page...');
    
    const filePath = path.join(__dirname, '../src/app/[locale]/skill-practice/writing/page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the entire fallback section with database-only approach
    const newContent = `"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { TestService } from '@/lib/database/testService';
import type { User } from '@supabase/supabase-js';
import type { SkillPracticeSet } from '@/lib/database/types';

export default function WritingPracticePage() {
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

  // Map database practice sets to UI format
  const writingTasks = practiceSets.map(set => ({
    id: set.id.toString(),
    title: set.title,
    subtitle: set.skill?.name || 'Writing',
    description: set.description || '',
    prompt: set.content?.[0]?.instructions,
    timeLimit: set.estimated_duration ? \`\${set.estimated_duration} minutes\` : '30 minutes',
    icon: set.skill?.icon || '📝',
    difficulty: set.difficulty || 'Intermediate',
    link: \`/skill-practice/writing/practice/\${set.id}?test=\${testType}&lang=\${language}\`
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
}`;

    fs.writeFileSync(filePath, newContent);
    console.log('    ✅ Writing page updated - removed all hardcoded fallbacks');
  }

  static updateReadingPage() {
    console.log('✂️ Updating Reading page to be database-driven...');
    
    const filePath = path.join(__dirname, '../src/app/[locale]/skill-practice/reading/page.tsx');
    
    const newContent = `"use client";

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
    window.location.href = \`/skill-practice/reading/practice/\${setId}?test=\${testType}&lang=\${language}\`;
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
}`;

    fs.writeFileSync(filePath, newContent);
    console.log('    ✅ Reading page updated - now fully database-driven');
  }

  static run() {
    console.log('🚀 Removing ALL Hardcoded Content');
    console.log('==================================');
    console.log('Making system 100% database-driven');
    console.log('');
    
    this.updateWritingPage();
    this.updateReadingPage();
    
    console.log('');
    console.log('✅ All hardcoded content removed!');
    console.log('');
    console.log('🎯 Components are now:');
    console.log('  ✅ 100% database-driven');
    console.log('  ✅ No hardcoded fallbacks');
    console.log('  ✅ Smart loading states');
    console.log('  ✅ User-friendly empty states');
    console.log('');
    console.log('📊 When database is empty:');
    console.log('  → Shows "Content Loading..." message');
    console.log('  → Provides navigation back to main tests');
    console.log('  → No broken experiences');
    console.log('');
    console.log('📊 When database has content:');
    console.log('  → Loads extensive practice sets dynamically');
    console.log('  → Shows variety and difficulty levels');
    console.log('  → Professional user experience');
    console.log('');
    console.log('🚀 Execute database schema + insertion script to activate!');
  }
}

HardcodedContentRemover.run();