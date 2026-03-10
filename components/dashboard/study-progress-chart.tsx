"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

const data = [
    { study: "BEACON", enrolled: 456, target: 500, completion: 91 },
    { study: "AURORA", enrolled: 234, target: 300, completion: 78 },
    { study: "NOVA", enrolled: 189, target: 200, completion: 94 },
    { study: "MERIDIAN", enrolled: 112, target: 250, completion: 45 },
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

export function StudyProgressOverview() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Study Progress Overview</CardTitle>
                <CardDescription>Enrollment targets vs actuals across key studies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <BarChart data={data} layout="vertical" margin={{ left: -20, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            className="text-[10px] fill-muted-foreground font-medium"
                        />
                        <YAxis
                            dataKey="study"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            className="text-[10px] fill-muted-foreground font-bold"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="target"
                            fill="var(--secondary)"
                            radius={[0, 4, 4, 0]}
                            barSize={12}
                        />
                        <Bar
                            dataKey="enrolled"
                            fill="var(--primary)"
                            radius={[0, 4, 4, 0]}
                            barSize={12}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="space-y-4 pt-2 border-t text-sm font-medium">
                    {data.map((study) => (
                        <div key={study.study} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span>{study.study} Trial Status</span>
                                <span className="text-muted-foreground">{study.completion}% Complete</span>
                            </div>
                            <Progress value={study.completion} className="h-1.5" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
