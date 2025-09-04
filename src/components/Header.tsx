// src/components/Header.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header id="mainHeader">
      <nav className="container">
        <button 
          onClick={() => handleNavigation('/')} 
          className="logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span>⚡</span>
          <span>Surpass</span>
        </button>
        
        <ul className="nav-links">
          <li><button onClick={() => handleNavigation('/')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Home</button></li>
          <li><button onClick={() => handleNavigation('/tests')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Tests</button></li>
          <li><button onClick={() => handleNavigation('/pricing')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Pricing</button></li>
          <li><button onClick={() => handleNavigation('/about')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>About</button></li>
          
          {/* Language Selector */}
          <li className="language-selector-item">
            <LanguageSelector />
          </li>
          
          {user ? (
            <>
              <li><span className="nav-link">{user.email}</span></li>
              <li><button onClick={handleLogout} className="btn">Logout</button></li>
            </>
          ) : (
            <li><button onClick={() => handleNavigation('/login')} className="btn">Login</button></li>
          )}
        </ul>
      </nav>
    </header>
  )
}