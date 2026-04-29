import crypto from 'crypto';

export interface PayFastParams {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  passphrase?: string;
}

export function buildPayFastForm(params: PayFastParams): { url: string; fields: Record<string, string> } {
  const sandbox = process.env.NODE_ENV !== 'production';
  const url = sandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  // Build ordered param string (PayFast requires specific order)
  const ordered: Record<string, string> = {
    merchant_id: params.merchant_id,
    merchant_key: params.merchant_key,
    return_url: params.return_url,
    cancel_url: params.cancel_url,
    notify_url: params.notify_url,
    name_first: params.name_first,
    name_last: params.name_last,
    email_address: params.email_address,
    m_payment_id: params.m_payment_id,
    amount: params.amount,
    item_name: params.item_name,
  };

  if (params.item_description) {
    ordered.item_description = params.item_description;
  }

  // Build signature string
  const sigString = Object.entries(ordered)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, '+')}`)
    .join('&');

  const withPassphrase = params.passphrase
    ? `${sigString}&passphrase=${encodeURIComponent(params.passphrase.trim()).replace(/%20/g, '+')}`
    : sigString;

  const signature = crypto.createHash('md5').update(withPassphrase).digest('hex');

  return { url, fields: { ...ordered, signature } };
}
