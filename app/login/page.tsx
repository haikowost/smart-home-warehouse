'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const err = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push('/account');
    }
  }

  const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1A1A2E' }}>Welcome Back</div>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.3rem' }}>Sign in to your Smart Home Warehouse account</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1E40AF'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.78rem', color: '#1E40AF', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1E40AF'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '0.6rem 0.75rem', fontSize: '0.83rem', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ background: loading ? '#93C5FD' : '#1E40AF', color: 'white', border: 'none', padding: '0.8rem', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: '0.25rem' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6B7280' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
