// src/components/TestList.tsx

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Test {
  id: number;
  name: string;
  language_group: string;
  badge_type: string;
  badge_text: string;
  subtitle: string;
  features: string[];
}

export default function TestList({ tests }: { tests: Test[] | null }) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const t = useTranslations('tests');

  const languageGroups = useMemo(() => {
    if (!tests) return [];
    
    const groups = tests.reduce((acc, test) => {
      const lang = test.language_group;
      if (!acc[lang]) {
        acc[lang] = 0;
      }
      acc[lang]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    if (selectedLanguage === 'all') return tests;
    return tests.filter(test => test.language_group === selectedLanguage);
  }, [tests, selectedLanguage]);

  if (!tests) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="filter-pills">
          <button 
            className={`filter-pill ${selectedLanguage === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLanguage('all')}
          >
            {t('allTests')} ({tests.length})
          </button>
          {languageGroups.map(([language, count]) => (
            <button 
              key={language}
              className={`filter-pill ${selectedLanguage === language ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(language)}
            >
              {t(`languages.${language}` as keyof typeof t)} ({count})
            </button>
          ))}
        </div>

        <div className="grid grid-3">
          {filteredTests.map((test) => (
            <div key={test.id} className="test-card" data-lang={test.language_group}>
              <div className={`badge badge-${test.badge_type}`}>{test.badge_text}</div>
              <h3>{test.name}</h3>
              <p className="test-card-subtitle">{test.subtitle}</p>
              <ul className="test-card-features">
                {test.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              
              {test.name.includes('IELTS') ? (
                <Link 
                  href="/ielts-practice" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  {t('startPractice')}
                </Link>
              ) : test.name.includes('TEF') ? (
                <Link 
                  href="/tef-practice" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  {t('startPractice')}
                </Link>
              ) : test.name.includes('OPIc') || test.name.includes('OPIC') ? (
                <Link 
                  href="/opic-practice" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  {t('startPractice')}
                </Link>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} disabled>
                  {t('comingSoon')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}