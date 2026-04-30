'use client';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from './CartProvider';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const priceDisplay = product.price > 0
    ? `R${product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : 'POA';

  return (
    <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(30,64,175,0.15)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
      {/* Image */}
      <Link href={`/shop/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ background: '#F9FAFB', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
          {product.brand}
        </div>
        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.4rem', color: '#1F2937' }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '0.75rem', flex: 1 }}>
          {product.shortDesc}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: product.price > 0 ? '#1F2937' : '#1E40AF' }}>
            {priceDisplay}
          </div>
          {product.inStock ? (
            <button
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              onClick={() => add(product)}
            >
              Add to Cart
            </button>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
