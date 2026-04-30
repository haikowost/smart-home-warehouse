'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, total, remove, setQty } = useCart();

  const shipping = total >= 500 ? 0 : 99;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1F2937' }}>Your cart is empty</h1>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Add some smart home products to get started.</p>
        <Link href="/shop" className="btn-primary">Browse Products →</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: '#1F2937' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <img src={product.images[0]} alt={product.name} style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 6, background: '#F9FAFB' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1F2937', marginBottom: '0.25rem' }}>{product.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>SKU: {product.sku}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: 6 }}>
                    <button onClick={() => setQty(product.id, quantity - 1)} style={{ padding: '0.3rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }}>−</button>
                    <span style={{ padding: '0.3rem 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{quantity}</span>
                    <button onClick={() => setQty(product.id, quantity + 1)} style={{ padding: '0.3rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }}>+</button>
                  </div>
                  <button onClick={() => remove(product.id)} style={{ fontSize: '0.78rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', minWidth: 80, textAlign: 'right' }}>
                R{(product.price * quantity).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.5rem', position: 'sticky', top: 80 }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: '#1F2937' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#4B5563' }}>
              <span>Subtotal</span>
              <span>R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#4B5563' }}>
              <span>Delivery</span>
              <span style={{ color: shipping === 0 ? '#22C55E' : '#4B5563' }}>{shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Add R{(500 - total).toFixed(2)} more for free delivery</p>}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#1F2937' }}>
              <span>Total</span>
              <span>R{orderTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Proceed to Checkout →</Link>
          <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem', fontSize: '0.83rem', color: '#1E40AF', textDecoration: 'none' }}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
