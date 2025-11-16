// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import { useTestMode } from '@/contexts/TestModeContext';
import TestModeHomepage from '@/components/TestModeHomepage';
import type { User } from '@supabase/supabase-js';

export default function HomePage() {
  const { isTestModeActive, selectedTest, setSelectedTest } = useTestMode();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="page-container" style={{ 
        paddingTop: '100px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If user is signed in and in test mode, show test homepage
  if (isTestModeActive && selectedTest) {
    return <TestModeHomepage />;
  }

  // If user is signed in but not in test mode, redirect to test selection
  if (user && !isTestModeActive) {
    router.push('/get-started');
    return (
      <div className="page-container" style={{ 
        paddingTop: '100px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Redirecting to test selection...</div>
      </div>
    );
  }

  // Default: show marketing homepage for non-authenticated users
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}