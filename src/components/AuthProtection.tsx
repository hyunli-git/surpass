// src/components/AuthProtection.tsx

"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface AuthProtectionProps {
  children: React.ReactNode;
  feature?: string; // What feature they're trying to access
  requiredLevel?: 'free' | 'pro'; // Future use for tiered access
}

export default function AuthProtection({ 
  children, 
  feature = "practice tests",
  requiredLevel = 'free' 
}: AuthProtectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="loading-spinner">🔄</div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-required-container">
        <div className="container container-narrow" style={{ margin: '80px auto', textAlign: 'center' }}>
          <div className="auth-required-card">
            <div className="auth-icon">🔐</div>
            <h1>Sign Up Required</h1>
            <p className="auth-message">
              Access to {feature} requires a free account. Join thousands of students improving their IELTS scores!
            </p>
            
            <div className="auth-benefits">
              <h3>What you&apos;ll get with a free account:</h3>
              <ul className="benefit-list">
                <li>🎤 AI-powered speaking practice with natural voice feedback</li>
                <li>✍️ Complete writing practice for Task 1 & Task 2</li>
                <li>📊 Detailed IELTS band scoring and analysis</li>
                <li>🚀 Personalized improvement roadmap to next level</li>
                <li>💯 Unlimited practice tests and mock exams</li>
                <li>📈 Progress tracking and performance analytics</li>
              </ul>
            </div>

            <div className="auth-actions">
              <Link href="/login" className="btn btn-primary auth-btn">
                🚀 Sign Up Free - Get Instant Access
              </Link>
              <p className="auth-note">
                Already have an account? 
                <Link href="/login" className="auth-link"> Sign in here</Link>
              </p>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">✅</span>
                <span>100% Free</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}