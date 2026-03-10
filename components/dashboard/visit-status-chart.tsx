"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Completed", value: 456, fill: "var(--success)" },
  { name: "Confirmed", value: 234, fill: "var(--primary)" },
  { name: "Pending", value: 89, fill: "var(--warning)" },
  { name: "Missed", value: 23, fill: "var(--destructive)" },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--success)",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--primary)",
  },
  pending: {
    label: "Pending",
    color: "var(--warning)",
  },
  missed: {
    label: "Missed",
    color: "var(--destructive)",
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
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="size-2 rounded-full shadow-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
              <span className="ml-auto text-xs font-bold tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
