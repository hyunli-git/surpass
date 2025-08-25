// src/components/Features.tsx

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Features() {
  const t = useTranslations('features');
  
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>{t('title')}</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>{t('personalizedLearning.title')}</h3>
            <p>{t('personalizedLearning.description')}</p>
            <Link href="/tests" className="feature-link">{t('personalizedLearning.action')}</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>{t('speakingPractice.title')}</h3>
            <p>{t('speakingPractice.description')}</p>
            <Link href="/skill-practice/speaking" className="feature-link">{t('speakingPractice.action')}</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>{t('writingAssistant.title')}</h3>
            <p>{t('writingAssistant.description')}</p>
            <Link href="/skill-practice/writing" className="feature-link">{t('writingAssistant.action')}</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
            {t('testsSection.title')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            {t('testsSection.description')}
          </p>
          <Link href="/tests" className="btn btn-primary">
            {t('testsSection.browseAllTests')}
          </Link>
        </div>
      </div>
    </section>
  )
}