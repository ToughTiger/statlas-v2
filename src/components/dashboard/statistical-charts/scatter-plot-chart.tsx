
"use client"

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, ZAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  x: { label: "Variable X" },
  y: { label: "Variable Y" },
} satisfies ChartConfig

export default function ScatterPlotChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Variable X" />
                <YAxis type="number" dataKey="y" name="Variable Y" />
                <ZAxis type="number" range={[100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                <Legend />
                <Scatter name="Data Points" data={data} fill="hsl(var(--chart-1))" />
            </ScatterChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
