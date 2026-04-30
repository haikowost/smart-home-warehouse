'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import ProductForm from '../_form';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); } else { setProduct(data); }
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Edit Product</h1>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>{product ? (product.name as string) : 'Loading...'}</p>
      </div>
      {loading && <p style={{ color: '#94A3B8' }}>Loading product...</p>}
      {error && <p style={{ color: '#EF4444', background: '#FEF2F2', padding: '0.75rem', borderRadius: 7 }}>{error}</p>}
      {product && <ProductForm initial={product as Parameters<typeof ProductForm>[0]['initial']} />}
    </div>
  );
}
