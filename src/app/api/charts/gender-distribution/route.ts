
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { gender: "Male", subjects: 275, fill: "var(--color-male)" },
    { gender: "Female", subjects: 200, fill: "var(--color-female)" },
    { gender: "Other", subjects: 25, fill: "var(--color-other)" },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
