// src/app/ielts-general-practice/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SkillPractice from '@/components/SkillPractice';
import MockTests from '@/components/MockTests';
import IeltsModePicker from '@/components/IeltsModePicker';

// 👇 이 부분이 정확한지 확인하세요.
export default function IeltsGeneralPracticePage() {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

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

      <section className="hero">
        <div className="container container-narrow">
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <button onClick={() => handleNavigation('/ielts-practice')} className="btn">
              ← Back to IELTS Selection
            </button>
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