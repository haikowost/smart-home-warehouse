'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { products, CATEGORIES, Category } from '@/lib/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get('cat') as Category) || '';
  const [selectedCat, setSelectedCat] = useState<Category | ''>(initialCat);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCat) list = list.filter((p) => p.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
    }
    return list;
  }, [selectedCat, search]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#1F2937', marginBottom: '1.5rem' }}>
        {selectedCat ? CATEGORIES[selectedCat] : 'All Products'} <span style={{ fontSize: '1rem', color: '#6B7280', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 400 }}>({filtered.length} products)</span>
      </h1>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar filters */}
        <aside style={{ minWidth: 180, flexShrink: 0 }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem', color: '#9B59B6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Categories</div>
            <button onClick={() => setSelectedCat('')} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem', borderRadius: 6, background: selectedCat === '' ? '#F3E8FF' : 'transparent', color: selectedCat === '' ? '#7D3C98' : '#374151', fontWeight: selectedCat === '' ? 600 : 400, fontSize: '0.85rem', border: 'none', cursor: 'pointer', marginBottom: '0.25rem' }}>All Products</button>
            {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setSelectedCat(key)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem', borderRadius: 6, background: selectedCat === key ? '#F3E8FF' : 'transparent', color: selectedCat === key ? '#7D3C98' : '#374151', fontWeight: selectedCat === key ? 600 : 400, fontSize: '0.85rem', border: 'none', cursor: 'pointer', marginBottom: '0.25rem' }}>
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div style={{ flex: 1 }}>
          {/* Search */}
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '0.9rem', marginBottom: '1.25rem', outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif' }}
          />

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p>No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((product) => (
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
