'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGE_TESTS, type LanguageTest } from '@/data/languageTests';

interface TestModeContextType {
  selectedTest: LanguageTest | null;
  setSelectedTest: (test: LanguageTest | null) => void;
  isTestModeActive: boolean;
  clearTestMode: () => void;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTest, setSelectedTestState] = useState<LanguageTest | null>(null);

  // Load selected test from localStorage on mount
  useEffect(() => {
    const savedTestId = localStorage.getItem('selectedTestId');
    if (savedTestId) {
      const test = LANGUAGE_TESTS.find(t => t.id === savedTestId);
      if (test) {
        setSelectedTestState(test);
      }
    }
  }, []);

  const setSelectedTest = (test: LanguageTest | null) => {
    setSelectedTestState(test);
    
    if (test) {
      localStorage.setItem('selectedTestId', test.id);
      // Store additional test mode data
      localStorage.setItem('testModeActive', 'true');
      localStorage.setItem('testModeStarted', new Date().toISOString());
    } else {
      localStorage.removeItem('selectedTestId');
      localStorage.removeItem('testModeActive');
      localStorage.removeItem('testModeStarted');
    }
  };

  const clearTestMode = () => {
    setSelectedTest(null);
  };

  const isTestModeActive = selectedTest !== null;

  return (
    <TestModeContext.Provider value={{
      selectedTest,
      setSelectedTest,
      isTestModeActive,
      clearTestMode
    }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const context = useContext(TestModeContext);
  if (context === undefined) {
    throw new Error('useTestMode must be used within a TestModeProvider');
  }
  return context;
}