'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartProvider';

export default function Header() {
  const { count } = useCart();

  return (
    <header style={{ background: '#1A1A2E', borderBottom: '3px solid #1E40AF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/images/shwh-logo.png" alt="Smart Home Warehouse" style={{ height: 36, width: 'auto' }} />
          <div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white' }}>Smart Home Warehouse</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: '#93C5FD', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Curated · Compatible · Connected</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/shop" style={{ color: '#D1D5DB', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Shop</Link>
          <Link href="/shop?cat=bundles" style={{ color: '#D1D5DB', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Bundles</Link>
          <Link href="http://smart-vision.co.za" style={{ color: '#8BA4C8', textDecoration: 'none', fontSize: '0.8rem' }}>smart-vision.co.za</Link>
          <Link href="/cart" style={{ position: 'relative', background: '#1E40AF', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🛒 Cart
            {count > 0 && (
              <span style={{ background: 'white', color: '#1E40AF', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
