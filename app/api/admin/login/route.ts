import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json() as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not set in environment variables. Add it in Vercel → Project Settings → Environment Variables, then redeploy.' }, { status: 503 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const res = NextResponse.json({ ok: true });
  res.cookies.set('shw-admin-session', hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
