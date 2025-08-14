
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
   const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || 'JWT_TOKEN');
  const isAuthenticated = !!token;
  return NextResponse.json({ isAuthenticated });
}
