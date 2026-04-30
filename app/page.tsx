'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, CATEGORIES, Category } from '@/lib/products';

// Category SVG icons (matching Header)
function CatIcon({ cat }: { cat: string }) {
  const paths: Record<string, JSX.Element> = {
    'power-control':    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>,
    'lighting':         <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" strokeLinecap="round"/></>,
    'security':         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round"/>,
    'environmental':    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" strokeLinecap="round"/>,
    'access-control':   <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    'remote-control':   <><rect x="8" y="2" width="8" height="20" rx="4"/><circle cx="12" cy="8" r="1" fill="currentColor"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="16" x2="14" y2="16"/></>,
    'water-control':    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinejoin="round"/>,
    'voice-assistants': <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    'bundles':          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinejoin="round"/>,
  };
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
      {paths[cat] ?? <rect x="3" y="3" width="18" height="18" rx="3"/>}
    </svg>
  );
}

const CAT_CARDS: Array<{ key: Category; accent: string; bg: string }> = [
  { key: 'power-control',    accent: '#D97706', bg: '#FFFBEB' },
  { key: 'lighting',         accent: '#EA580C', bg: '#FFF7ED' },
  { key: 'security',         accent: '#16A34A', bg: '#F0FDF4' },
  { key: 'environmental',    accent: '#2563EB', bg: '#EFF6FF' },
  { key: 'voice-assistants', accent: '#7C3AED', bg: '#F5F3FF' },
  { key: 'access-control',   accent: '#DC2626', bg: '#FFF1F2' },
  { key: 'water-control',    accent: '#0891B2', bg: '#ECFEFF' },
  { key: 'bundles',          accent: '#1E40AF', bg: '#EFF6FF' },
];

const BRANDS = ['TP-Link TAPO', 'Tuya', 'Smartlife', 'Google Nest', 'Amazon Echo', 'GeeWiz'];

export default function Home() {
  const featured = getFeaturedProducts();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Parallax: text lifts up, video stays, overlay fades as user scrolls
  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const heroH = heroRef.current?.offsetHeight ?? 700;
      if (scrollY > heroH) return;
      const pct = scrollY / heroH;

      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-scrollY * 0.45}px)`;
        contentRef.current.style.opacity = `${Math.max(0, 1 - pct * 2.2)}`;
      }
      if (overlayRef.current) {
        // Overlay lightens slightly so video shines through on scroll
        overlayRef.current.style.opacity = `${Math.max(0.4, 1 - pct * 0.7)}`;
      }
      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + pct * 0.08})`;
      }
      setHeroVisible(pct < 0.85);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── VIDEO HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', height: 'min(90vh, 760px)', overflow: 'hidden', background: '#0a0e1a' }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transformOrigin: 'center center', willChange: 'transform' }}
        >
          <source src="https://static.tapo.com/res/new-home/img/temp/home-tapo-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div ref={overlayRef} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.5) 50%, rgba(10,14,26,0.88) 100%)', willChange: 'opacity' }} />

        {/* Hero content — parallax target */}
        <div ref={contentRef} style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem', willChange: 'transform, opacity' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30,64,175,0.3)', border: '1px solid rgba(147,197,253,0.4)', borderRadius: 100, padding: '0.3rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: 7, height: 7, background: '#93C5FD', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD' }}>
              SA's Smart Home Store · Free Delivery R500+
            </span>
          </div>

          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', lineHeight: 1.05, color: 'white', marginBottom: '1rem', maxWidth: 800 }}>
            South Africa's Smart<br />
            <span style={{ color: '#93C5FD' }}>Home Warehouse</span>
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, maxWidth: 560, marginBottom: '0.75rem' }}>
            Curated smart home products that actually work together.
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: '#93C5FD', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>
            TAPO · Tuya · Smartlife · Google · Amazon
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/shop" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2.25rem' }}>
              Browse Products →
            </Link>
            <Link href="/shop?cat=bundles" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              View Bundles
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        {heroVisible && (
          <div style={{ position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', opacity: 0.55, zIndex: 2, pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </div>
        )}
      </section>

      {/* ── CATEGORY GRID ── */}
      <section style={{ background: 'white', padding: '2.25rem 0', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: '#1F2937', marginBottom: '1.25rem' }}>
            Shop by Category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {CAT_CARDS.map(({ key, accent, bg }) => (
              <Link key={key} href={`/shop?cat=${key}`}
                style={{ textDecoration: 'none', background: bg, border: `1.5px solid ${accent}22`, borderRadius: 12, padding: '1.2rem 0.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem', transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 24px ${accent}22`; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accent}55`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${accent}22`; }}>
                <span style={{ color: accent }}><CatIcon cat={key} /></span>
                <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: '#1F2937', lineHeight: 1.3 }}>{CATEGORIES[key]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP STRIP ── */}
      <section style={{ background: '#1E40AF', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            [<svg key="a" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>, 'Load Shedding Ready', 'Works with backup power'],
            [<svg key="b" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>, 'SA Plug Compatible', 'Type M & N certified'],
            [<svg key="c" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 3-5 3V8z"/></svg>, 'Nationwide Delivery', 'Free over R500'],
            [<svg key="d" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, 'Ecosystem Compatible', 'All devices work together'],
            [<svg key="e" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, 'Trusted Products', 'Curated & tested'],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {icon}
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
          <Link href="/shop" style={{ color: '#1E40AF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <section style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', textAlign: 'center', marginBottom: '1rem' }}>
            Trusted Brands
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {BRANDS.map(brand => (
              <span key={brand} style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#9CA3AF', letterSpacing: '0.03em' }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
