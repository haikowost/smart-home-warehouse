'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '2.5rem 2rem', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1E40AF' }}>SHW Admin</div>
          <div style={{ fontSize: '0.82rem', color: '#9CA3AF', marginTop: '0.25rem' }}>Smart Home Warehouse · Management</div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            autoFocus
            style={{ width: '100%', padding: '0.65rem 0.9rem', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: '0.9rem', outline: 'none', marginBottom: '0.75rem', fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box' }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#1E40AF'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#E5E7EB'; }}
          />
          {error && (
            <p style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: '0.75rem', background: '#FEF2F2', padding: '0.5rem 0.75rem', borderRadius: 6 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#93C5FD' : '#1E40AF', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 8, fontSize: '0.92rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: '#D1D5DB' }}>
          Set ADMIN_PASSWORD in Vercel environment variables
        </p>
      </div>
    </div>
  );
}
