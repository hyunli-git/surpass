// src/app/login/page.tsx

"use client"; 

import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert('Error during sign up: ' + error.message);
    } else {
      alert('Sign up successful! Please check your email to confirm your account.');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error during login: ' + error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://surpass.so/',
      },
    });

    if (error) {
      alert('Error during Google login: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <div className="container container-narrow">
        <div style={{ 
          background: 'white', 
          padding: '40px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Sign In</h1>
          
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn"
            style={{
              width: '100%',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: 'white',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: '500',
              position: 'relative',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="text-input"
              style={{ 
                padding: '12px 16px',
                fontSize: '1rem',
                width: '100%'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="text-input"
              style={{ 
                padding: '12px 16px',
                fontSize: '1rem',
                width: '100%'
              }}
            />
            
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="btn btn-primary"
              style={{ 
                padding: '12px 20px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Don't have an account?
              </p>
              <button 
                onClick={handleSignUp} 
                disabled={loading}
                className="btn"
                style={{ 
                  width: '100%',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Loading...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}