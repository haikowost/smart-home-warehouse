'use client';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string; product_id: string; product_name: string;
  quantity: number; unit_price: number;
}

interface Order {
  id: string; reference: string; first_name: string; last_name: string;
  email: string; phone?: string; total: number; status: string;
  created_at: string; order_items: OrderItem[];
}

const STATUSES = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#FEF3C7', text: '#D97706' },
  paid:       { bg: '#D1FAE5', text: '#059669' },
  processing: { bg: '#DBEAFE', text: '#2563EB' },
  shipped:    { bg: '#EDE9FE', text: '#7C3AED' },
  delivered:  { bg: '#D1FAE5', text: '#047857' },
  cancelled:  { bg: '#FEE2E2', text: '#DC2626' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
    setUpdating(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#0F172A' }}>Orders</h1>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              background: filter === s ? '#1E40AF' : 'white',
              color: filter === s ? 'white' : '#64748B',
              border: '1px solid',
              borderColor: filter === s ? '#1E40AF' : '#E2E8F0',
              padding: '0.35rem 0.85rem',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}>
            {s === 'all' ? 'All' : s} {counts[s] > 0 && <span style={{ opacity: 0.7 }}>({counts[s]})</span>}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>No orders in this category.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['', 'Reference', 'Customer', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <>
                  <tr key={order.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.6rem 0.9rem', width: 32 }}>
                      <button
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.75rem', padding: '0.2rem 0.4rem', borderRadius: 4 }}>
                        {expanded === order.id ? '▲' : '▼'}
                      </button>
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem', fontFamily: 'IBM Plex Mono, monospace', color: '#1E40AF', fontWeight: 700, fontSize: '0.78rem' }}>{order.reference}</td>
                    <td style={{ padding: '0.6rem 0.9rem' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{order.first_name} {order.last_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{order.email}</div>
                      {order.phone && <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{order.phone}</div>}
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem', fontWeight: 700, color: '#0F172A' }}>
                      R{Number(order.total).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem' }}>
                      <span style={{
                        background: STATUS_COLORS[order.status]?.bg ?? '#F1F5F9',
                        color: STATUS_COLORS[order.status]?.text ?? '#64748B',
                        padding: '0.2rem 0.55rem', borderRadius: 100,
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                      {new Date(order.created_at).toLocaleDateString('en-ZA')}
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem' }}>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        style={{
                          padding: '0.3rem 0.5rem', border: '1px solid #E2E8F0', borderRadius: 6,
                          fontSize: '0.75rem', fontFamily: 'IBM Plex Sans, sans-serif',
                          cursor: 'pointer', background: 'white', color: '#374151',
                          opacity: updating === order.id ? 0.5 : 1,
                        }}>
                        {['pending','paid','processing','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-items`} style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                      <td colSpan={7} style={{ padding: '0.75rem 1.5rem 0.75rem 3.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Items</div>
                        {order.order_items?.length > 0 ? (
                          <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}>
                            <tbody>
                              {order.order_items.map(item => (
                                <tr key={item.id}>
                                  <td style={{ padding: '0.25rem 0.5rem 0.25rem 0', color: '#0F172A', fontSize: '0.8rem' }}>{item.product_name}</td>
                                  <td style={{ padding: '0.25rem 1rem', color: '#64748B', fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace' }}>×{item.quantity}</td>
                                  <td style={{ padding: '0.25rem 0', color: '#374151', fontSize: '0.8rem', fontWeight: 600 }}>
                                    R{(Number(item.unit_price) * item.quantity).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>No item details recorded.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
