
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { value: '0-10', frequency: 5 },
    { value: '10-20', frequency: 15 },
    { value: '20-30', frequency: 25 },
    { value: '30-40', frequency: 18 },
    { value: '40-50', frequency: 8 },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
