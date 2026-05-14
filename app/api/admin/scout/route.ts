import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from('products')
    .select('id, name, brand, category, price, in_stock, images, tags, updated_at, sku')
    .or('tags.cs.{geewiz},tags.cs.{esquire},tags.cs.{pinnacle},tags.cs.{catalog}')
    .order('updated_at', { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// Bulk upsert from the Scout tool — accepts the JSON export format
export async function POST(request: NextRequest) {
  const sb = createAdminClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const products = Array.isArray(body) ? body : [body];
  if (products.length === 0) {
    return NextResponse.json({ error: 'Empty product array' }, { status: 400 });
  }

  // Normalise Scout JSON → store schema
  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
  }

  const SHW_TO_STORE: Record<string, string> = {
    'Security Cameras':       'security',
    'Smart Lighting':         'lighting',
    'Smart Plugs & Switches': 'power-control',
    'Smart Sensors':          'environmental',
    'Hubs & Gateways':        'voice-assistants',
    'Robot Vacuums':          'bundles',
    'Mesh Wi-Fi Systems':     'networking',
    'Smart Speakers & Displays': 'voice-assistants',
    'Smart Home Kits':        'bundles',
    'Accessories & Parts':    'bundles',
    'Other':                  'power-control',
  };

  const now = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = products.map((p: any) => ({
    slug:          p.slug ?? slugify(p.name ?? ''),
    sku:           p.sku ?? '',
    name:          p.name ?? '',
    short_desc:    (p.description ?? '').slice(0, 200) || null,
    description:   p.description || null,
    category:      SHW_TO_STORE[p.category] ?? p.category ?? 'power-control',
    brand:         p.brand ?? 'Unknown',
    price:         Number(p.price_incl_vat ?? p.price ?? 0),
    compare_price: null,
    images:        Array.isArray(p.images) ? p.images.slice(0, 5) : [],
    tags:          Array.isArray(p.tags) ? p.tags : ['catalog'],
    in_stock:      p.stock_status === 'instock' || p.in_stock === true,
    featured:      false,
    updated_at:    now,
  }));

  const { data, error } = await sb
    .table('products')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pushed: data?.length ?? 0, slugs: data?.map((r: { slug: string }) => r.slug) });
}
