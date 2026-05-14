'use client';
import { useEffect, useState, useCallback } from 'react';

interface ScoutProduct {
  id: string; name: string; brand: string; category: string; sku: string;
  price: number; in_stock: boolean; images: string[]; tags: string[]; updated_at: string;
}

interface SyncResult { pushed: number; file?: string; error?: string }

const SOURCE_LABELS: Record<string, string> = {
  geewiz: 'GeeWiz', esquire: 'Esquire', pinnacle: 'Pinnacle', catalog: 'OEM Catalog',
};

const CAT_LABELS: Record<string, string> = {
  'security': 'Security', 'lighting': 'Lighting', 'power-control': 'Plugs & Switches',
  'environmental': 'Sensors', 'voice-assistants': 'Hubs & Speakers', 'networking': 'Mesh Wi-Fi',
  'bundles': 'Bundles', 'access-control': 'Access Control', 'remote-control': 'Remotes',
  'water-control': 'Water',
};

function sourceTag(tags: string[]): string {
  for (const t of tags) { if (SOURCE_LABELS[t]) return SOURCE_LABELS[t]; }
  return 'Scout';
}

function Tag({ text, color = '#DBEAFE', textColor = '#1E40AF' }: { text: string; color?: string; textColor?: string }) {
  return (
    <span style={{ background: color, color: textColor, fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100, whiteSpace: 'nowrap' }}>{text}</span>
  );
}

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: 110 }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: 'Rajdhani, sans-serif' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  );
}

export default function AdminScout() {
  const [products, setProducts] = useState<ScoutProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [filter, setFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/scout').then(r => r.json()).then(data => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      // Read the JSON export file and POST it
      const res = await fetch('/api/admin/scout/sync', { method: 'POST' });
      const result = await res.json();
      setSyncResult(result);
      if (!result.error) load();
    } catch (e) {
      setSyncResult({ pushed: 0, error: String(e) });
    } finally {
      setSyncing(false);
    }
  }

  const inStock = products.filter(p => p.in_stock).length;
  const cats = [...new Set(products.map(p => p.category))].sort();

  const filtered = products.filter(p => {
    const q = filter.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    const matchesCat = catFilter === 'all' || p.category === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A', margin: 0 }}>Product Scout</h1>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>Products pushed from the SHW Scout tool (GeeWiz · Esquire · OEM Catalog)</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="http://localhost:8501" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"/></svg>
            Open Scout Tool
          </a>
          <button onClick={handleSync} disabled={syncing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: syncing ? '#F1F5F9' : '#0F172A', color: syncing ? '#94A3B8' : 'white', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: syncing ? 'not-allowed' : 'pointer' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            {syncing ? 'Syncing…' : 'Sync from Scout'}
          </button>
        </div>
      </div>

      {/* How-to banner */}
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#166534' }}>
        <strong>To push new products:</strong> open the Scout Tool above → curate products → click &ldquo;Push to Store&rdquo; in the Streamlit sidebar. Products appear here instantly.
        <span style={{ float: 'right', color: '#16A34A', fontWeight: 700 }}>
          Or run: <code style={{ background: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: 4, fontFamily: 'monospace' }}>python -m exporters.supabase_exporter</code>
        </span>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Stat label="Total Scout Products" value={products.length} />
          <Stat label="In Stock" value={inStock} sub={`${products.length - inStock} on request`} />
          {Object.entries(SOURCE_LABELS).map(([key, label]) => {
            const count = products.filter(p => p.tags?.includes(key)).length;
            return count > 0 ? <Stat key={key} label={label} value={count} /> : null;
          })}
        </div>
      )}

      {/* Filters + search */}
      {!loading && products.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            placeholder="Search name, brand, SKU..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }}
          />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.82rem', background: 'white', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            <option value="all">All categories</option>
            {cats.map(c => <option key={c} value={c}>{CAT_LABELS[c] ?? c}</option>)}
          </select>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8', alignSelf: 'center' }}>
            {filtered.length} of {products.length}
          </span>
        </div>
      )}

      {/* Sync result banner */}
      {syncResult && (
        <div style={{ background: syncResult.error ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${syncResult.error ? '#FECACA' : '#BBF7D0'}`, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.83rem', color: syncResult.error ? '#991B1B' : '#166534' }}>
          {syncResult.error ? `Sync failed: ${syncResult.error}` : `Synced ${syncResult.pushed} products from ${syncResult.file ?? 'export'}.`}
        </div>
      )}

      {/* Products table */}
      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</p>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 600, color: '#64748B', marginBottom: '0.4rem' }}>No scout products yet</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Open the Scout Tool, curate some products, then push to this store.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['', 'SKU', 'Name', 'Brand', 'Category', 'Price', 'Source', 'Stock'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.5rem 0.9rem', width: 44 }}>
                    <div style={{ width: 36, height: 36, background: '#F8FAFC', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{p.sku}</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', maxWidth: 300 }}>{p.name}</div>
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', color: '#64748B', whiteSpace: 'nowrap' }}>{p.brand}</td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <Tag text={CAT_LABELS[p.category] ?? p.category} color="#F1F5F9" textColor="#475569" />
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                    {p.price > 0 ? `R${Number(p.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : 'POA'}
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <Tag text={sourceTag(p.tags)} />
                  </td>
                  <td style={{ padding: '0.6rem 0.9rem' }}>
                    <Tag
                      text={p.in_stock ? 'In Stock' : 'On Request'}
                      color={p.in_stock ? '#DCFCE7' : '#FEF3C7'}
                      textColor={p.in_stock ? '#166534' : '#92400E'}
                    />
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
