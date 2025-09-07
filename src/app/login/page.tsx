// src/app/login/page.tsx

"use client"; 

import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    } else {
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인 중 오류가 발생했습니다: ' + error.message);
    } else {
      // 로그인이 성공하면 홈 페이지로 이동합니다.
      router.push('/');
    }
  };

  // 로그인 폼의 UI 부분
  return (
    <div className="container container-narrow" style={{ margin: '50px auto' }}>
      <h1 style={{ textAlign: 'center' }}>Login / Sign Up</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>
        <button onClick={handleSignUp} className="btn">
          Sign Up
        </button>
      </div>
    </div>
  );
}