
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { site: "Site A", subjects: 86, fill: "var(--color-siteA)" },
    { site: "Site B", subjects: 120, fill: "var(--color-siteB)" },
    { site: "Site C", subjects: 75, fill: "var(--color-siteC)" },
    { site: "Site D", subjects: 92, fill: "var(--color-siteD)" },
    { site: "Site E", subjects: 110, fill: "var(--color-siteE)" },
  ];
  
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
