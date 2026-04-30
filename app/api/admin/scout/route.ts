import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createAdminClient();

  // Products whose tags array contains a known scout source
  const { data, error } = await supabase
    .from('products')
    .select('id, name, brand, category, price, in_stock, images, tags, updated_at')
    .or('tags.cs.{geewiz},tags.cs.{esquire},tags.cs.{pinnacle}')
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
