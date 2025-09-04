// src/app/skill-practice/writing/page.tsx

"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function WritingPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };

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

  const writingTasks = [
    {
      id: 'task1',
      title: 'Writing Task 1',
      subtitle: 'Academic Writing - Data Analysis',
      description: 'Describe visual information (graphs, charts, diagrams) in 150+ words',
      timeLimit: '20 minutes',
      icon: '📊',
      difficulty: 'Intermediate',
      link: '/skill-practice/writing/task1'
    },
    {
      id: 'task2', 
      title: 'Writing Task 2',
      subtitle: 'Academic Writing - Essay',
      description: 'Write an argumentative essay on a given topic in 250+ words',
      timeLimit: '40 minutes',
      icon: '📝',
      difficulty: 'Advanced',
      link: '/skill-practice/writing/task2'
    }
  ];

  const handleStartTask = (taskLink: string) => {
    if (!user) {
      // Scroll to sign up section instead of immediate redirect
      const signupSection = document.getElementById('signup-section');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    window.location.href = taskLink;
  };

  return (
    <div className="container" style={{ margin: '50px auto' }}>
      <div className="writing-hero">
        <h1>IELTS Writing Practice</h1>
        <p>Master both tasks with AI-powered feedback and detailed scoring analysis</p>
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
              
              <div className="task-specs">
                <div className="spec-item">
                  <span className="spec-icon">⏱️</span>
                  <span>Time: {task.timeLimit}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">🎯</span>
                  <span>AI Evaluation</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">📈</span>
                  <span>Band Scoring</span>
                </div>
              </div>
            </div>

            <div className="task-footer">
              {user ? (
                <button 
                  onClick={() => handleNavigation(task.link)} 
                  className="btn btn-primary task-btn"
                >
                  Start {task.title}
                </button>
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
            <p>Comprehensive evaluation using GPT-4 for accurate IELTS scoring</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Detailed Band Scores</h4>
            <p>Individual scores for Task Achievement, Coherence, Lexical Resource, Grammar</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h4>Improvement Guide</h4>
            <p>Specific suggestions to reach your target band score</p>
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
          <p>Join thousands of students who improved their IELTS scores with AI-powered feedback</p>
          
          <div className="benefits-list" style={{ margin: '24px 0' }}>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>✅ 100% Free</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>⚡ Instant Access</div>
            <div style={{ display: 'inline-block', margin: '0 12px' }}>🎯 AI Scoring</div>
          </div>

          <button 
            onClick={() => handleNavigation('/login')} 
            className="btn btn-primary" 
            style={{ fontSize: '18px', padding: '12px 32px' }}
          >
            Create Free Account
          </button>
          
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Already have an account? <button 
              onClick={() => handleNavigation('/login')} 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >Sign in here</button>
          </p>
        </div>
      )}
    </div>
  );
}