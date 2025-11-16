// src/components/Header.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import LanguageSelector from './LanguageSelector';
import { useTestMode } from '@/contexts/TestModeContext';
import { X } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { selectedTest, isTestModeActive, clearTestMode } = useTestMode();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      {/* Test Mode Banner */}
      {isTestModeActive && selectedTest && (
        <div className="test-mode-banner" style={{
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          color: 'white',
          padding: '8px 0',
          fontSize: '0.875rem',
          position: 'relative'
        }}>
          <div className="container" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px' 
          }}>
            <span style={{ fontSize: '1.2rem' }}>{selectedTest.flag}</span>
            <span style={{ fontWeight: '600' }}>
              {selectedTest.name} Practice Mode
            </span>
            <button
              onClick={clearTestMode}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                marginLeft: 'auto'
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
              Exit
            </button>
          </div>
        </div>
      )}

      <header id="mainHeader">
        <nav className="container">
          <Link href="/" className="logo">
            <Image 
              src="/logo.png" 
              alt="Surpass Logo" 
              width={120} 
              height={40}
              priority
              style={{ height: 'auto', width: 'auto' }}
            />
          </Link>
          
          <ul className="nav-links">
            <li><Link href="/" className="nav-link">Home</Link></li>
            
            {/* Dynamic navigation based on test mode */}
            {isTestModeActive && selectedTest ? (
              <>
                <li><Link href="/skill-practice" className="nav-link">Practice</Link></li>
                <li><Link href="/mock-test" className="nav-link">Mock Tests</Link></li>
                <li><Link href="/my-page" className="nav-link">Progress</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/get-started" className="nav-link">Tests</Link></li>
                <li><Link href="/pricing" className="nav-link">Pricing</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
              </>
            )}
            
            {/* Language Selector - only show when not in test mode */}
            {!isTestModeActive && (
              <li className="language-selector-item">
                <LanguageSelector />
              </li>
            )}
            
            {user ? (
              <>
                <li><Link href="/my-page" className="nav-link">My Page</Link></li>
                <li><span className="nav-link" style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user.email}</span></li>
                {!isTestModeActive && <li><Link href="/get-started" className="btn btn-primary">Select Test</Link></li>}
                <li><button onClick={handleLogout} className="btn">Logout</button></li>
              </>
            ) : (
              <>
                {!isTestModeActive && <li><Link href="/get-started" className="btn btn-primary">Get Started</Link></li>}
                <li><Link href="/login" className="btn">Sign In</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  )
}
