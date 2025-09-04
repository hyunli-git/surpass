// src/app/tef-practice/page.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function TEFPracticePage() {
  const [selectedFormat, setSelectedFormat] = useState<'tef' | 'tef-canada' | null>(null);

  return (
    <>
      <section className="hero">
        <div className="container container-narrow">
          <h1>TEF/TEF Canada Practice</h1>
          <p>Préparez-vous pour le Test d&apos;évaluation de français</p>
        </div>
      </section>

      <section className="practice-section">
        <div className="container">
          <h2>Select Your Test Version</h2>
          <div className="format-cards">
            {/* TEF Card */}
            <div className="format-card">
              <div className="format-icon">🇫🇷</div>
              <h3>TEF</h3>
              <p className="format-subtitle">Test d&apos;évaluation de français général</p>
              <ul className="format-features">
                <li>✓ General French proficiency</li>
                <li>✓ Academic & professional purposes</li>
                <li>✓ 5 test modules available</li>
                <li>✓ Valid for 2 years</li>
              </ul>
              <button 
                className={`btn ${selectedFormat === 'tef' ? 'btn-selected' : 'btn-primary'}`} 
                style={{ width: '100%' }}
                onClick={() => setSelectedFormat('tef')}
              >
                Select TEF
              </button>
            </div>

            {/* TEF Canada Card */}
            <div className="format-card">
              <div className="format-icon">🍁</div>
              <h3>TEF Canada</h3>
              <p className="format-subtitle">Pour l&apos;immigration au Canada</p>
              <ul className="format-features">
                <li>✓ Canadian immigration (Express Entry)</li>
                <li>✓ Quebec immigration (PEQ)</li>
                <li>✓ 4 mandatory modules</li>
                <li>✓ CLB level conversion</li>
              </ul>
              <button 
                className={`btn ${selectedFormat === 'tef-canada' ? 'btn-selected' : 'btn-primary'}`}
                style={{ width: '100%' }}
                onClick={() => setSelectedFormat('tef-canada')}
              >
                Select TEF Canada
              </button>
            </div>
          </div>

          {selectedFormat && (
            <div className="test-info-section" style={{ marginTop: 'var(--space-2xl)' }}>
              <h3>
                {selectedFormat === 'tef' ? 'TEF Test Structure' : 'TEF Canada Test Structure'}
              </h3>
              <div className="test-modules">
                <div className="module-grid">
                  {/* Compréhension écrite */}
                  <div className="module-card">
                    <div className="module-icon">📖</div>
                    <h4>Compréhension écrite</h4>
                    <p className="module-subtitle">Reading Comprehension</p>
                    <div className="module-details">
                      <span>60 minutes</span>
                      <span>50 questions</span>
                    </div>
                    <Link 
                      href="/skill-practice/reading?test=tef&lang=fr" 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Practice Reading
                    </Link>
                  </div>

                  {/* Compréhension orale */}
                  <div className="module-card">
                    <div className="module-icon">🎧</div>
                    <h4>Compréhension orale</h4>
                    <p className="module-subtitle">Listening Comprehension</p>
                    <div className="module-details">
                      <span>40 minutes</span>
                      <span>60 questions</span>
                    </div>
                    <Link 
                      href="/skill-practice/listening?test=tef&lang=fr" 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Practice Listening
                    </Link>
                  </div>

                  {/* Expression écrite */}
                  <div className="module-card">
                    <div className="module-icon">✍️</div>
                    <h4>Expression écrite</h4>
                    <p className="module-subtitle">Written Expression</p>
                    <div className="module-details">
                      <span>60 minutes</span>
                      <span>2 tasks</span>
                    </div>
                    <Link 
                      href="/skill-practice/writing?test=tef&lang=fr" 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Practice Writing
                    </Link>
                  </div>

                  {/* Expression orale */}
                  <div className="module-card">
                    <div className="module-icon">🗣️</div>
                    <h4>Expression orale</h4>
                    <p className="module-subtitle">Speaking Expression</p>
                    <div className="module-details">
                      <span>15 minutes</span>
                      <span>2 sections</span>
                    </div>
                    <Link 
                      href="/skill-practice/speaking?test=tef&lang=fr" 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Practice Speaking
                    </Link>
                  </div>

                  {selectedFormat === 'tef' && (
                    /* Lexique et structure (TEF only) */
                    <div className="module-card">
                      <div className="module-icon">📚</div>
                      <h4>Lexique et structure</h4>
                      <p className="module-subtitle">Vocabulary & Grammar</p>
                      <div className="module-details">
                        <span>30 minutes</span>
                        <span>40 questions</span>
                      </div>
                      <button 
                        className="btn btn-outline" 
                        style={{ width: '100%', marginTop: 'var(--space-md)' }}
                        disabled
                      >
                        Coming Soon
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Score Information */}
              <div className="score-info" style={{ marginTop: 'var(--space-2xl)' }}>
                <h3>Score Levels</h3>
                <div className="score-table">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>TEF Score</th>
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>NCLC/CLB</th>
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>CECR</th>
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>834-900</td>
                        <td style={{ padding: 'var(--space-md)' }}>12</td>
                        <td style={{ padding: 'var(--space-md)' }}>C2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Superior</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>699-833</td>
                        <td style={{ padding: 'var(--space-md)' }}>10-11</td>
                        <td style={{ padding: 'var(--space-md)' }}>C1</td>
                        <td style={{ padding: 'var(--space-md)' }}>Advanced</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>541-698</td>
                        <td style={{ padding: 'var(--space-md)' }}>7-9</td>
                        <td style={{ padding: 'var(--space-md)' }}>B2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Upper Intermediate</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>361-540</td>
                        <td style={{ padding: 'var(--space-md)' }}>5-6</td>
                        <td style={{ padding: 'var(--space-md)' }}>B1</td>
                        <td style={{ padding: 'var(--space-md)' }}>Intermediate</td>
                      </tr>
                      <tr>
                        <td style={{ padding: 'var(--space-md)' }}>204-360</td>
                        <td style={{ padding: 'var(--space-md)' }}>4</td>
                        <td style={{ padding: 'var(--space-md)' }}>A2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Elementary</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mock Test Button */}
              <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                <Link 
                  href={`/mock-test?test=${selectedFormat}&lang=fr`}
                  className="btn btn-primary btn-large"
                  style={{ fontSize: '18px', padding: '16px 32px' }}
                >
                  Start Full {selectedFormat === 'tef' ? 'TEF' : 'TEF Canada'} Mock Test
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="section" style={{ background: 'var(--bg-secondary)', marginTop: 'var(--space-3xl)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Why Choose TEF/TEF Canada?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Internationally Recognized</h3>
              <p>Accepted by universities, employers, and immigration authorities worldwide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Accurate Assessment</h3>
              <p>Precisely evaluates your French language skills across all competencies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Immigration Pathway</h3>
              <p>Essential for Canadian Express Entry and Quebec immigration programs</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}