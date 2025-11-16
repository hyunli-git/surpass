// src/app/page.tsx

'use client';

import Hero from '@/components/Hero'
import Features from '@/components/Features'
import { useTestMode } from '@/contexts/TestModeContext';
import TestModeHomepage from '@/components/TestModeHomepage';

export default function HomePage() {
  const { isTestModeActive, selectedTest } = useTestMode();

  if (isTestModeActive && selectedTest) {
    return <TestModeHomepage />;
  }

  return (
    <>
      <Hero />
      <Features />
    </>
  );
}