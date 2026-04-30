'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';

function Stars({ n = 4 }: { n?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#F59E0B' : '#D1D5DB', fontSize: '0.78rem' }}>★</span>
      ))}
    </span>
  );
}

const CATEGORY_ICONS: Record<string, string> = {
  'power-control': '⚡', 'lighting': '💡', 'security': '🔒',
  'environmental': '🌡', 'access-control': '🚪', 'remote-control': '📡',
  'water-control': '💧', 'voice-assistants': '🎤', 'bundles': '📦',
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wished = has(product.id);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const priceDisplay = product.price > 0
    ? `R${product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : 'POA';

  return (
    <div className="product-card">

      {/* Image */}
      <div style={{ position: 'relative' }}>
        <Link href={`/shop/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ background: '#F9FAFB', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
            {!imgError && product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                onError={() => setImgError(true)}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: '#9CA3AF' }}>
                <span style={{ fontSize: '2.5rem' }}>{CATEGORY_ICONS[product.category] ?? '📦'}</span>
                <span style={{ fontSize: '0.62rem', fontFamily: 'IBM Plex Mono, monospace', color: '#CBD5E1', textAlign: 'center' }}>{product.brand}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={() => toggle(product)}
          title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'white',
            border: wished ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '1rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            color: wished ? '#EF4444' : '#9CA3AF',
            transition: 'border-color 0.15s, color 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
        >
          {wished ? '♥' : '♡'}
        </button>

        {/* Badges */}
        {!product.inStock && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#6B7280', color: 'white', fontSize: '0.62rem', padding: '0.18rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>
            OUT OF STOCK
          </div>
        )}
        {product.inStock && product.price === 0 && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#1E40AF', color: 'white', fontSize: '0.62rem', padding: '0.18rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>
            POA
          </div>
        )}
        {product.inStock && product.price > 0 && product.featured && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#16A34A', color: 'white', fontSize: '0.62rem', padding: '0.18rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>
            FEATURED
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
          {product.brand}
        </div>

        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
          <h3 style={{
            fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '0.87rem',
            lineHeight: 1.4, color: '#1F2937', marginBottom: '0.4rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
          <Stars n={4} />
          <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>(new)</span>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: product.price > 0 ? '#111827' : '#1E40AF' }}>
            {priceDisplay}
          </span>
          {product.price > 0 && <span style={{ fontSize: '0.67rem', color: '#9CA3AF', marginLeft: 4 }}>incl. VAT</span>}
        </div>

        {product.inStock && product.price > 0 ? (
          <button
            onClick={handleAdd}
            style={{
              width: '100%', background: added ? '#16A34A' : '#1E40AF',
              color: 'white', border: 'none', padding: '0.52rem',
              borderRadius: 7, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s',
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          >
            {added ? '✓ Added to Cart' : '+ Add to Cart'}
          </button>
        ) : product.price === 0 ? (
          <Link href={`/shop/${product.slug}`} style={{
            display: 'block', textAlign: 'center', textDecoration: 'none',
            background: '#EFF6FF', color: '#1E40AF',
            border: '1.5px solid #BFDBFE', borderRadius: 7,
            padding: '0.48rem', fontSize: '0.82rem', fontWeight: 600,
          }}>
            Request Price →
          </Link>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF', padding: '0.5rem 0' }}>Out of stock</div>
        )}
      </div>
    </div>
  );
}
