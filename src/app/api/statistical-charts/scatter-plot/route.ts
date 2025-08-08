
import { NextResponse } from 'next/server';

export async function GET() {
  // Generate some dummy data for scatter plot
  const data = Array.from({ length: 50 }, () => ({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  }));

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(data);
}
