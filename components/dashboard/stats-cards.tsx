"use client"

import { Activity, Calendar, TrendingUp, Users, AlertCircle, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Active Studies",
    value: "14",
    change: "+2 this month",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Total Patients",
    value: "2,847",
    change: "+124 enrolled",
    trend: "up",
    icon: Users,
  },
  {
    title: "Today's Visits",
    value: "24",
    change: "Scheduled for today",
    trend: "neutral",
    icon: Clock,
  },
  {
    title: "Upcoming Visits",
    value: "89",
    change: "Next 7 days",
    trend: "neutral",
    icon: Calendar,
  },
  {
    title: "Unconfirmed Visits",
    value: "12",
    change: "Needs attention",
    trend: "warning",
    icon: AlertCircle,
  },
  {
    title: "Missed Visits",
    value: "3",
    change: "Last 24 hours",
    trend: "destructive",
    icon: XCircle,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <stat.icon className={`size-4 ${stat.trend === "warning"
              ? "text-warning"
              : stat.trend === "destructive"
                ? "text-destructive"
                : stat.trend === "up"
                  ? "text-success"
                  : "text-muted-foreground"
              }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className={`text-[10px] mt-1 font-medium ${stat.trend === "warning"
              ? "text-warning"
              : stat.trend === "destructive"
                ? "text-destructive"
                : stat.trend === "up"
                  ? "text-success"
                  : "text-muted-foreground"
              }`}>
              {stat.trend === "up" && <TrendingUp className="inline size-3 mr-1" />}
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
