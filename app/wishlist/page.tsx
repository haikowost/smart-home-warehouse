'use client';
import Link from 'next/link';
import { useWishlist } from '@/components/WishlistProvider';
import ProductCard from '@/components/ProductCard';
import { getProductsByIds } from '@/lib/products';

export default function WishlistPage() {
  const { ids, count, remove } = useWishlist();
  const products = getProductsByIds(ids);

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#1F2937' }}>
            My Wishlist
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '0.25rem' }}>{count} {count === 1 ? 'item' : 'items'}</p>
        </div>
        {count > 0 && (
          <button
            onClick={() => ids.forEach(id => remove(id))}
            style={{ fontSize: '0.82rem', color: '#EF4444', background: 'none', border: '1px solid #FECACA', borderRadius: 6, padding: '0.4rem 0.9rem', cursor: 'pointer' }}
          >
            Clear All
          </button>
        )}
      </div>

      {count === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>♡</div>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Save products you love and come back to them anytime.</p>
          <Link href="/shop" className="btn-primary">Browse Products →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
