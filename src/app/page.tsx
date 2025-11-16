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
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 3000);

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [loading]);

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

  // If user is signed in and in test mode, show test homepage
  if (user && isTestModeActive && selectedTest) {
    return <TestModeHomepage />;
  }

  // For all other cases (loading, signed-in without test, or not signed-in), show homepage
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}