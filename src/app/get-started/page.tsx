'use client';

import { useState } from 'react';
import { Search, ArrowRight, Globe, Clock, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { LANGUAGE_TESTS, LANGUAGES, type LanguageTest } from '@/data/languageTests';

export default function GetStartedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'TOP_10' | 'TOP_11_20' | 'TOP_21_30'>('all');

  const filteredTests = LANGUAGE_TESTS.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = selectedLanguage === 'all' || test.language === selectedLanguage;
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  const topTests = LANGUAGE_TESTS.filter(test => test.category === 'TOP_10').slice(0, 6);

  const getTestPath = (test: LanguageTest) => {
    // Map test names to their practice pages
    const testRoutes: Record<string, string> = {
      'IELTS': '/ielts-practice',
      'TOEIC': '/skill-practice',
      'TEF': '/tef-practice',
      'TCF': '/tcf-practice',
      'OPIC': '/opic-practice',
      'TOEFL': '/skill-practice',
      'HSK': '/skill-practice',
      'JLPT': '/skill-practice'
    };
    
    return testRoutes[test.name] || '/skill-practice';
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <section className="hero" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container container-narrow">
          <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2.5rem' }}>
            Choose Your Language Test
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '40px' }}>
            Select from 30+ internationally recognized language proficiency tests
          </p>

          {/* Search and Filters */}
          <div style={{ marginBottom: '40px' }}>
            <div className="search-container" style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '20px', 
                  height: '20px', 
                  color: 'var(--text-muted)' 
                }} />
                <input
                  type="text"
                  placeholder="Search for a test (e.g., IELTS, TOEIC, HSK...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-input"
                  style={{ 
                    width: '100%', 
                    paddingLeft: '48px',
                    fontSize: '1rem',
                    height: '54px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Language Filter */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-input"
                style={{ minWidth: '180px' }}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="text-input"
                style={{ minWidth: '180px' }}
              >
                <option value="all">All Tests</option>
                <option value="TOP_10">Most Popular (Top 10)</option>
                <option value="TOP_11_20">Popular (Top 11-20)</option>
                <option value="TOP_21_30">Emerging (Top 21-30)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start - Most Popular Tests */}
      {!searchTerm && selectedLanguage === 'all' && selectedCategory === 'all' && (
        <section style={{ marginBottom: '60px' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
              Most Popular Tests
            </h2>
            <div className="grid grid-3">
              {topTests.map(test => (
                <Link 
                  key={test.id} 
                  href={getTestPath(test)}
                  className="test-card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="test-card popular-test" style={{ height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>{test.flag}</span>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
                          {test.name}
                        </h3>
                        <span style={{ 
                          color: 'var(--accent-blue)', 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          background: 'var(--bg-active)',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          #{test.rank} Most Popular
                        </span>
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      marginBottom: '16px',
                      lineHeight: '1.5'
                    }}>
                      {test.description}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {test.testTakers}
                        </span>
                      </div>
                      {test.format && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {test.format}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div className="btn btn-primary" style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px' 
                      }}>
                        Start Practice
                        <ArrowRight style={{ width: '18px', height: '18px' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Tests */}
      <section>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
              {searchTerm ? `Search Results (${filteredTests.length})` : 'All Tests'}
            </h2>
            {filteredTests.length > 0 && (
              <p style={{ color: 'var(--text-secondary)' }}>
                {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          {filteredTests.length === 0 ? (
            <div className="empty-state" style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: 'var(--text-secondary)'
            }}>
              <Globe style={{ width: '64px', height: '64px', margin: '0 auto 20px', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>No tests found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredTests.map(test => (
                <Link 
                  key={test.id} 
                  href={getTestPath(test)}
                  className="test-card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="test-card" style={{ height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>{test.flag}</span>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px' }}>
                          {test.name}
                        </h3>
                        <span style={{ 
                          color: 'var(--accent-blue)', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          background: 'var(--bg-active)',
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          #{test.rank}
                        </span>
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {test.description}
                    </p>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Users style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {test.testTakers}
                        </span>
                      </div>
                      {test.format && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <BookOpen style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {test.format}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <div className="btn btn-primary" style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px',
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
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ marginTop: '80px', marginBottom: '40px' }}>
        <div className="container container-narrow">
          <div className="cta-card" style={{ 
            textAlign: 'center', 
            padding: '40px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '12px' 
          }}>
            <h2 style={{ marginBottom: '16px' }}>Ready to start practicing?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Join thousands of learners who have improved their language test scores with our AI-powered platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/skill-practice" className="btn btn-primary">
                Start Free Practice
              </Link>
              <Link href="/login" className="btn">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}