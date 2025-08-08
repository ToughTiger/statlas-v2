
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, LabelList } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  value: {
    label: "Mean Value",
  },
  groupA: {
    label: "Group A",
    color: "hsl(var(--chart-1))",
  },
  groupB: {
    label: "Group B",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function TTestChart({ data }: { data: any }) {
  if (!data) {
    return <Skeleton className="h-[350px] w-full" />;
  }
  
  const barData = [
    { name: 'Group A', value: data.groupA.mean, fill: 'var(--color-groupA)' },
    { name: 'Group B', value: data.groupB.mean, fill: 'var(--color-groupB)' },
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <div className="mb-4 text-center">
            <p className="text-lg font-semibold">T-Test Results</p>
            <p className="text-sm text-muted-foreground">P-Value: <span className="font-bold">{data.pValue.toFixed(4)}</span></p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical" margin={{left: 20}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80}/>
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="Mean Value" radius={4}>
                   <LabelList dataKey="value" position="right" offset={10} className="fill-foreground" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
