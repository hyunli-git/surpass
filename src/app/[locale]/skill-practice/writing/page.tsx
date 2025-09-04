// src/app/skill-practice/writing/page.tsx

"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function WritingPracticePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  const writingTasks = isTEF ? [
    {
      id: 'section-a',
      title: 'Section A - Message',
      subtitle: 'Situation professionnelle',
      description: 'Vous travaillez dans une entreprise de marketing. Votre collègue Marie vous a envoyé par erreur un document confidentiel destiné à un autre service. Écrivez-lui un courriel pour l\'informer de cette erreur tout en restant poli et professionnel.',
      prompt: 'Consignes :\n• Informez Marie de l\'erreur\n• Mentionnez que vous n\'avez pas consulté le document\n• Suggérez une solution\n• Gardez un ton professionnel\n\nNombre de mots requis : 60 à 120 mots',
      timeLimit: '30 minutes',
      icon: '✉️',
      difficulty: 'Intermediate',
      link: '/skill-practice/writing/task1?test=tef&lang=fr'
    },
    {
      id: 'section-b', 
      title: 'Section B - Argumentation',
      subtitle: 'Le télétravail : avantage ou inconvénient ?',
      description: 'Le télétravail s\'est développé rapidement ces dernières années. Certains pensent que c\'est une révolution positive pour l\'équilibre vie-travail, d\'autres estiment que cela nuit à la productivité et à l\'esprit d\'équipe.',
      prompt: 'Consignes :\n• Présentez votre point de vue sur le télétravail\n• Donnez deux arguments principaux\n• Illustrez avec des exemples concrets\n• Concluez en proposant une solution équilibrée\n\nNombre de mots requis : 200 à 250 mots',
      timeLimit: '30 minutes',
      icon: '📝',
      difficulty: 'Advanced',
      link: '/skill-practice/writing/task2?test=tef&lang=fr'
    }
  ] : [
    {
      id: 'task1',
      title: 'Writing Task 1',
      subtitle: 'Academic Writing - Data Analysis',
      description: 'Describe visual information (graphs, charts, diagrams) in 150+ words',
      timeLimit: '20 minutes',
      icon: '📊',
      difficulty: 'Intermediate',
      link: '/skill-practice/writing/task1',
      prompt: undefined // No detailed prompt for IELTS
    },
    {
      id: 'task2', 
      title: 'Writing Task 2',
      subtitle: 'Academic Writing - Essay',
      description: 'Write an argumentative essay on a given topic in 250+ words',
      timeLimit: '40 minutes',
      icon: '📝',
      difficulty: 'Advanced',
      link: '/skill-practice/writing/task2',
      prompt: undefined // No detailed prompt for IELTS
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
                    📋 Instructions détaillées :
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