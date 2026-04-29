import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, CATEGORIES, Category } from '@/lib/products';

export default function Home() {
  const featured = getFeaturedProducts();

  const cats: Array<{ key: Category; icon: string }> = [
    { key: 'power-control', icon: '⚡' },
    { key: 'lighting', icon: '💡' },
    { key: 'security', icon: '🔒' },
    { key: 'environmental', icon: '🌡️' },
    { key: 'voice-assistants', icon: '🎙️' },
    { key: 'access-control', icon: '🚪' },
    { key: 'water-control', icon: '💧' },
    { key: 'bundles', icon: '📦' },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 100%)', color: 'white', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', borderRadius: 100, padding: '0.3rem 1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 7, height: 7, background: '#9B59B6', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B59B6' }}>Now Open · Free Delivery over R500</span>
          </div>
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
            South Africa&apos;s Smart<br /><span style={{ color: '#9B59B6' }}>Home Warehouse</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '2rem' }}>
            Curated smart home products that actually work together. Tuya, Smartlife, TAPO and more — all compatible, all in stock, delivered nationwide.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn-primary">Browse All Products →</Link>
            <Link href="/shop?cat=bundles" className="btn-outline">View Bundles</Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section style={{ maxWidth: 1200, margin: '3rem auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.25rem', color: '#1F2937' }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {cats.map(({ key, icon }) => (
            <Link key={key} href={`/shop?cat=${key}`} style={{ textDecoration: 'none', background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.25rem 0.75rem', textAlign: 'center', transition: 'all 0.2s', display: 'block' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#9B59B6'; (e.currentTarget as HTMLAnchorElement).style.background = '#F9F0FF'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLAnchorElement).style.background = 'white'; }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#1F2937', lineHeight: 1.3 }}>{CATEGORIES[key]}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* SA-specific banner */}
      <section style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['⚡', 'Load Shedding Ready', 'Products that work with backup power'], ['🇿🇦', 'SA-Specific Plugs', 'Type M & N compatible'], ['🚚', 'Nationwide Delivery', 'Free over R500'], ['🔧', 'Works Together', 'Tuya ecosystem compatible']].map(([icon, title, desc]) => (
            <div key={title as string} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{icon as string}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1F2937' }}>{title as string}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{desc as string}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section style={{ maxWidth: 1200, margin: '3rem auto', padding: '0 1.5rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>Featured Products</h2>
          <Link href="/shop" style={{ color: '#9B59B6', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
