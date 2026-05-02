import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json() as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD env var is not set in Vercel. Go to Project Settings → Environment Variables, add ADMIN_PASSWORD, then deploy.' }, { status: 503 });
  }

  // Trim both sides to handle accidental whitespace in Vercel env vars
  if (password.trim() !== adminPassword.trim()) {
    return NextResponse.json({ error: 'Incorrect password. Tip: check ADMIN_PASSWORD in Vercel has no leading/trailing spaces.' }, { status: 401 });
  }

  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(adminPassword.trim()));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const res = NextResponse.json({ ok: true });
  res.cookies.set('shw-admin-session', hash, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
