
import { NextResponse } from 'next/server';

export async function GET() {
  const chartData = [
    { name: 'Metric 1', groupA: 4000, groupB: 2400, groupC: 1800 },
    { name: 'Metric 2', groupA: 3000, groupB: 1398, groupC: 2210 },
    { name: 'Metric 3', groupA: 2000, groupB: 9800, groupC: 2290 },
    { name: 'Metric 4', groupA: 2780, groupB: 3908, groupC: 2000 },
    { name: 'Metric 5', groupA: 1890, groupB: 4800, groupC: 2181 },
  ];

  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(chartData);
}
