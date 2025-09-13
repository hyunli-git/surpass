// src/components/Header.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

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
          <li><Link href="/tests" className="nav-link">Tests</Link></li>
          <li><Link href="/pricing" className="nav-link">Pricing</Link></li>
          <li><Link href="/about" className="nav-link">About</Link></li>
          
          {/* Language Selector */}
          <li className="language-selector-item">
            <LanguageSelector />
          </li>
          
          {user ? (
            <>
              <li><Link href="/my-page" className="nav-link">My Page</Link></li>
              <li><span className="nav-link">{user.email}</span></li>
              <li><button onClick={handleLogout} className="btn">Logout</button></li>
            </>
          ) : (
            <li><Link href="/login" className="btn">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  )
}
