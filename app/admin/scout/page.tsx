'use client';
import { useEffect, useState } from 'react';

interface ScoutProduct {
  id: string; name: string; brand: string; category: string;
  price: number; in_stock: boolean; images: string[]; tags: string[]; updated_at: string;
}

const SOURCE_LABELS: Record<string, string> = {
  geewiz: 'GeeWiz', esquire: 'Esquire', pinnacle: 'Pinnacle',
};

function sourceTag(tags: string[]): string {
  for (const t of tags) {
    if (SOURCE_LABELS[t]) return SOURCE_LABELS[t];
  }
  return 'Scout';
}

export default function AdminScout() {
  const [products, setProducts] = useState<ScoutProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/scout').then(r => r.json()).then(data => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Product Scout</h1>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>Products imported from the SHW Scout (GeeWiz · Esquire · Pinnacle)</p>
      </div>

      {/* How to sync */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E40AF', marginBottom: '0.5rem' }}>How to sync Scout → Store</div>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.83rem', color: '#1D4ED8', lineHeight: 2 }}>
          <li>Run the scout: <code style={{ background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace' }}>cd shw-product-scout && python main.py</code></li>
          <li>Curate products in the scout (mark as <em>list_in_store</em> or <em>available_on_request</em>)</li>
          <li>Push to store: <code style={{ background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace' }}>python -m exporters.supabase_exporter</code></li>
          <li>Refresh this page — new products appear below and in the Products catalogue</li>
        </ol>
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#3B82F6' }}>
          Requires a <code style={{ background: '#DBEAFE', padding: '0.1rem 0.35rem', borderRadius: 3, fontFamily: 'IBM Plex Mono, monospace' }}>shw-product-scout/.env</code> file with <code style={{ fontFamily: 'IBM Plex Mono, monospace' }}>SUPABASE_URL</code> and <code style={{ fontFamily: 'IBM Plex Mono, monospace' }}>SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      </div>

      {/* Stats */}
      {!loading && products.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {Object.entries(SOURCE_LABELS).map(([key, label]) => {
            const count = products.filter(p => p.tags.includes(key)).length;
            return count > 0 ? (
              <div key={key} style={{ background: 'white', borderRadius: 8, padding: '0.75rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{count}</span>
                <span style={{ color: '#64748B', marginLeft: '0.35rem' }}>from {label}</span>
              </div>
            ) : null;
          })}
          <div style={{ background: 'white', borderRadius: 8, padding: '0.75rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{products.length}</span>
            <span style={{ color: '#64748B', marginLeft: '0.35rem' }}>total scout products</span>
          </div>
        </div>
      )}

      {/* Products table */}
      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading scout products...</p>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
              </svg>
            </div>
            <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '0.4rem' }}>No scout products yet</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Run the scout and push to Supabase using the instructions above.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['', 'Name', 'Brand', 'Category', 'Price', 'Source', 'Last Updated'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.5rem 0.9rem', width: 44 }}>
                    <div style={{ width: 36, height: 36, background: '#F8FAFC', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#64748B' }}>{p.brand}</td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#374151', textTransform: 'capitalize' }}>{p.category.replace(/-/g, ' ')}</td>
                  <td style={{ padding: '0.6rem 0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {p.price > 0 ? `R${Number(p.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : 'POA'}
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100 }}>{sourceTag(p.tags)}</span>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                    {new Date(p.updated_at).toLocaleDateString('en-ZA')}
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
