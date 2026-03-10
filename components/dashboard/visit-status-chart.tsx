"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Completed", value: 456, fill: "var(--color-chart-2)" },
  { name: "Confirmed", value: 234, fill: "var(--color-chart-1)" },
  { name: "Pending", value: 89, fill: "var(--color-chart-3)" },
  { name: "Missed", value: 23, fill: "var(--color-chart-4)" },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--color-chart-2)",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--color-chart-1)",
  },
  pending: {
    label: "Pending",
    color: "var(--color-chart-3)",
  },
  missed: {
    label: "Missed",
    color: "var(--color-chart-4)",
  },
}

export function VisitStatusChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Visit Completion Rate</CardTitle>
        <CardDescription>Current month visit status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="ml-auto text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
