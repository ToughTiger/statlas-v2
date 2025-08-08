
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching T-test results
  const data = {
    groupA: {
      mean: 65,
      stdDev: 5,
    },
    groupB: {
      mean: 72,
      stdDev: 6,
    },
    pValue: 0.045,
  };

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(data);
}
