
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  subjects: {
    label: "Subjects Enrolled",
  },
  siteA: { label: "Site A", color: "hsl(var(--chart-1))" },
  siteB: { label: "Site B", color: "hsl(var(--chart-2))" },
  siteC: { label: "Site C", color: "hsl(var(--chart-3))" },
  siteD: { label: "Site D", color: "hsl(var(--chart-4))" },
  siteE: { label: "Site E", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export default function SitePerformanceChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[250px] w-full" />;
  }
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="site"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="subjects" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
