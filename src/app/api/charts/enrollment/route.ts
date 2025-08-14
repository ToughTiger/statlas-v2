
import { fetchWithAuthServer } from '@/lib/server-auth';
import { NextResponse } from 'next/server';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
export async function GET() {
  
  const chartData = await fetchWithAuthServer(`${API_BASE_URL}/enrollment_counts`).then((response) => response.json());
  

  return NextResponse.json(chartData);
}
