"use client"

import { Bell, Clock, AlertTriangle, UserPlus, FileText, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
    {
        id: 1,
        icon: Bell,
        message: "Upcoming visit reminder: Sarah Johnson (09:00 AM)",
        timestamp: "10 mins ago",
        type: "info",
    },
    {
        id: 2,
        icon: AlertTriangle,
        message: "Missed visit alert: Robert Wilson (BEACON-2024)",
        timestamp: "1 hour ago",
        type: "warning",
    },
    {
        id: 3,
        icon: UserPlus,
        message: "New patient enrolled in NOVA-Trial: P-1182",
        timestamp: "2 hours ago",
        type: "success",
    },
    {
        id: 4,
        icon: FileText,
        message: "New document uploaded: Lab Report (P-1045)",
        timestamp: "3 hours ago",
        type: "info",
    },
    {
        id: 5,
        icon: CheckCircle2,
        message: "Study updated: MERIDIAN-2024 (Phase 3)",
        timestamp: "5 hours ago",
        type: "success",
    },
]

export function NotificationsPanel() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className={`mt-1 rounded-full p-1.5 ${n.type === "warning" ? "bg-warning/10 text-warning" :
                                n.type === "success" ? "bg-success/10 text-success" :
                                    "bg-primary/10 text-primary"
                            }`}>
                            <n.icon className="size-3.5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium leading-tight">{n.message}</p>
                            <div className="flex items-center text-[10px] text-muted-foreground">
                                <Clock className="mr-1 size-3" />
                                {n.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
