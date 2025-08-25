// src/components/Header.tsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const t = useTranslations();

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

  return (
    <header id="mainHeader">
      <nav className="container">
        <Link href="/" className="logo">
          <span>⚡</span>
          <span>Surpass</span>
        </Link>
        
        <ul className="nav-links">
          <li><Link href="/" className="nav-link">{t('navigation.home')}</Link></li>
          <li><Link href="/tests" className="nav-link">{t('navigation.tests')}</Link></li>
          <li><Link href="/pricing" className="nav-link">{t('navigation.pricing')}</Link></li>
          <li><Link href="/about" className="nav-link">{t('navigation.about')}</Link></li>
          
          {/* Language Selector */}
          <li className="language-selector-item">
            <LanguageSelector />
          </li>
          
          {user ? (
            <>
              <li><span className="nav-link">{user.email}</span></li>
              <li><button onClick={handleLogout} className="btn">{t('common.logout')}</button></li>
            </>
          ) : (
            <li><Link href="/login" className="btn">{t('common.login')}</Link></li>
          )}
        </ul>
      </nav>
    </header>
  )
}