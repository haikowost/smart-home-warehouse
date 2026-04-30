'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string; slug: string; sku: string; name: string; category: string;
  brand: string; price: number; in_stock: boolean; featured: boolean; images: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const data = await fetch('/api/admin/products').then(r => r.json());
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Products</h1>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>{products.length} products in database</p>
        </div>
        <Link href="/admin/products/new" style={{ background: '#1E40AF', color: 'white', textDecoration: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          + Add Product
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
          <input
            type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, SKU or brand..."
            style={{ width: '100%', maxWidth: 380, padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.85rem', outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}
          />
        </div>

        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
            {products.length === 0 ? 'No products yet — go to Dashboard to import them.' : 'No products match your search.'}
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.5rem 0.9rem', width: 48 }}>
                    <div style={{ width: 40, height: 40, background: '#F8FAFC', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product.images?.[0] && <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{product.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{product.brand}</div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', fontFamily: 'IBM Plex Mono, monospace', color: '#64748B', fontSize: '0.75rem' }}>{product.sku}</td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#374151', textTransform: 'capitalize' }}>{product.category.replace(/-/g, ' ')}</td>
                  <td style={{ padding: '0.6rem 0.9rem', fontWeight: 700, color: product.price > 0 ? '#0F172A' : '#1E40AF' }}>
                    {product.price > 0 ? `R${Number(product.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : 'POA'}
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <span style={{ background: product.in_stock ? '#DCFCE7' : '#FEE2E2', color: product.in_stock ? '#16A34A' : '#DC2626', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100 }}>
                      {product.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/products/${product.id}`} style={{ background: '#EFF6FF', color: '#1E40AF', textDecoration: 'none', padding: '0.3rem 0.65rem', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(product.id, product.name)} disabled={deleting === product.id} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', opacity: deleting === product.id ? 0.5 : 1 }}>
                        {deleting === product.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
