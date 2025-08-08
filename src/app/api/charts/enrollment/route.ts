
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { month: "January", enrolled: 12 },
    { month: "February", enrolled: 25 },
    { month: "March", enrolled: 38 },
    { month: "April", enrolled: 51 },
    { month: "May", enrolled: 64 },
    { month: "June", enrolled: 77 },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
