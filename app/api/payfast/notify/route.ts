import { NextRequest, NextResponse } from 'next/server';

// PayFast ITN (Instant Transaction Notification) handler
export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const data = Object.fromEntries(params.entries());

  // TODO: Validate PayFast signature and IP before processing
  // TODO: Save order to Supabase database
  // TODO: Send confirmation email to customer

  console.log('PayFast ITN received:', data);

  return new NextResponse('OK', { status: 200 });
}
