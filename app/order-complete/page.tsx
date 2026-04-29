'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OrderContent() {
  const params = useSearchParams();
  const ref = params.get('ref') || 'SHW-ORDER';

  return (
    <div style={{ maxWidth: 560, margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✓</div>
      <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#1F2937', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
      <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
        Thank you for your order. You&apos;ll receive a confirmation email shortly.
      </p>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.82rem', color: '#9B59B6', marginBottom: '2rem' }}>
        Reference: {ref}
      </p>
      <p style={{ fontSize: '0.88rem', color: '#6B7280', marginBottom: '2rem' }}>
        Questions? Contact us at <a href="mailto:smarthome@smart-vision.co.za" style={{ color: '#9B59B6' }}>smarthome@smart-vision.co.za</a>
      </p>
      <Link href="/shop" className="btn-primary">Continue Shopping →</Link>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>}>
      <OrderContent />
    </Suspense>
  );
}
