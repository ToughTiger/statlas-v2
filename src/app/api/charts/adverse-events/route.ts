
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { arm: "Placebo", events: 18, fill: "var(--color-placebo)" },
    { arm: "Drug A", events: 25, fill: "var(--color-drugA)" },
    { arm: "Drug B", events: 12, fill: "var(--color-drugB)" },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
