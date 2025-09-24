// src/app/tcf-practice/page.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function TCFPracticePage() {
  const [selectedFormat, setSelectedFormat] = useState<'tcf' | 'tcf-canada' | null>(null);

  return (
    <>
      <section className="hero">
        <div className="container container-narrow">
          <h1>TCF/TCF Canada Practice</h1>
          <p>Préparez-vous pour le Test de connaissance du français</p>
        </div>
      </section>

      {/* Why Choose TCF/TCF Canada Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>Why Choose TCF/TCF Canada?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Globally Recognized</h3>
              <p>Accepted by French universities, employers, and immigration authorities worldwide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Adaptive Testing</h3>
              <p>Computer-based adaptive test that adjusts to your level for accurate assessment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Quick Results</h3>
              <p>Get your results immediately for speaking and writing, within 2 weeks for other skills</p>
            </div>
          </div>
        </div>
      </section>

      <section className="practice-section">
        <div className="container">
          <h2>Select Your Test Version</h2>
          <div className="format-cards">
            {/* TCF Card */}
            <div className="format-card">
              <div className="format-icon">🇫🇷</div>
              <h3>TCF</h3>
              <p className="format-subtitle">Test de connaissance du français général</p>
              <ul className="format-features">
                <li>✓ General French proficiency</li>
                <li>✓ University admissions</li>
                <li>✓ 3 mandatory + 2 optional modules</li>
                <li>✓ Valid for 2 years</li>
              </ul>
              <button 
                className={`btn ${selectedFormat === 'tcf' ? 'btn-selected' : 'btn-primary'}`} 
                style={{ width: '100%' }}
                onClick={() => setSelectedFormat('tcf')}
              >
                Select TCF
              </button>
            </div>

            {/* TCF Canada Card */}
            <div className="format-card">
              <div className="format-icon">🍁</div>
              <h3>TCF Canada</h3>
              <p className="format-subtitle">Pour l&apos;immigration au Canada</p>
              <ul className="format-features">
                <li>✓ Canadian immigration (Express Entry)</li>
                <li>✓ Economic immigration programs</li>
                <li>✓ 4 mandatory modules</li>
                <li>✓ NCLC level alignment</li>
              </ul>
              <button 
                className={`btn ${selectedFormat === 'tcf-canada' ? 'btn-selected' : 'btn-primary'}`}
                style={{ width: '100%' }}
                onClick={() => setSelectedFormat('tcf-canada')}
              >
                Select TCF Canada
              </button>
            </div>
          </div>

          {selectedFormat && (
            <div className="test-info-section" style={{ marginTop: 'var(--space-2xl)' }}>
              <h3>
                {selectedFormat === 'tcf' ? 'TCF Test Structure' : 'TCF Canada Test Structure'}
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
                      <span>29 questions</span>
                    </div>
                    <Link 
                      href={`/skill-practice/reading?test=${selectedFormat}&lang=fr`} 
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
                      <span>25 minutes</span>
                      <span>29 questions</span>
                    </div>
                    <Link 
                      href={`/skill-practice/listening?test=${selectedFormat}&lang=fr`} 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Practice Listening
                    </Link>
                  </div>

                  {/* Maîtrise des structures de la langue */}
                  <div className="module-card">
                    <div className="module-icon">📚</div>
                    <h4>Maîtrise des structures</h4>
                    <p className="module-subtitle">Language Structures</p>
                    <div className="module-details">
                      <span>15 minutes</span>
                      <span>18 questions</span>
                    </div>
                    <button 
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                      disabled
                    >
                      Coming Soon
                    </button>
                  </div>

                  {(selectedFormat === 'tcf-canada' || selectedFormat === 'tcf') && (
                    <>
                      {/* Expression écrite */}
                      <div className="module-card">
                        <div className="module-icon">✍️</div>
                        <h4>Expression écrite</h4>
                        <p className="module-subtitle">Written Expression</p>
                        <div className="module-details">
                          <span>60 minutes</span>
                          <span>3 tasks</span>
                        </div>
                        <Link 
                          href={`/skill-practice/writing?test=${selectedFormat}&lang=fr`} 
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
                          <span>12 minutes</span>
                          <span>3 tasks</span>
                        </div>
                        <Link 
                          href={`/skill-practice/speaking?test=${selectedFormat}&lang=fr`} 
                          className="btn btn-outline" 
                          style={{ width: '100%', marginTop: 'var(--space-md)' }}
                        >
                          Practice Speaking
                        </Link>
                      </div>
                    </>
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
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>TCF Score</th>
                        {selectedFormat === 'tcf-canada' && (
                          <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>NCLC</th>
                        )}
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>CECR</th>
                        <th style={{ padding: 'var(--space-md)', textAlign: 'left' }}>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>600-699</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>11-12</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>C2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Superior</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>500-599</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>9-10</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>C1</td>
                        <td style={{ padding: 'var(--space-md)' }}>Advanced</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>400-499</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>7-8</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>B2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Upper Intermediate</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>300-399</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>5-6</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>B1</td>
                        <td style={{ padding: 'var(--space-md)' }}>Intermediate</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>200-299</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>4</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>A2</td>
                        <td style={{ padding: 'var(--space-md)' }}>Elementary</td>
                      </tr>
                      <tr>
                        <td style={{ padding: 'var(--space-md)' }}>100-199</td>
                        {selectedFormat === 'tcf-canada' && (
                          <td style={{ padding: 'var(--space-md)' }}>1-3</td>
                        )}
                        <td style={{ padding: 'var(--space-md)' }}>A1</td>
                        <td style={{ padding: 'var(--space-md)' }}>Beginner</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Test Information */}
              <div className="test-info" style={{ marginTop: 'var(--space-2xl)' }}>
                <h3>Test Information</h3>
                <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
                  <div className="info-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <h4>Test Format</h4>
                    <p>{selectedFormat === 'tcf' ? 'Computer-based adaptive test with paper-based writing and speaking components' : 'Computer-based test designed specifically for Canadian immigration'}</p>
                  </div>
                  <div className="info-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <h4>Total Duration</h4>
                    <p>{selectedFormat === 'tcf' ? '1 hour 25 minutes (mandatory) + 1 hour 12 minutes (optional)' : '2 hours 37 minutes'}</p>
                  </div>
                  <div className="info-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <h4>Results</h4>
                    <p>Available immediately for multiple choice sections, within 2 weeks for writing and speaking</p>
                  </div>
                  <div className="info-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <h4>Validity</h4>
                    <p>2 years from the test date</p>
                  </div>
                </div>
              </div>

              {/* Mock Test Button */}
              <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                <Link 
                  href={`/mock-test/${selectedFormat}`}
                  className="btn btn-primary btn-large"
                  style={{ fontSize: '18px', padding: '16px 32px' }}
                >
                  Start Full {selectedFormat === 'tcf' ? 'TCF' : 'TCF Canada'} Mock Test
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}