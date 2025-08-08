
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  value: {
    label: "Value",
  },
  groupA: {
    label: "Group A",
    color: "hsl(var(--chart-1))",
  },
  groupB: {
    label: "Group B",
    color: "hsl(var(--chart-2))",
  },
    groupC: {
    label: "Group C",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function AnovaChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="groupA" fill="var(--color-groupA)" name="Group A" />
                <Bar dataKey="groupB" fill="var(--color-groupB)" name="Group B" />
                <Bar dataKey="groupC" fill="var(--color-groupC)" name="Group C" />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
