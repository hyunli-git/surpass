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
  console.log('MockTestContent testCode:', testCode);
  
  // Convert URL slug back to test name
  const test = LANGUAGE_TESTS.find(t => {
    const testSlug = t.name.toLowerCase().replace(/\s+/g, '-');
    return testSlug === testCode.toLowerCase() || t.name.toLowerCase() === testCode.toLowerCase();
  });

  console.log('Found test:', test);

  if (!test) {
    console.log('Test not found for code:', testCode);
    console.log('Available tests:', LANGUAGE_TESTS.map(t => ({ 
      name: t.name, 
      slug: t.name.toLowerCase().replace(/\s+/g, '-') 
    })));
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