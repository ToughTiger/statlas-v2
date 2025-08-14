import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchWithAuthServer } from '@/lib/server-auth';

export async function GET() {
  const cookieStore =  await Promise.resolve(cookies());
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const res = await fetchWithAuthServer('/qualitative-data', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
