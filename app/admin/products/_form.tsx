'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['power-control','lighting','security','environmental','access-control','remote-control','water-control','voice-assistants','bundles'];
const BRANDS = ['Tuya','Smartlife','TP-Link TAPO','Amazon Echo','Google Nest','GeeWiz'];

interface ProductFormData {
  id?: string; slug?: string; sku?: string; name?: string; short_desc?: string;
  description?: string; category?: string; brand?: string; price?: number;
  compare_price?: number | null; images?: string[]; tags?: string[];
  in_stock?: boolean; featured?: boolean;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function ProductForm({ initial }: { initial?: ProductFormData }) {
  const isNew = !initial?.id;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name:         initial?.name ?? '',
    slug:         initial?.slug ?? '',
    sku:          initial?.sku ?? '',
    short_desc:   initial?.short_desc ?? '',
    description:  initial?.description ?? '',
    category:     initial?.category ?? 'power-control',
    brand:        initial?.brand ?? 'Tuya',
    price:        initial?.price ?? 0,
    compare_price: initial?.compare_price ?? '',
    images:       (initial?.images ?? []).join('\n'),
    tags:         (initial?.tags ?? []).join(', '),
    in_stock:     initial?.in_stock ?? true,
    featured:     initial?.featured ?? false,
  });

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
    if (key === 'name' && isNew) {
      setForm(f => ({ ...f, name: value as string, slug: slugify(value as string) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      tags:   form.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${initial?.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Save failed'); return; }
      router.push('/admin/products');
      router.refresh();
    } catch (e) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  const field = (label: string, key: string, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>{label}{opts?.required && <span style={{ color: '#EF4444' }}> *</span>}</label>
      <input
        type={opts?.type ?? 'text'}
        value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
        placeholder={opts?.placeholder}
        required={opts?.required}
        style={{ width: '100%', padding: '0.58rem 0.8rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.87rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );

  const textarea = (label: string, key: string, rows = 3, placeholder?: string) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>{label}</label>
      <textarea
        value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.58rem 0.8rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.87rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left column */}
        <div>
          <div style={{ background: 'white', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Product Details</h2>
            {field('Product Name', 'name', { required: true })}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {field('Slug', 'slug', { required: true, placeholder: 'auto-generated' })}
              {field('SKU', 'sku', { required: true, placeholder: 'e.g. SP16A-TUYA' })}
            </div>
            {textarea('Short Description', 'short_desc', 2, '1–2 sentence product summary')}
            {textarea('Full Description', 'description', 4, 'Detailed product description')}
          </div>

          <div style={{ background: 'white', borderRadius: 10, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Images & Tags</h2>
            {textarea('Image URLs (one per line)', 'images', 4, 'https://...\nhttps://...')}
            {field('Tags (comma-separated)', 'tags', { placeholder: 'smart plug, tuya, wifi' })}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{ background: 'white', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Organisation</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Category <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%', padding: '0.58rem 0.8rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.87rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>Brand <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={form.brand} onChange={e => set('brand', e.target.value)} style={{ width: '100%', padding: '0.58rem 0.8rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.87rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none' }}>
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Pricing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {field('Price (R) — 0 for POA', 'price', { type: 'number', placeholder: '0.00' })}
              {field('Compare Price (R)', 'compare_price', { type: 'number', placeholder: 'optional' })}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 10, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1rem' }}>Status</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.87rem', color: '#374151' }}>
              <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} style={{ accentColor: '#1E40AF', width: 16, height: 16 }} />
              In Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.87rem', color: '#374151' }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ accentColor: '#1E40AF', width: 16, height: 16 }} />
              Featured on homepage
            </label>
          </div>
        </div>
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '1rem 0', background: '#FEF2F2', padding: '0.75rem', borderRadius: 7 }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="submit" disabled={saving} style={{ background: '#1E40AF', color: 'white', border: 'none', padding: '0.7rem 1.75rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'IBM Plex Sans, sans-serif' }}>
          {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0', padding: '0.7rem 1.25rem', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
