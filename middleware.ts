import { NextRequest, NextResponse } from 'next/server';

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = request.cookies.get('shw-admin-session')?.value;
  const adminPass = process.env.ADMIN_PASSWORD?.trim();

  if (!session || !adminPass) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const expected = await sha256hex(adminPass);
  if (session !== expected) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: '/admin/:path*' };
