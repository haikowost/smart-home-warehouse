'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', phone: '', newsletter: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    const err = await signUp(form.email, form.password, { firstName: form.firstName, lastName: form.lastName, phone: form.phone });
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '2px solid #E5E7EB', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600 as const, color: '#374151', marginBottom: '0.3rem' };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = '#1E40AF');
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = '#E5E7EB');

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 14, padding: '3rem 2rem', maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '0.5rem' }}>Account Created!</div>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Check your email to confirm your address, then sign in to start shopping.
          </p>
          <Link href="/login" className="btn-primary" style={{ display: 'inline-flex' }}>Sign In →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 14, padding: '2.5rem 2rem', width: '100%', maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1A1A2E' }}>Create Account</div>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.3rem' }}>Join Smart Home Warehouse for a faster checkout</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handle} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handle} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input name="email" type="email" value={form.email} onChange={handle} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Mobile Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+27 82 000 0000" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handle} required minLength={8} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.2rem' }}>Minimum 8 characters</p>
          </div>
          <div>
            <label style={labelStyle}>Confirm Password *</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handle} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.83rem', color: '#4B5563' }}>
            <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handle} style={{ marginTop: 2 }} />
            <span>Subscribe to our newsletter for deals, new products and smart home tips</span>
          </label>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '0.6rem 0.75rem', fontSize: '0.83rem', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ background: loading ? '#93C5FD' : '#1E40AF', color: 'white', border: 'none', padding: '0.8rem', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: '0.25rem' }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6B7280' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
