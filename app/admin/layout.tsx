'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin',          icon: '📊', label: 'Dashboard'  },
  { href: '/admin/products', icon: '📦', label: 'Products'   },
  { href: '/admin/orders',   icon: '📋', label: 'Orders'     },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#0F172A', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#93C5FD' }}>SHW Admin</div>
          <div style={{ fontSize: '0.67rem', color: '#475569', marginTop: '0.15rem', fontFamily: 'IBM Plex Mono, monospace' }}>smarthomewarehouse.co.za</div>
        </div>

        {/* Back to store */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', color: '#64748B', textDecoration: 'none', fontSize: '0.79rem', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#64748B'}>
          ← Back to Store
        </Link>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV.map(({ href, icon, label }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.58rem 1.25rem', textDecoration: 'none', fontSize: '0.87rem',
                color: active ? 'white' : '#94A3B8',
                background: active ? 'rgba(30,64,175,0.35)' : 'transparent',
                borderLeft: `3px solid ${active ? '#3B82F6' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8'; }}
              >
                <span style={{ fontSize: '1rem' }}>{icon}</span> {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 6, padding: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#F1F5F9', minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
