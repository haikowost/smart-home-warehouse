'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';
import { CATEGORIES, Category } from '@/lib/products';

const CAT_ICONS: Record<string, string> = {
  'power-control': '⚡',
  'lighting': '💡',
  'security': '🔒',
  'environmental': '🌡️',
  'access-control': '🚪',
  'remote-control': '📱',
  'water-control': '💧',
  'voice-assistants': '🎙️',
  'bundles': '📦',
};

const NAV_CATS: Category[] = ['power-control', 'lighting', 'security', 'environmental', 'voice-assistants', 'access-control'];

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

  const iconBtnStyle = (active: boolean) => ({
    display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center' as const,
    textDecoration: 'none', color: '#374151', position: 'relative' as const,
    padding: '0.35rem 0.5rem', borderRadius: 8,
    background: active ? '#EFF6FF' : 'transparent',
  });

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.1)' : '0 1px 0 #E5E7EB' }}>

      {/* Announcement bar */}
      <div style={{ background: '#1E40AF', color: 'white', textAlign: 'center', padding: '0.28rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
        Free delivery on orders over R500 &nbsp;·&nbsp; SA's curated smart home store &nbsp;·&nbsp; Tuya · TP-Link TAPO · Google Nest
      </div>

      {/* Main row */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/images/shwh-logo.png" alt="SHW" style={{ height: 34, width: 'auto' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: '#1A1A2E' }}>Smart Home</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: '#1E40AF' }}>Warehouse</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 720 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search smart home products, brands, categories..."
            style={{
              flex: 1, padding: '0.6rem 1rem',
              border: '2px solid #1E40AF', borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              fontSize: '0.88rem', fontFamily: 'IBM Plex Sans, sans-serif',
              outline: 'none', color: '#1F2937',
            }}
          />
          <button type="submit" style={{
            background: '#1E40AF', color: 'white', border: 'none',
            padding: '0.6rem 1.1rem', borderRadius: '0 8px 8px 0',
            cursor: 'pointer', fontSize: '1.05rem', flexShrink: 0,
          }}>
            🔍
          </button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          <Link href="/wishlist" style={iconBtnStyle(false)}>
            <span style={{ fontSize: '1.35rem', lineHeight: 1, color: wishCount > 0 ? '#EF4444' : '#6B7280' }}>
              {wishCount > 0 ? '♥' : '♡'}
            </span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 2 }}>Wishlist</span>
            {wishCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 0, background: '#EF4444', color: 'white', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>{wishCount}</span>
            )}
          </Link>

          <Link href="/cart" style={iconBtnStyle(false)}>
            <span style={{ fontSize: '1.35rem', lineHeight: 1, color: count > 0 ? '#1E40AF' : '#6B7280' }}>🛒</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 2 }}>
              {count > 0 ? `Cart (${count})` : 'Cart'}
            </span>
            {count > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 0, background: '#1E40AF', color: 'white', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>{count}</span>
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
                padding: '0.65rem 1rem', cursor: 'pointer',
                fontSize: '0.83rem', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
                whiteSpace: 'nowrap', transition: 'background 0.15s',
              }}
            >
              ☰ All Categories <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>▼</span>
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
                  🏪 All Products
                </Link>
                {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
                  <Link key={key} href={`/shop?cat=${key}`} onClick={() => setCatOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', textDecoration: 'none', color: '#374151', fontSize: '0.87rem', transition: 'background 0.1s, color 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLAnchorElement).style.color = '#1E40AF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.color = '#374151'; }}>
                    <span style={{ width: 22, textAlign: 'center' }}>{CAT_ICONS[key]}</span>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0', flexShrink: 0 }} />

          {/* Quick category links */}
          {NAV_CATS.map(key => (
            <Link key={key} href={`/shop?cat=${key}`}
              style={{ display: 'flex', alignItems: 'center', color: '#CBD5E1', textDecoration: 'none', fontSize: '0.82rem', padding: '0.65rem 0.85rem', whiteSpace: 'nowrap', transition: 'color 0.15s', fontFamily: 'IBM Plex Sans, sans-serif' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'white'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#CBD5E1'}>
              {CATEGORIES[key]}
            </Link>
          ))}

          {/* Bundles — highlighted */}
          <Link href="/shop?cat=bundles"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FCD34D', textDecoration: 'none', fontSize: '0.82rem', padding: '0.65rem 0.85rem', fontWeight: 700, marginLeft: 'auto', whiteSpace: 'nowrap', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            🏷️ Bundles & Deals
          </Link>
        </div>
      </div>
    </header>
  );
}
