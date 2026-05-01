'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';
import { CATEGORIES, Category } from '@/lib/products';

// ── SVG icon primitives ────────────────────────────────────────────────────
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#EF4444' : 'none'} stroke={filled ? '#EF4444' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconCart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={filled ? '#1E40AF' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

// Category SVG icons
const CatIcons: Record<string, () => React.ReactElement> = {
  'power-control':    () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  'lighting':         () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  'security':         () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'environmental':    () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  'access-control':   () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  'remote-control':   () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="20" rx="4"/><circle cx="12" cy="8" r="1" fill="currentColor"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="16" x2="14" y2="16"/></svg>,
  'water-control':    () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  'voice-assistants': () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  'bundles':          () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
};

const NAV_CATS: Category[] = ['power-control', 'lighting', 'security', 'environmental', 'voice-assistants', 'access-control'];

// Logo: tries the real PNG, falls back to inline SVG + wordmark
function LogoImage() {
  const [imgOk, setImgOk] = useState(true);
  return imgOk ? (
    <img
      src="/images/shwh-logo.png"
      alt="Smart Home Warehouse"
      style={{ height: 44, width: 'auto', maxWidth: 180, objectFit: 'contain' }}
      onError={() => setImgOk(false)}
    />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
      <SHWLogo />
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#1A1A2E' }}>Smart Home</div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#1E40AF' }}>Warehouse</div>
      </div>
    </div>
  );
}

// Inline SVG house logo — always renders, no file dependency
function SHWLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#1E40AF"/>
      <path d="M18 8L7 17h3v11h7v-7h2v7h7V17h3L18 8z" fill="white"/>
      <circle cx="18" cy="17" r="2.5" fill="#93C5FD"/>
    </svg>
  );
}

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [search, setSearch] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push(`/shop?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.1)' : '0 1px 0 #E5E7EB' }}>

      {/* Announcement bar */}
      <div style={{ background: '#1E40AF', color: 'white', textAlign: 'center', padding: '0.28rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
        Free delivery on orders over R500 &nbsp;·&nbsp; SA's curated smart home store &nbsp;·&nbsp; Tuya · TP-Link TAPO · Google Nest
      </div>

      {/* Main row */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0.55rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <LogoImage />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 720 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search smart home products, brands, categories..."
            style={{
              flex: 1, padding: '0.58rem 1rem',
              border: '2px solid #1E40AF', borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              fontSize: '0.88rem', fontFamily: 'IBM Plex Sans, sans-serif',
              outline: 'none', color: '#1F2937',
            }}
          />
          <button type="submit" style={{
            background: '#1E40AF', color: 'white', border: 'none',
            padding: '0 1.1rem', borderRadius: '0 8px 8px 0',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}>
            <IconSearch />
          </button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

          {/* Wishlist */}
          <Link href="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', padding: '0.35rem 0.6rem', borderRadius: 8, position: 'relative', gap: 2 }}>
            <IconHeart filled={wishCount > 0} />
            <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', color: '#9CA3AF' }}>
              {wishCount > 0 ? `(${wishCount})` : 'Saved'}
            </span>
            {wishCount > 0 && (
              <span style={{ position: 'absolute', top: 1, right: 1, background: '#EF4444', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 700 }}>{wishCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', padding: '0.35rem 0.6rem', borderRadius: 8, position: 'relative', gap: 2, background: count > 0 ? '#EFF6FF' : 'transparent' }}>
            <IconCart filled={count > 0} />
            <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', color: count > 0 ? '#1E40AF' : '#9CA3AF' }}>
              {count > 0 ? `Cart (${count})` : 'Cart'}
            </span>
            {count > 0 && (
              <span style={{ position: 'absolute', top: 1, right: 1, background: '#1E40AF', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 700 }}>{count}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Category nav bar */}
      <div style={{ background: '#1A1A2E', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'stretch', overflowX: 'auto' }}>

          {/* All Categories dropdown */}
          <div ref={catRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setCatOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: catOpen ? '#1E40AF' : 'transparent',
                color: 'white', border: 'none',
                padding: '0.62rem 1rem', cursor: 'pointer',
                fontSize: '0.83rem', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
                whiteSpace: 'nowrap', transition: 'background 0.15s',
              }}
            >
              <IconMenu />
              All Categories
              <IconChevron />
            </button>

            {catOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 200,
                background: 'white', border: '1px solid #E5E7EB',
                borderRadius: '0 0 10px 10px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                width: 270, overflow: 'hidden',
              }}>
                <Link href="/shop" onClick={() => setCatOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: '#1F2937', fontWeight: 700, fontSize: '0.88rem', borderBottom: '2px solid #F3F4F6' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1E40AF" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  All Products
                </Link>
                {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => {
                  const Icon = CatIcons[key];
                  return (
                    <Link key={key} href={`/shop?cat=${key}`} onClick={() => setCatOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 1rem', textDecoration: 'none', color: '#374151', fontSize: '0.87rem', transition: 'background 0.1s, color 0.1s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLAnchorElement).style.color = '#1E40AF'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.color = '#374151'; }}>
                      <span style={{ color: '#1E40AF', flexShrink: 0 }}>{Icon && <Icon />}</span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0', flexShrink: 0 }} />

          {/* Quick category links */}
          {NAV_CATS.map(key => (
            <Link key={key} href={`/shop?cat=${key}`}
              style={{ display: 'flex', alignItems: 'center', color: '#CBD5E1', textDecoration: 'none', fontSize: '0.82rem', padding: '0.62rem 0.85rem', whiteSpace: 'nowrap', transition: 'color 0.15s', fontFamily: 'IBM Plex Sans, sans-serif' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'white'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1'}>
              {CATEGORIES[key]}
            </Link>
          ))}

          {/* Bundles — highlighted */}
          <Link href="/shop?cat=bundles"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FCD34D', textDecoration: 'none', fontSize: '0.82rem', padding: '0.62rem 0.85rem', fontWeight: 700, marginLeft: 'auto', whiteSpace: 'nowrap', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Bundles & Deals
          </Link>
        </div>
      </div>
    </header>
  );
}
