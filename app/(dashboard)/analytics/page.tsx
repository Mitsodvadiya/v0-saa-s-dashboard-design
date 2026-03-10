"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const enrollmentData = [
  { month: "Jan", enrolled: 45, target: 50, screened: 68 },
  { month: "Feb", enrolled: 52, target: 50, screened: 75 },
  { month: "Mar", enrolled: 48, target: 50, screened: 62 },
  { month: "Apr", enrolled: 61, target: 50, screened: 89 },
  { month: "May", enrolled: 55, target: 50, screened: 78 },
  { month: "Jun", enrolled: 67, target: 50, screened: 94 },
]

const visitComplianceData = [
  { study: "BEACON", completed: 89, scheduled: 95 },
  { study: "AURORA", completed: 78, scheduled: 84 },
  { study: "NOVA", completed: 92, scheduled: 98 },
  { study: "MERIDIAN", completed: 45, scheduled: 52 },
]

const patientStatusData = [
  { name: "Active", value: 456, fill: "var(--success)" },
  { name: "Screening", value: 89, fill: "var(--primary)" },
  { name: "Completed", value: 234, fill: "var(--chart-3)" },
  { name: "Withdrawn", value: 23, fill: "var(--destructive)" },
]

const sitePerformanceData = [
  { site: "Site 001", enrollment: 45, compliance: 94 },
  { site: "Site 002", enrollment: 38, compliance: 91 },
  { site: "Site 003", enrollment: 52, compliance: 88 },
  { site: "Site 004", enrollment: 31, compliance: 96 },
  { site: "Site 005", enrollment: 28, compliance: 85 },
]

const aeData = [
  { month: "Jan", mild: 12, moderate: 5, severe: 1 },
  { month: "Feb", mild: 15, moderate: 7, severe: 2 },
  { month: "Mar", mild: 11, moderate: 4, severe: 0 },
  { month: "Apr", mild: 18, moderate: 8, severe: 1 },
  { month: "May", mild: 14, moderate: 6, severe: 1 },
  { month: "Jun", mild: 16, moderate: 5, severe: 0 },
]

const chartConfig = {
  enrolled: { label: "Enrolled", color: "var(--primary)" },
  target: { label: "Target", color: "var(--muted-foreground)" },
  screened: { label: "Screened", color: "var(--chart-3)" },
  completed: { label: "Completed", color: "var(--success)" },
  scheduled: { label: "Scheduled", color: "var(--primary)" },
  mild: { label: "Mild", color: "var(--chart-3)" },
  moderate: { label: "Moderate", color: "var(--warning)" },
  severe: { label: "Severe", color: "var(--destructive)" },
}

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader title="Analytics" description="Study performance metrics and insights" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>
              <Select defaultValue="all">
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Studies</SelectItem>
                  <SelectItem value="beacon">BEACON-2024</SelectItem>
                  <SelectItem value="aurora">AURORA-Phase2</SelectItem>
                  <SelectItem value="nova">NOVA-Trial</SelectItem>
                  <SelectItem value="meridian">MERIDIAN-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Enrollment</CardDescription>
                    <CardTitle className="text-2xl">2,847</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/10 text-success border-0">+12.5%</Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Visit Compliance</CardDescription>
                    <CardTitle className="text-2xl">94.2%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/10 text-success border-0">+2.1%</Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Screen Failure Rate</CardDescription>
                    <CardTitle className="text-2xl">18.4%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-destructive/10 text-destructive border-0">-3.2%</Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardDescription>Dropout Rate</CardDescription>
                    <CardTitle className="text-2xl">4.8%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/10 text-success border-0">-0.5%</Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Enrollment Trend</CardTitle>
                    <CardDescription>Monthly enrollment vs target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="enrolledGrad" x1="0" y1="0" x2="0" y2="1">
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
                          fill="url(#enrolledGrad)"
                          dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Patient Status Distribution</CardTitle>
                    <CardDescription>Current patient status across all studies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={patientStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {patientStatusData.map((entry, index) => (
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
                      {patientStatusData.map((item) => (
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
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Visit Compliance by Study</CardTitle>
                    <CardDescription>Completed vs scheduled visits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart data={visitComplianceData} layout="vertical" margin={{ left: -20, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                        <XAxis
                          type="number"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          className="text-[10px] fill-muted-foreground font-medium"
                        />
                        <YAxis
                          dataKey="study"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={80}
                          className="text-[10px] fill-muted-foreground font-medium"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="scheduled"
                          fill="var(--muted-foreground)"
                          radius={[0, 4, 4, 0]}
                          barSize={12}
                        />
                        <Bar
                          dataKey="completed"
                          fill="var(--success)"
                          radius={[0, 4, 4, 0]}
                          barSize={12}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Site Performance</CardTitle>
                    <CardDescription>Top performing sites by enrollment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sitePerformanceData.map((site) => (
                      <div key={site.site} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{site.site}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {site.enrollment} enrolled
                            </span>
                            <Badge
                              className={
                                site.compliance >= 90
                                  ? "bg-success/10 text-success border-0"
                                  : "bg-warning/10 text-warning border-0"
                              }
                            >
                              {site.compliance}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={site.compliance} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="enrollment" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Screening & Enrollment Funnel</CardTitle>
                  <CardDescription>Monthly screening to enrollment conversion</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <Bar dataKey="screened" fill="var(--chart-3)" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="enrolled" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Visit Compliance Trend</CardTitle>
                  <CardDescription>Historical compliance rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <LineChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        domain={[0, 100]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="enrolled"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        dot={{ fill: "var(--primary)", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Adverse Events by Severity</CardTitle>
                  <CardDescription>Monthly AE distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart data={aeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <Bar dataKey="mild" stackId="a" fill="var(--chart-3)" barSize={32} />
                      <Bar dataKey="moderate" stackId="a" fill="var(--warning)" barSize={32} />
                      <Bar dataKey="severe" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
