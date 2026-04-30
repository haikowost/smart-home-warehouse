'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function IconDashboard() {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconBox() {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function IconList() {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>;
}
function IconRadar() {
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>;
}
function IconLogout() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

const NAV = [
  { href: '/admin',          icon: <IconDashboard />, label: 'Dashboard'  },
  { href: '/admin/products', icon: <IconBox />,       label: 'Products'   },
  { href: '/admin/orders',   icon: <IconList />,      label: 'Orders'     },
  { href: '/admin/scout',    icon: <IconRadar />,     label: 'Scout'      },
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
      <aside style={{ width: 224, background: '#0F172A', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#93C5FD' }}>SHW Admin</div>
          <div style={{ fontSize: '0.67rem', color: '#475569', marginTop: '0.15rem', fontFamily: 'IBM Plex Mono, monospace' }}>smarthomewarehouse.co.za</div>
        </div>

        {/* Back to store */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', color: '#64748B', textDecoration: 'none', fontSize: '0.79rem', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#64748B'}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Store
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
                {icon} {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 6, padding: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <IconLogout /> Sign Out
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
