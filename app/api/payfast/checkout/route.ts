import { NextRequest, NextResponse } from 'next/server';
import { buildPayFastForm } from '@/lib/payfast';

export async function POST(req: NextRequest) {
  const { form, paymentId, amount, itemName } = await req.json();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smarthomewarehouse.co.za';

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
