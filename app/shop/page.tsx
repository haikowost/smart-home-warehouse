'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, CATEGORIES, Category } from '@/lib/products';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-az';

const CAT_ICONS: Record<string, React.ReactElement> = {
  'power-control':    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  'lighting':         <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  'security':         <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'environmental':    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  'access-control':   <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  'remote-control':   <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="20" rx="4"/><circle cx="12" cy="8" r="1" fill="currentColor"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="16" x2="14" y2="16"/></svg>,
  'water-control':    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  'voice-assistants': <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  'networking':       <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>,
  'bundles':          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
};

function ShopContent() {
  const searchParams = useSearchParams();
  const initCat = (searchParams.get('cat') as Category) || '';
  const initQ = searchParams.get('q') || '';

  const [selectedCat, setSelectedCat] = useState<Category | ''>(initCat);
  const [search, setSearch] = useState(initQ);
  const [sort, setSort] = useState<SortKey>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCat) list = list.filter(p => p.category === selectedCat);
    if (inStockOnly) list = list.filter(p => p.inStock);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':  return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-az':    return a.name.localeCompare(b.name);
        default:           return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [selectedCat, search, sort, inStockOnly]);

  const catBtnStyle = (active: boolean) => ({
    display: 'flex' as const, alignItems: 'center' as const, gap: '0.5rem',
    width: '100%', textAlign: 'left' as const, padding: '0.45rem 0.6rem',
    borderRadius: 6, fontSize: '0.84rem', border: 'none', cursor: 'pointer',
    background: active ? '#EFF6FF' : 'transparent',
    color: active ? '#1E40AF' : '#374151',
    fontWeight: active ? 700 : 400,
    fontFamily: 'IBM Plex Sans, sans-serif',
    transition: 'background 0.1s, color 0.1s',
  });

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.5rem 1.5rem' }}>

      {/* Page title / breadcrumb */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#1F2937' }}>
          {selectedCat ? CATEGORIES[selectedCat] : 'All Products'}
          <span style={{ fontSize: '1rem', color: '#9CA3AF', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 400, marginLeft: '0.75rem' }}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </span>
        </h1>
        {search && (
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Search results for &ldquo;<strong style={{ color: '#1F2937' }}>{search}</strong>&rdquo;
            <button onClick={() => setSearch('')} style={{ marginLeft: '0.5rem', color: '#1E40AF', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>✕ Clear</button>
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: 210, flexShrink: 0 }}>
          {/* Search in sidebar */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.63rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Search</div>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ width: '100%', padding: '0.5rem 0.7rem', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '0.84rem', fontFamily: 'IBM Plex Sans, sans-serif', outline: 'none' }}
            />
          </div>

          {/* Categories */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.63rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Categories</div>
            <button onClick={() => setSelectedCat('')} style={catBtnStyle(selectedCat === '')}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              All Products
            </button>
            {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setSelectedCat(key)} style={catBtnStyle(selectedCat === key)}>
                <span style={{ display: 'flex', flexShrink: 0 }}>{CAT_ICONS[key]}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.63rem', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Filters</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.84rem', color: '#374151' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#1E40AF', width: 15, height: 15 }}
              />
              In stock only
            </label>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {selectedCat ? ` in ${CATEGORIES[selectedCat]}` : ''}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                style={{ padding: '0.3rem 0.6rem', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: '0.82rem', fontFamily: 'IBM Plex Sans, sans-serif', color: '#1F2937', outline: 'none', cursor: 'pointer' }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name-az">Name A → Z</option>
              </select>
            </div>
          </div>

          {/* Active filters chips */}
          {(selectedCat || inStockOnly || search) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {selectedCat && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', borderRadius: 100, fontSize: '0.75rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>
                  {CATEGORIES[selectedCat]}
                  <button onClick={() => setSelectedCat('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E40AF', padding: 0, fontSize: '0.8rem', lineHeight: 1 }}>✕</button>
                </span>
              )}
              {inStockOnly && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 100, fontSize: '0.75rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>
                  In Stock
                  <button onClick={() => setInStockOnly(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16A34A', padding: 0, fontSize: '0.8rem', lineHeight: 1 }}>✕</button>
                </span>
              )}
              {search && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 100, fontSize: '0.75rem', padding: '0.2rem 0.7rem' }}>
                  &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 0, fontSize: '0.8rem', lineHeight: 1 }}>✕</button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 10, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>No products found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.1rem' }}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>Loading products...</div>}>
      <ShopContent />
    </Suspense>
  );
}
