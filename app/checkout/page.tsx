'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const shipping = total >= 500 ? 0 : 99;
  const orderTotal = total + shipping;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', suburb: '', city: '', province: '', postalCode: '',
  });

  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Browse Products →</Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Generate unique payment ID
    const paymentId = `SHW-${Date.now()}`;
    const itemName = `Smart Home Warehouse Order ${paymentId}`;

    // Build PayFast form and submit
    const res = await fetch('/api/payfast/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form,
        paymentId,
        amount: orderTotal.toFixed(2),
        itemName,
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.price,
        })),
      }),
    });

    const { url, fields } = await res.json();

    // Create and submit form to PayFast
    const pf = document.createElement('form');
    pf.method = 'POST';
    pf.action = url;
    Object.entries(fields as Record<string, string>).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      pf.appendChild(input);
    });
    document.body.appendChild(pf);
    clear();
    pf.submit();
  }

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #E5E7EB', borderRadius: 7,
    fontSize: '0.9rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none',
    background: 'white', color: '#1F2937',
  };

  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#1F2937' }}>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Contact */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#1F2937' }}>Contact Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div><label style={labelStyle}>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Phone</label><input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+27 82 000 0000" style={inputStyle} /></div>
              </div>
            </div>

            {/* Delivery */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#1F2937' }}>Delivery Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div><label style={labelStyle}>Street Address *</label><input name="address" value={form.address} onChange={handleChange} required placeholder="123 Example Street" style={inputStyle} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div><label style={labelStyle}>Suburb</label><input name="suburb" value={form.suburb} onChange={handleChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>City *</label><input name="city" value={form.city} onChange={handleChange} required style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Province *</label>
                    <select name="province" value={form.province} onChange={handleChange} required style={{ ...inputStyle, appearance: 'auto' }}>
                      <option value="">Select...</option>
                      {['Gauteng','Western Cape','Eastern Cape','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Free State'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Postal Code *</label><input name="postalCode" value={form.postalCode} onChange={handleChange} required placeholder="0001" style={inputStyle} /></div>
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '1rem', fontSize: '0.85rem', color: '#166534' }}>
              🔒 <strong>Secure payment via PayFast</strong> — EFT, credit card, SnapScan and Zapper accepted. You will be redirected to PayFast to complete payment.
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.5rem', position: 'sticky', top: 80 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#1F2937' }}>Your Order</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              {items.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#4B5563' }}>
                  <span style={{ flex: 1, marginRight: '0.5rem' }}>{product.name} × {quantity}</span>
                  <span style={{ flexShrink: 0 }}>R{(product.price * quantity).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6B7280' }}>
                <span>Delivery</span>
                <span style={{ color: shipping === 0 ? '#22C55E' : '#4B5563' }}>{shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#1F2937' }}>
                <span>Total</span>
                <span>R{orderTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Redirecting to PayFast...' : `Pay R${orderTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} →`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
