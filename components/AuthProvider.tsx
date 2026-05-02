'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// Browser-side Supabase client (needs NEXT_PUBLIC_ vars)
function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, meta?: { firstName?: string; lastName?: string; phone?: string }) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthCtx>({
  user: null, loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  resetPassword: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sb = getBrowserClient();

  useEffect(() => {
    if (!sb) { setLoading(false); return; }
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!sb) return 'Auth not configured — contact support.';
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function signUp(email: string, password: string, meta?: { firstName?: string; lastName?: string; phone?: string }): Promise<string | null> {
    if (!sb) return 'Auth not configured — contact support.';
    const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { first_name: meta?.firstName, last_name: meta?.lastName, phone: meta?.phone } },
    });
    return error?.message ?? null;
  }

  async function signOut() {
    if (sb) await sb.auth.signOut();
    setUser(null);
  }

  async function resetPassword(email: string): Promise<string | null> {
    if (!sb) return 'Auth not configured.';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/account/reset-password` });
    return error?.message ?? null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
