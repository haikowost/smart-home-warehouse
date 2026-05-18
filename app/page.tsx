'use client';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, CATEGORIES, Category } from '@/lib/products';

// Apple-style app icon tiles per category
const CAT_TILES: Array<{ key: Category; gradient: string; icon: React.ReactElement }> = [
  {
    key: 'power-control',
    gradient: 'linear-gradient(145deg, #F7971E, #FFD200)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    key: 'lighting',
    gradient: 'linear-gradient(145deg, #FF512F, #F09819)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  },
  {
    key: 'cameras',
    gradient: 'linear-gradient(145deg, #0F2027, #203A43)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  },
  {
    key: 'security',
    gradient: 'linear-gradient(145deg, #1E3C72, #2A5298)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  },
  {
    key: 'environmental',
    gradient: 'linear-gradient(145deg, #11998E, #38EF7D)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  },
  {
    key: 'access-control',
    gradient: 'linear-gradient(145deg, #7F00FF, #C471ED)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="white"/></svg>,
  },
  {
    key: 'remote-control',
    gradient: 'linear-gradient(145deg, #2193B0, #6DD5ED)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="20" rx="4"/><circle cx="12" cy="8" r="1.2" fill="white"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="16.5" x2="14" y2="16.5"/></svg>,
  },
  {
    key: 'water-control',
    gradient: 'linear-gradient(145deg, #00B4DB, #0083B0)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  },
  {
    key: 'voice-assistants',
    gradient: 'linear-gradient(145deg, #EB3349, #F45C43)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  },
  {
    key: 'bundles',
    gradient: 'linear-gradient(145deg, #1E40AF, #7C3AED)',
    icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  },
];

const BRANDS = ['TP-Link TAPO', 'Tuya', 'Smartlife', 'Google Nest', 'Amazon Echo', 'GeeWiz'];

export default function Home() {
  const featured = getFeaturedProducts();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Fade out scroll indicator as user scrolls
  useEffect(() => {
    function onScroll() {
      if (scrollRef.current) {
        scrollRef.current.style.opacity = `${Math.max(0, 1 - window.scrollY / 80)}`;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── SECTION 1: Cinematic video — full screen, no text ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#0a0e1a' }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
        >
          <source src="https://static.tapo.com/res/new-home/img/temp/home-tapo-video.mp4" type="video/mp4" />
        </video>

        {/* Very subtle bottom gradient to blend into next section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to bottom, transparent, #0a0e1a)' }} />

        {/* Scroll indicator */}
        <div ref={scrollRef} style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2, pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Scroll</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: Heading — dark static background ── */}
      <section style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0F172A 40%, #1A1A2E 100%)', padding: '5rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30,64,175,0.3)', border: '1px solid rgba(147,197,253,0.35)', borderRadius: 100, padding: '0.3rem 1.1rem', marginBottom: '1.75rem' }}>
            <span style={{ width: 7, height: 7, background: '#93C5FD', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD' }}>
              SA's Smart Home Store · Free Delivery R500+
            </span>
          </div>

          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.05, color: 'white', marginBottom: '1.25rem' }}>
            South Africa's Smart<br />
            <span style={{ color: '#93C5FD' }}>Home Warehouse</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 0.75rem' }}>
            Curated smart home products that actually work together — Tapo, Tuya, Google, Amazon and more.
          </p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: '#93C5FD', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>
            TAPO · TUYA · SMARTLIFE · GOOGLE · AMAZON
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/shop" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
              Shop Now →
            </Link>
            <Link href="/shop?cat=bundles" className="btn-outline-white" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              View Bundles
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Category tiles — Apple app icon style ── */}
      <section style={{ background: '#F8FAFC', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0F172A', textAlign: 'center', marginBottom: '2rem' }}>
            Shop by Category
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem 2rem', justifyContent: 'center' }}>
            {CAT_TILES.map(({ key, gradient, icon }) => (
              <Link key={key} href={`/shop?cat=${key}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: 88 }}>
                <div
                  style={{
                    width: 72, height: 72,
                    borderRadius: '22%',
                    background: gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08) translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.14)'; }}
                >
                  {icon}
                </div>
                <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '0.72rem', color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>
                  {CATEGORIES[key]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: USP strip ── */}
      <section style={{ background: '#1E40AF', padding: '1.1rem 1.5rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            [<svg key="a" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>, 'Load Shedding Ready'],
            [<svg key="b" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>, 'SA Plug Compatible'],
            [<svg key="c" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 3-5 3V8z"/></svg>, 'Free Delivery R500+'],
            [<svg key="d" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>, 'Ecosystem Compatible'],
            [<svg key="e" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, 'Curated & Tested'],
          ].map(([icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {icon}
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'white' }}>{label as string}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: Featured products ── */}
      <section style={{ maxWidth: 1300, margin: '3rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0F172A' }}>Featured Products</h2>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>Hand-picked products that work great together</p>
          </div>
          <Link href="/shop" style={{ color: '#1E40AF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── SECTION 6: Brand strip ── */}
      <section style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '1.75rem 1.5rem', marginBottom: '3rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#9CA3AF', textAlign: 'center', marginBottom: '1.25rem' }}>
            Trusted Brands
          </div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
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
