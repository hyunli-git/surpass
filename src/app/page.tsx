// src/app/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import { useTestMode } from '@/contexts/TestModeContext';
import TestModeHomepage from '@/components/TestModeHomepage';

export default function HomePage() {
  const { isTestModeActive, selectedTest } = useTestMode();
  const router = useRouter();

  useEffect(() => {
    // Handle auth token in URL hash (from email confirmations)
    const handleAuthToken = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (data.session) {
            // Clear the hash from URL
            window.location.hash = '';
            // Redirect to clean URL
            router.push('/');
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
    };

    handleAuthToken();
  }, [router]);

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