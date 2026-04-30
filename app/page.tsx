'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, CATEGORIES, Category } from '@/lib/products';

const CAT_CARDS: Array<{ key: Category; icon: string; color: string }> = [
  { key: 'power-control',   icon: '⚡', color: '#FEF3C7' },
  { key: 'lighting',        icon: '💡', color: '#FFF7ED' },
  { key: 'security',        icon: '🔒', color: '#F0FDF4' },
  { key: 'environmental',   icon: '🌡️', color: '#EFF6FF' },
  { key: 'voice-assistants',icon: '🎙️', color: '#F5F3FF' },
  { key: 'access-control',  icon: '🚪', color: '#FFF1F2' },
  { key: 'water-control',   icon: '💧', color: '#ECFEFF' },
  { key: 'bundles',         icon: '📦', color: '#F0FDF4' },
];

const BRANDS = ['TP-Link TAPO', 'Tuya', 'Smartlife', 'Google Nest', 'Amazon Echo', 'GeeWiz'];

export default function Home() {
  const featured = getFeaturedProducts();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      {/* ── VIDEO HERO ── */}
      <section style={{ position: 'relative', height: 'min(88vh, 720px)', overflow: 'hidden', background: '#0a0e1a' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        >
          {/* User-provided video — host locally at /public/videos/hero.mp4 for production */}
          <source src="https://static.tapo.com/res/new-home/img/temp/home-tapo-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — stronger at bottom to blend into page */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,26,0.35) 0%, rgba(10,14,26,0.55) 60%, rgba(10,14,26,0.85) 100%)' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30,64,175,0.3)', border: '1px solid rgba(147,197,253,0.4)', borderRadius: 100, padding: '0.3rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: 7, height: 7, background: '#93C5FD', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD' }}>
              SA's Smart Home Store · Free Delivery R500+
            </span>
          </div>

          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.05, color: 'white', marginBottom: '1rem', maxWidth: 780 }}>
            South Africa's Smart<br />
            <span style={{ color: '#93C5FD' }}>Home Warehouse</span>
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, maxWidth: 580, marginBottom: '0.75rem' }}>
            Curated smart home products that actually work together.
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: '#93C5FD', letterSpacing: '0.1em', marginBottom: '2.25rem' }}>
            TAPO · Tuya · Smartlife · Google · Amazon
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/shop" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              Browse Products →
            </Link>
            <Link href="/shop?cat=bundles" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              View Bundles
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', opacity: 0.6 }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'IBM Plex Mono, monospace', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <span style={{ color: 'white', fontSize: '1rem' }}>↓</span>
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section style={{ background: 'white', padding: '2rem 0', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: '#1F2937', marginBottom: '1.25rem' }}>
            Shop by Category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {CAT_CARDS.map(({ key, icon, color }) => (
              <Link key={key} href={`/shop?cat=${key}`}
                style={{ textDecoration: 'none', background: color, border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.1rem 0.75rem', textAlign: 'center', display: 'block', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(30,64,175,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
                <div style={{ fontSize: '1.7rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#1F2937', lineHeight: 1.3 }}>{CATEGORIES[key]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP STRIP ── */}
      <section style={{ background: '#1E40AF', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            ['⚡', 'Load Shedding Ready', 'Works with backup power'],
            ['🇿🇦', 'SA Plug Compatibility', 'Type M & N certified'],
            ['🚚', 'Nationwide Delivery', 'Free over R500'],
            ['🔧', 'Ecosystem Compatible', 'All devices work together'],
            ['🛡️', 'Trusted Products', 'Curated & tested'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{icon as string}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'white' }}>{title as string}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{desc as string}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ maxWidth: 1300, margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: '#1F2937' }}>Featured Products</h2>
          <Link href="/shop" style={{ color: '#1E40AF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>View all products →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <section style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '1.5rem 1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', textAlign: 'center', marginBottom: '1rem' }}>
            Trusted Brands
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {BRANDS.map(brand => (
              <span key={brand} style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#6B7280', letterSpacing: '0.03em' }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
