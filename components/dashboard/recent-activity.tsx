"use client"

import { UserPlus, Calendar, FileText, Settings, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
    {
        id: 1,
        description: "New patient added to BEACON-2024",
        user: "Dr. Chen",
        timestamp: "15 mins ago",
        icon: UserPlus,
        color: "text-primary",
    },
    {
        id: 2,
        description: "Visit rescheduled for Sarah Johnson",
        user: "Nurse Sarah",
        timestamp: "45 mins ago",
        icon: Calendar,
        color: "text-warning",
    },
    {
        id: 3,
        description: "Document uploaded: Clinical Protocol v2.1",
        user: "Admin Alice",
        timestamp: "2 hours ago",
        icon: FileText,
        color: "text-success",
    },
    {
        id: 4,
        description: "Study updated: AURORA-Phase2",
        user: "Dr. Chen",
        timestamp: "4 hours ago",
        icon: Settings,
        color: "text-primary",
    },
]

export function RecentActivity() {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <History className="size-5 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex gap-4 pl-8">
                            <div className={`absolute left-0 top-1.5 z-10 rounded-full bg-background p-1.5 shadow-sm border ${activity.color}`}>
                                <activity.icon className="size-3" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-tight">{activity.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-semibold">{activity.user}</span>
                                    <span>•</span>
                                    <span>{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
