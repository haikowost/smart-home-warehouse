'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string; reference: string; first_name: string; last_name: string;
  email: string; total: number; status: string; created_at: string;
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '1.25rem', borderLeft: `4px solid ${color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#0F172A' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', paid: '#10B981', processing: '#3B82F6',
  shipped: '#8B5CF6', delivered: '#059669', cancelled: '#EF4444',
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]).then(([p, o]) => {
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const { seeded, error } = await res.json();
      setSeedMsg(error ? `Error: ${error}` : `✓ ${seeded} products imported`);
      if (!error) {
        const p = await fetch('/api/admin/products').then(r => r.json());
        setProducts(Array.isArray(p) ? p : []);
      }
    } finally {
      setSeeding(false);
    }
  }

  const paid    = orders.filter(o => o.status === 'paid');
  const pending = orders.filter(o => o.status === 'pending');
  const revenue = paid.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Dashboard</h1>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>Smart Home Warehouse admin overview</p>
        </div>
        <Link href="/admin/products/new" style={{ background: '#1E40AF', color: 'white', textDecoration: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <p style={{ color: '#94A3B8' }}>Loading...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard icon="📦" label="Products" value={products.length} sub="in catalogue" color="#3B82F6" />
            <StatCard icon="📋" label="Total Orders" value={orders.length} color="#8B5CF6" />
            <StatCard icon="💳" label="Revenue" value={`R${revenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} sub="from paid orders" color="#10B981" />
            <StatCard icon="⏳" label="Pending" value={pending.length} sub="awaiting payment" color="#F59E0B" />
          </div>

          {/* Seed section */}
          {products.length === 0 && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1E40AF' }}>Import existing products</div>
                <div style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '0.2rem' }}>Load all 43 products from the catalogue into the database</div>
              </div>
              <button onClick={handleSeed} disabled={seeding} style={{ background: '#1E40AF', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 7, cursor: seeding ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: seeding ? 0.7 : 1 }}>
                {seeding ? 'Importing...' : 'Import Products'}
              </button>
            </div>
          )}
          {seedMsg && <p style={{ fontSize: '0.85rem', color: seedMsg.startsWith('Error') ? '#EF4444' : '#10B981', marginBottom: '1rem' }}>{seedMsg}</p>}

          {/* Recent orders */}
          <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Recent Orders</span>
              <Link href="/admin/orders" style={{ fontSize: '0.8rem', color: '#1E40AF', textDecoration: 'none' }}>View all →</Link>
            </div>
            {orders.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>No orders yet</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Reference', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(order => (
                    <tr key={order.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.7rem 1rem', fontFamily: 'IBM Plex Mono, monospace', color: '#1E40AF', fontWeight: 600 }}>{order.reference}</td>
                      <td style={{ padding: '0.7rem 1rem', color: '#374151' }}>{order.first_name} {order.last_name}<br /><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{order.email}</span></td>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: '#0F172A' }}>R{Number(order.total).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <span style={{ background: `${STATUS_COLORS[order.status] ?? '#94A3B8'}22`, color: STATUS_COLORS[order.status] ?? '#94A3B8', padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.7rem 1rem', color: '#94A3B8' }}>{new Date(order.created_at).toLocaleDateString('en-ZA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
