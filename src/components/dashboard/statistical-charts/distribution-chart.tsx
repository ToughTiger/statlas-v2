
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  frequency: {
    label: "Frequency",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DistributionChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height={350}>
           <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="value" name="Value" />
                <YAxis name="Frequency" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="frequency" fill="var(--color-frequency)" name="Frequency" />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
