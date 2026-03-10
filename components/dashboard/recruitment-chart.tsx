"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", total: 45, beacon: 20, aurora: 15, nova: 10 },
  { month: "Feb", total: 92, beacon: 40, aurora: 35, nova: 17 },
  { month: "Mar", total: 156, beacon: 70, aurora: 55, nova: 31 },
  { month: "Apr", total: 201, beacon: 90, aurora: 70, nova: 41 },
  { month: "May", total: 278, beacon: 120, aurora: 95, nova: 63 },
  { month: "Jun", total: 342, beacon: 150, aurora: 120, nova: 72 },
]

const chartConfig = {
  total: { label: "Total Recruitment", color: "var(--primary)" },
  beacon: { label: "BEACON", color: "var(--chart-3)" },
  aurora: { label: "AURORA", color: "var(--warning)" },
  nova: { label: "NOVA", color: "var(--success)" },
}

export function RecruitmentChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Patient Recruitment Trends</CardTitle>
        <CardDescription>Monthly recruitment across all active studies</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="beacon"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="aurora"
              stroke="var(--warning)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="nova"
              stroke="var(--success)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
