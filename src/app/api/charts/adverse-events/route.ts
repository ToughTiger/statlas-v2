
import { fetchWithAuthServer } from '@/lib/server-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  
  const chartData = await fetchWithAuthServer('/adverse-events').then((response) => response.json());
  

  return NextResponse.json(chartData);
}

