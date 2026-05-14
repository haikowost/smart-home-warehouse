'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { use, useState } from 'react';
import { getProductBySlug, CATEGORIES } from '@/lib/products';
import { useCart } from '@/components/CartProvider';
import { useWishlist } from '@/components/WishlistProvider';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const maybeProduct = getProductBySlug(slug);
  if (!maybeProduct) return notFound();
  const product = maybeProduct;

  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'delivery'>('description');
  const inWishlist = has(product.id);

  const compareDisplay = product.comparePrice && product.comparePrice > product.price
    ? `R${product.comparePrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : null;

  function handleAdd() {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.5rem' }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1.25rem', fontSize: '0.82rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#1E40AF', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link href="/shop" style={{ color: '#1E40AF', textDecoration: 'none' }}>Shop</Link>
        <span>›</span>
        <Link href={`/shop?cat=${product.category}`} style={{ color: '#1E40AF', textDecoration: 'none' }}>{CATEGORIES[product.category]}</Link>
        <span>›</span>
        <span style={{ color: '#374151' }}>{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

        {/* ── LEFT: Image gallery ── */}
        <div>
          {/* Main image */}
          <div
            onClick={() => setLightboxOpen(true)}
            style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '1.5rem', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', position: 'relative', overflow: 'hidden' }}
          >
            <img
              src={product.images[activeImg] || '/images/placeholder.png'}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
            />
            {product.featured && (
              <span style={{ position: 'absolute', top: 12, left: 12, background: '#1E40AF', color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 100, fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured
              </span>
            )}
            {!product.inStock && (
              <span style={{ position: 'absolute', top: 12, right: 12, background: '#6B7280', color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 100, fontFamily: 'IBM Plex Mono, monospace' }}>
                Out of Stock
              </span>
            )}
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.45)', color: 'white', borderRadius: 6, padding: '0.25rem 0.55rem', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              Click to zoom
            </div>
            {product.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.45)', color: 'white', borderRadius: 6, padding: '0.25rem 0.55rem', fontSize: '0.68rem' }}>
                {activeImg + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    flexShrink: 0, width: 72, height: 72, padding: '0.3rem',
                    border: `2px solid ${activeImg === i ? '#1E40AF' : '#E5E7EB'}`,
                    borderRadius: 8, background: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product info ── */}
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            {product.brand} · {CATEGORIES[product.category]}
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.9rem', lineHeight: 1.15, marginBottom: '0.5rem', color: '#1F2937' }}>
            {product.name}
          </h1>

          {/* Stock + SKU */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: product.inStock ? '#16A34A' : '#6B7280' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: product.inStock ? '#16A34A' : '#9CA3AF', display: 'inline-block' }} />
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span style={{ color: '#E5E7EB' }}>|</span>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontFamily: 'IBM Plex Mono, monospace' }}>SKU: {product.sku}</span>
          </div>

          <p style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {product.shortDesc}
          </p>

          {/* Price */}
          <div style={{ marginBottom: '1.25rem' }}>
            {product.price > 0 ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2.4rem', color: '#1F2937', lineHeight: 1 }}>
                  R{product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
                {compareDisplay && (
                  <span style={{ fontSize: '1.1rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                    {compareDisplay}
                  </span>
                )}
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>incl. VAT</span>
              </div>
            ) : (
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#6B7280' }}>
                Price on Application
              </div>
            )}
          </div>

          {/* Add to cart / Enquire */}
          {product.inStock && product.price > 0 ? (
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #D1D5DB', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.65rem 1rem', border: 'none', background: 'white', cursor: 'pointer', fontSize: '1.15rem', color: '#374151', lineHeight: 1 }}>−</button>
                <span style={{ padding: '0.65rem 0.75rem', fontWeight: 700, minWidth: 44, textAlign: 'center', fontSize: '0.95rem', background: '#F9FAFB' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ padding: '0.65rem 1rem', border: 'none', background: 'white', cursor: 'pointer', fontSize: '1.15rem', color: '#374151', lineHeight: 1 }}>+</button>
              </div>
              <button className="btn-primary" onClick={handleAdd} style={{ flex: 1, padding: '0.72rem 1.25rem', fontSize: '0.95rem' }}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggle(product)}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 8, border: `1.5px solid ${inWishlist ? '#EF4444' : '#D1D5DB'}`, background: inWishlist ? '#FEF2F2' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s, background 0.15s' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={inWishlist ? '#EF4444' : 'none'} stroke={inWishlist ? '#EF4444' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <a
                href={`mailto:smarthome@smart-vision.co.za?subject=Enquiry: ${encodeURIComponent(product.name)}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#1E40AF', color: 'white', borderRadius: 8, padding: '0.72rem 1.25rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'IBM Plex Sans, sans-serif' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Enquire by Email
              </a>
              <button
                onClick={() => toggle(product)}
                title={inWishlist ? 'Remove from wishlist' : 'Save for later'}
                style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 8, border: `1.5px solid ${inWishlist ? '#EF4444' : '#D1D5DB'}`, background: inWishlist ? '#FEF2F2' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={inWishlist ? '#EF4444' : 'none'} stroke={inWishlist ? '#EF4444' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
            {['Free delivery over R500', 'SA stock', 'Tech support'].map(b => (
              <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 100, fontSize: '0.71rem', padding: '0.2rem 0.65rem', fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {b}
              </span>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {product.tags.map(tag => (
              <Link key={tag} href={`/shop?q=${encodeURIComponent(tag)}`}
                style={{ background: '#EFF6FF', color: '#1E3A8A', fontSize: '0.72rem', padding: '0.18rem 0.6rem', borderRadius: 100, textDecoration: 'none' }}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '1.5rem', gap: 0 }}>
          {(['description', 'specs', 'delivery'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '0.65rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: activeTab === tab ? '#1E40AF' : '#6B7280', borderBottom: `2px solid ${activeTab === tab ? '#1E40AF' : 'transparent'}`, marginBottom: -2, transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
              {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Shipping & Delivery'}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '2rem' }}>
            <p style={{ color: '#374151', lineHeight: 1.85, fontSize: '0.95rem' }}>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <tbody>
                {[
                  ['Brand', product.brand],
                  ['Model / SKU', product.sku],
                  ['Category', CATEGORIES[product.category]],
                  ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                  ...product.tags.map(t => ['Tag', t] as [string, string]),
                ].map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                    <td style={{ padding: '0.65rem 1.25rem', fontWeight: 600, color: '#374151', width: '35%', fontSize: '0.85rem' }}>{k}</td>
                    <td style={{ padding: '0.65rem 1.25rem', color: '#6B7280' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🚚', title: 'Free Delivery', desc: 'On orders over R500. Nationwide courier delivery.' },
                { icon: '📦', title: 'Fast Dispatch', desc: 'In-stock items dispatched within 1–2 business days.' },
                { icon: '↩️', title: '30-Day Returns', desc: 'Unopened items accepted within 30 days of purchase.' },
                { icon: '🛡️', title: 'SA Warranty', desc: 'All products carry a valid South African supplier warranty.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ padding: '1.1rem', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.45rem' }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1F2937', marginBottom: '0.3rem' }}>{title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>

          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {product.images.length > 1 && (
              <button
                onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                style={{ position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >‹</button>
            )}
            <img
              src={product.images[activeImg] || '/images/placeholder.png'}
              alt={product.name}
              style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8 }}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                  style={{ position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >›</button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: activeImg === i ? 'white' : 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link href="/shop" style={{ color: '#1E40AF', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>← Back to Shop</Link>
      </div>
    </div>
  );
}
