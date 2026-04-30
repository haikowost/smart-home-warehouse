import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { products } from '@/lib/products';

export async function POST() {
  const supabase = createAdminClient();

  const rows = products.map(p => ({
    slug:          p.slug,
    sku:           p.sku,
    name:          p.name,
    short_desc:    p.shortDesc,
    description:   p.description,
    category:      p.category,
    brand:         p.brand,
    price:         p.price,
    compare_price: p.comparePrice ?? null,
    images:        p.images,
    tags:          p.tags,
    in_stock:      p.inStock,
    featured:      p.featured ?? false,
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'slug' })
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ seeded: data?.length ?? 0 });
}
