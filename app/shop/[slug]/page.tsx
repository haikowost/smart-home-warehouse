'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { use, useState } from 'react';
import { getProductBySlug, CATEGORIES } from '@/lib/products';
import { useCart } from '@/components/CartProvider';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const priceDisplay = product.price > 0
    ? `R${product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : 'Price on Application';

  function handleAdd() {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.82rem', color: '#6B7280' }}>
        <Link href="/" style={{ color: '#9B59B6', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/shop" style={{ color: '#9B59B6', textDecoration: 'none' }}>Shop</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href={`/shop?cat=${product.category}`} style={{ color: '#9B59B6', textDecoration: 'none' }}>{CATEGORIES[product.category]}</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span>{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '2rem', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
          />
        </div>

        {/* Info */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: '#9B59B6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            {product.brand} · {CATEGORIES[product.category]}
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '0.75rem', color: '#1F2937' }}>
            {product.name}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            {product.shortDesc}
          </p>

          {/* Price */}
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#1F2937', marginBottom: '1.5rem' }}>
            {priceDisplay}
            {product.price > 0 && <span style={{ fontSize: '0.9rem', color: '#6B7280', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 400, marginLeft: '0.5rem' }}>incl. VAT</span>}
          </div>

          {/* Add to cart */}
          {product.inStock && product.price > 0 ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.6rem 0.9rem', border: 'none', background: 'white', cursor: 'pointer', fontSize: '1rem', color: '#6B7280' }}>−</button>
                <span style={{ padding: '0.6rem 0.75rem', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ padding: '0.6rem 0.9rem', border: 'none', background: 'white', cursor: 'pointer', fontSize: '1rem', color: '#6B7280' }}>+</button>
              </div>
              <button className="btn-primary" onClick={handleAdd} style={{ flex: 1 }}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <div style={{ background: '#F9F0FF', border: '1px solid #DDD6FE', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#7D3C98' }}>
              Contact us for pricing: <a href="mailto:smarthome@smart-vision.co.za" style={{ color: '#7D3C98', fontWeight: 600 }}>smarthome@smart-vision.co.za</a>
            </div>
          )}

          {/* SKU & tags */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>SKU: {product.sku}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {product.tags.map((tag) => (
                <span key={tag} style={{ background: '#F3E8FF', color: '#7D3C98', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 100 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem', color: '#1F2937' }}>Product Details</h2>
        <p style={{ color: '#4B5563', lineHeight: 1.75, fontSize: '0.93rem' }}>{product.description}</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link href="/shop" style={{ color: '#9B59B6', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>← Back to Shop</Link>
      </div>
    </div>
  );
}
