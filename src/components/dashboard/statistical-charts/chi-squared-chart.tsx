
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  observed: {
    label: "Observed",
    color: "hsl(var(--chart-1))",
  },
  expected: {
    label: "Expected",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ChiSquaredChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="observed" fill="var(--color-observed)" name="Observed" />
                <Bar dataKey="expected" fill="var(--color-expected)" name="Expected" />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
