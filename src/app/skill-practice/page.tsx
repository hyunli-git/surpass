'use client';

import Link from 'next/link';
import { BookOpen, Headphones, Mic, PenTool, ArrowRight } from 'lucide-react';
import { useTestMode } from '@/contexts/TestModeContext';

interface SkillCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  skills: string[];
}

export default function SkillPracticePage() {
  const { selectedTest } = useTestMode();

  const skills: SkillCard[] = [
    {
      title: 'Reading',
      description: 'Improve your reading comprehension with passages and questions',
      icon: <BookOpen style={{ width: '32px', height: '32px' }} />,
      href: '/skill-practice/reading',
      color: 'var(--accent-blue)',
      skills: ['Comprehension', 'Vocabulary', 'Speed Reading', 'Critical Analysis']
    },
    {
      title: 'Writing',
      description: 'Practice essays, letters, and reports with AI feedback',
      icon: <PenTool style={{ width: '32px', height: '32px' }} />,
      href: '/skill-practice/writing',
      color: 'var(--accent-green)',
      skills: ['Essay Structure', 'Grammar', 'Vocabulary', 'Coherence']
    },
    {
      title: 'Listening',
      description: 'Train your ear with conversations, lectures, and podcasts',
      icon: <Headphones style={{ width: '32px', height: '32px' }} />,
      href: '/skill-practice/listening',
      color: 'var(--accent-purple)',
      skills: ['Note-taking', 'Main Ideas', 'Details', 'Inference']
    },
    {
      title: 'Speaking',
      description: 'Record responses and get pronunciation feedback',
      icon: <Mic style={{ width: '32px', height: '32px' }} />,
      href: '/skill-practice/speaking',
      color: 'var(--accent-amber)',
      skills: ['Fluency', 'Pronunciation', 'Grammar', 'Vocabulary']
    }
  ];

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <section className="hero" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {selectedTest && (
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{selectedTest.flag}</div>
            )}
            <h1 style={{ marginBottom: '16px', fontSize: '2.5rem' }}>
              {selectedTest ? `${selectedTest.name} Skill Practice` : 'Skill Practice'}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Master individual skills with targeted practice exercises and instant AI feedback
            </p>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section style={{ marginBottom: '60px' }}>
        <div className="container">
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--space-xl)' 
          }}>
            {skills.map((skill, index) => (
              <Link 
                key={skill.title}
                href={skill.href}
                className="test-card"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  height: '100%',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    background: `linear-gradient(135deg, ${skill.color}15, ${skill.color}05)`,
                    borderRadius: '12px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    color: skill.color
                  }}>
                    {skill.icon}
                  </div>
                  
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>
                    {skill.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}>
                    {skill.description}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                      }}>
                        Skills covered:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skill.skills.map(item => (
                          <span 
                            key={item}
                            style={{
                              background: 'var(--bg-secondary)',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: skill.color,
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      Start Practice
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section style={{ marginBottom: '40px' }}>
        <div className="container">
          <div style={{ 
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ marginBottom: '16px' }}>How Skill Practice Works</h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-lg)',
              marginTop: '32px'
            }}>
              <div>
                <div style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--accent-blue)',
                  marginBottom: '8px'
                }}>
                  1
                </div>
                <h4 style={{ marginBottom: '8px' }}>Choose a Skill</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Select the skill you want to practice
                </p>
              </div>
              <div>
                <div style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--accent-green)',
                  marginBottom: '8px'
                }}>
                  2
                </div>
                <h4 style={{ marginBottom: '8px' }}>Complete Exercises</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Work through targeted practice questions
                </p>
              </div>
              <div>
                <div style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--accent-purple)',
                  marginBottom: '8px'
                }}>
                  3
                </div>
                <h4 style={{ marginBottom: '8px' }}>Get AI Feedback</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Receive instant, personalized feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}