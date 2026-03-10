"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", enrolled: 45, target: 50 },
  { month: "Feb", enrolled: 92, target: 100 },
  { month: "Mar", enrolled: 156, target: 150 },
  { month: "Apr", enrolled: 201, target: 200 },
  { month: "May", enrolled: 278, target: 250 },
  { month: "Jun", enrolled: 342, target: 300 },
  { month: "Jul", enrolled: 398, target: 350 },
  { month: "Aug", enrolled: 467, target: 400 },
  { month: "Sep", enrolled: 534, target: 450 },
  { month: "Oct", enrolled: 612, target: 500 },
  { month: "Nov", enrolled: 689, target: 550 },
  { month: "Dec", enrolled: 756, target: 600 },
]

const chartConfig = {
  enrolled: {
    label: "Enrolled",
    color: "var(--primary)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
}

export function RecruitmentChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Patient Recruitment</CardTitle>
        <CardDescription>Enrollment progress vs target for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="enrolledGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px] fill-muted-foreground uppercase font-medium"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px] fill-muted-foreground font-medium"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="target"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="enrolled"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#enrolledGradient)"
              dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
