// src/utils/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Be resilient locally: if env vars are missing, export a safe shim
// so the UI can still render (features requiring Supabase will no-op).
function createSupabaseShim() {
  /* eslint-disable no-console */
  console.warn('[supabase] Environment variables missing; using local shim.');
  const error = new Error('Supabase not configured');
  const chain = {
    select: async () => ({ data: null, error }),
    insert: async () => ({ data: null, error }),
    update: async () => ({ data: null, error }),
    delete: async () => ({ data: null, error }),
    eq: function () { return this },
    order: function () { return this },
    single: async () => ({ data: null, error }),
  };
  return {
    auth: {
      async getSession() { return { data: { session: null }, error: null } },
      onAuthStateChange(_cb: any) {
        return { data: { subscription: { unsubscribe() { /* noop */ } } } } as any;
      },
      async signOut() { return { error: null } },
      async signUp() { return { data: null, error } },
      async signInWithPassword() { return { data: null, error } },
      async getUser() { return { data: { user: null }, error: null } },
    },
    from(_table: string) { return chain },
  } as any;
}

export const supabase: any = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createSupabaseShim()
