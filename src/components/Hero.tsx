// src/components/Hero.tsx

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  
  return (
    <section className="hero">
      <div className="container container-narrow">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        <div className="hero-actions">
          <Link href="/tests" className="btn btn-primary">{t('startLearning')}</Link>
          <Link href="/tests" className="btn">{t('browseTests')}</Link>
        </div>
      </div>
    </section>
  )
}