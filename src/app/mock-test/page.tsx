'use client';

import { Suspense } from 'react';
import { useTestMode } from '@/contexts/TestModeContext';
import DynamicMockTest from '@/components/DynamicMockTest';

function MockTestContent() {
  const { selectedTest } = useTestMode();
  
  return <DynamicMockTest testCode={selectedTest?.name} />;
}

export default function MockTestPage() {
  return (
    <Suspense fallback={<div>Loading mock test...</div>}>
      <MockTestContent />
    </Suspense>
  );
}