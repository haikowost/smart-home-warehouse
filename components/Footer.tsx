import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', borderTop: '1px solid rgba(155,89,182,0.3)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: '0.5rem' }}>Smart Home Warehouse</div>
          <p style={{ fontSize: '0.82rem', color: '#9CA3AF', lineHeight: 1.6 }}>South Africa&apos;s curated smart home store. Products that work together.</p>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.75rem' }}>A division of Smart Vision (Pty) Ltd</p>
        </div>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: '#9B59B6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Shop</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[['Power Control', '/shop?cat=power-control'], ['Lighting', '/shop?cat=lighting'], ['Security', '/shop?cat=security'], ['Voice Assistants', '/shop?cat=voice-assistants'], ['Bundles', '/shop?cat=bundles']].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.83rem' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: '#9B59B6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Contact</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a href="mailto:smarthome@smart-vision.co.za" style={{ color: '#9B59B6', textDecoration: 'none', fontSize: '0.83rem' }}>smarthome@smart-vision.co.za</a>
            <span style={{ color: '#9CA3AF', fontSize: '0.83rem' }}>Pretoria, Gauteng</span>
            <Link href="http://smart-vision.co.za" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.83rem' }}>smart-vision.co.za</Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>© 2026 Smart Vision (Pty) Ltd — Smart Home Warehouse Division · smarthomewarehouse.co.za</p>
      </div>
    </footer>
  );
}
