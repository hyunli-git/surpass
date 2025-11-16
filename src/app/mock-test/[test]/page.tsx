'use client';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DynamicMockTest from '@/components/DynamicMockTest';
import { LANGUAGE_TESTS } from '@/data/languageTests';

interface MockTestPageProps {
  params: {
    test: string;
  };
}

function MockTestContent({ testCode }: { testCode: string }) {
  // Validate that the test exists
  const test = LANGUAGE_TESTS.find(t => 
    t.name.toLowerCase().replace(/\s+/g, '-') === testCode.toLowerCase() ||
    t.name.toLowerCase() === testCode.toLowerCase()
  );

  if (!test) {
    notFound();
  }

  return <DynamicMockTest testCode={test.name} />;
}

export default function TestSpecificMockTestPage({ params }: MockTestPageProps) {
  return (
    <Suspense fallback={<div>Loading {params.test} mock test...</div>}>
      <MockTestContent testCode={params.test} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  // Generate static paths for all available tests
  return LANGUAGE_TESTS.map((test) => ({
    test: test.name.toLowerCase().replace(/\s+/g, '-')
  }));
}