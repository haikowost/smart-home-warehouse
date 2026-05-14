import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const SHW_TO_STORE: Record<string, string> = {
  'Security Cameras':          'security',
  'Smart Lighting':            'lighting',
  'Smart Plugs & Switches':    'power-control',
  'Smart Sensors':             'environmental',
  'Hubs & Gateways':           'voice-assistants',
  'Robot Vacuums':             'bundles',
  'Mesh Wi-Fi Systems':        'networking',
  'Smart Speakers & Displays': 'voice-assistants',
  'Smart Home Kits':           'bundles',
  'Accessories & Parts':       'bundles',
  'Other':                     'power-control',
};

const FALLBACK: [string[], string][] = [
  [['plug', 'socket', 'outlet', 'power strip', 'breaker', 'switch module', 'relay', 'dimmer'], 'power-control'],
  [['bulb', 'led', 'strip', 'downlight', 'gu10', 'e27', 'lamp', 'spotlight'], 'lighting'],
  [['camera', 'doorbell', 'alarm', 'smoke', 'detector', 'security', 'motion'], 'security'],
  [['sensor', 'temperature', 'humidity', 'thermostat', 'presence', 'co2'], 'environmental'],
  [['door lock', 'fingerprint', 'rfid', 'access', 'gate', 'keypad'], 'access-control'],
  [['remote', 'ir blaster', 'controller'], 'remote-control'],
  [['water', 'leak', 'flood', 'irrigation', 'valve'], 'water-control'],
  [['alexa', 'echo', 'google home', 'nest', 'voice', 'speaker', 'hub', 'gateway'], 'voice-assistants'],
  [['deco', 'mesh', 'wi-fi', 'wifi', 'router', 'networking'], 'networking'],
  [['robot', 'vacuum', 'mop', 'sweep'], 'bundles'],
  [['kit', 'pack', 'bundle', 'combo', 'set'], 'bundles'],
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

function mapCategory(cat: string | null | undefined, name: string): string {
  if (cat && SHW_TO_STORE[cat]) return SHW_TO_STORE[cat];
  const text = `${name} ${cat ?? ''}`.toLowerCase();
  for (const [kws, slug] of FALLBACK) {
    if (kws.some(kw => text.includes(kw))) return slug;
  }
  return 'power-control';
}

function latestExport(): string | null {
  const exportDir = process.env.SCOUT_EXPORT_DIR
    ?? path.join(process.cwd(), '..', 'shw-product-scout', 'data', 'exports');

  if (!fs.existsSync(exportDir)) return null;

  const files = fs
    .readdirSync(exportDir)
    .filter(f => f.endsWith('.json') && f.startsWith('shw_store_export'))
    .sort()
    .reverse();

  return files.length ? path.join(exportDir, files[0]) : null;
}

export async function POST() {
  const file = latestExport();
  if (!file) {
    return NextResponse.json({ error: 'No Scout export file found. Run the Scout exporter first.' }, { status: 404 });
  }

  let products: unknown[];
  try {
    products = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return NextResponse.json({ error: `Failed to read export: ${e}` }, { status: 500 });
  }

  const now = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (products as any[]).map((p) => ({
    slug:          slugify(p.name ?? ''),
    sku:           p.sku ?? '',
    name:          p.name ?? '',
    short_desc:    (p.description ?? '').slice(0, 200) || null,
    description:   p.description || null,
    category:      mapCategory(p.category, p.name ?? ''),
    brand:         p.brand ?? 'Unknown',
    price:         Number(p.price_incl_vat ?? p.price ?? 0),
    compare_price: null as number | null,
    images:        Array.isArray(p.images) ? p.images.slice(0, 5) : [],
    tags:          [p.preferred_supplier, p.brand?.toLowerCase(), 'catalog'].filter(Boolean) as string[],
    in_stock:      p.stock_status === 'instock',
    featured:      false,
    updated_at:    now,
  }));

  const sb = createAdminClient();
  const { data, error } = await sb
    .from('products')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    pushed: data?.length ?? 0,
    file: path.basename(file),
    slugs: data?.map((r: { slug: string }) => r.slug),
  });
}
