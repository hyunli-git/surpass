// src/components/Header.tsx

"use client"; // 헤더도 사용자와 상호작용하므로 클라이언트 컴포넌트로 변경합니다.

import Link from 'next/link'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 컴포넌트가 처음 로드될 때와 인증 상태가 바뀔 때마다 사용자 정보를 가져옵니다.
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // 컴포넌트가 사라질 때 리스너를 정리합니다.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 페이지를 새로고침하여 로그아웃 상태를 반영합니다.
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
          <li><Link href="/" className="nav-link">Home</Link></li>
          <li><Link href="/tests" className="nav-link">Tests</Link></li>
          <li><Link href="/pricing" className="nav-link">Pricing</Link></li>
          <li><Link href="/about" className="nav-link">About Us</Link></li>
          {user ? (
            // 로그인한 경우
            <>
              <li><span className="nav-link">{user.email}</span></li>
              <li><button onClick={handleLogout} className="btn">Logout</button></li>
            </>
          ) : (
            // 로그인하지 않은 경우
            <li><Link href="/login" className="btn">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  )
}