// src/app/ielts-general-practice/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SkillPractice from '@/components/SkillPractice';
import MockTests from '@/components/MockTests';
import IeltsModePicker from '@/components/IeltsModePicker';

// 👇 이 부분이 정확한지 확인하세요.
export default function IeltsGeneralPracticePage() {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleStartMockTest = () => {
    setModalVisible(true);
  };

  const handleModeConfirm = (mode: 'normal' | 'test') => {
    setModalVisible(false);
    router.push(`/mock-test?mode=${mode}`);
  };

  return (
    <>
      {isModalVisible && (
        <IeltsModePicker
          onConfirm={handleModeConfirm}
          onCancel={() => setModalVisible(false)}
        />
      )}

      <section className="test-hero" style={{ background: 'linear-gradient(135deg, #667eea 0%, #4c51bf 100%)' }}>
        <div className="container container-narrow">
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <Link href="/ielts-practice" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              ← Back to IELTS Selection
            </Link>
          </div>
          <h1>IELTS General Training</h1>
          <p>Complete preparation for work, migration, and general English proficiency</p>
        </div>
      </section>

      <SkillPractice />
      <MockTests onStartMockTest={handleStartMockTest} />
    </>
  );
}