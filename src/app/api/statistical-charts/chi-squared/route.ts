
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
      { category: 'Category 1', observed: 22, expected: 25 },
      { category: 'Category 2', observed: 28, expected: 25 },
      { category: 'Category 3', observed: 25, expected: 25 },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
