
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
  events: {
    label: "Adverse Events",
  },
  placebo: {
    label: "Placebo",
    color: "hsl(var(--chart-2))",
  },
  drugA: {
    label: "Drug A",
    color: "hsl(var(--chart-1))",
  },
  drugB: {
    label: "Drug B",
    color: "hsl(var(--chart-5))",
  }
} satisfies ChartConfig

export default function AdverseEventsChart({ data }: { data: any[] }) {
  if (!data) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart 
        accessibilityLayer 
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="arm"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 10)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="events" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
