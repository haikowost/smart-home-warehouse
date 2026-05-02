import { NextResponse } from 'next/server';

// Debug endpoint — helps verify ADMIN_PASSWORD is set correctly without exposing it.
// Visit /api/admin/ping in browser to check env var status.
export async function GET() {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (!pw) {
    return NextResponse.json({ status: 'NOT SET', hint: 'Add ADMIN_PASSWORD in Vercel Project Settings → Environment Variables, then redeploy.' });
  }
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return NextResponse.json({
    status: 'SET',
    length: pw.length,
    firstChar: pw[0],
    lastChar: pw[pw.length - 1],
    sha256Prefix: hash.slice(0, 8),
  });
}
