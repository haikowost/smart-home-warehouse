import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// PayFast ITN (Instant Transaction Notification) handler
export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const data = Object.fromEntries(params.entries());

  const { payment_status, m_payment_id } = data;

  if (!m_payment_id) {
    return new NextResponse('Missing payment ID', { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    if (payment_status === 'COMPLETE') {
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('reference', m_payment_id);
    } else if (payment_status === 'CANCELLED') {
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('reference', m_payment_id);
    }
  } catch (e) {
    console.error('PayFast ITN DB update failed:', e);
    // Still return 200 so PayFast doesn't retry indefinitely
  }

  return new NextResponse('OK', { status: 200 });
}
