import { NextRequest, NextResponse } from 'next/server';
import { buildPayFastForm } from '@/lib/payfast';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { form, paymentId, amount, itemName, items } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smarthomewarehouse.co.za';

  // Save pending order to Supabase before redirecting to PayFast
  try {
    const supabase = createAdminClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        reference: paymentId,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone || null,
        address: [form.address, form.suburb, form.city, form.province, form.postalCode].filter(Boolean).join(', '),
        total: parseFloat(amount),
        status: 'pending',
      })
      .select('id')
      .single();

    if (!orderError && order && Array.isArray(items) && items.length > 0) {
      await supabase.from('order_items').insert(
        items.map((item: { product_id: string; product_name: string; quantity: number; unit_price: number }) => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }
  } catch (e) {
    // Don't block checkout if DB write fails — log and continue
    console.error('Failed to save pending order:', e);
  }

  const params = buildPayFastForm({
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    passphrase: process.env.PAYFAST_PASSPHRASE,
    return_url: `${baseUrl}/order-complete?ref=${paymentId}`,
    cancel_url: `${baseUrl}/cart`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    name_first: form.firstName,
    name_last: form.lastName,
    email_address: form.email,
    m_payment_id: paymentId,
    amount,
    item_name: itemName,
    item_description: `Order from Smart Home Warehouse — ${itemName}`,
  });

  return NextResponse.json(params);
}
