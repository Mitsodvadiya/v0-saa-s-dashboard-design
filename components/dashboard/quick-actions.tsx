"use client"

import { UserPlus, PlusSquare, FileUp, CalendarPlus, Search, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
    { label: "Add Patient", icon: UserPlus, color: "bg-blue-500/10 text-blue-600" },
    { label: "Create Study", icon: PlusSquare, color: "bg-purple-500/10 text-purple-600" },
    { label: "Upload Doc", icon: FileUp, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Schedule Visit", icon: CalendarPlus, color: "bg-orange-500/10 text-orange-600" },
    { label: "Search Patient", icon: Search, color: "bg-slate-500/10 text-slate-600" },
]

export function QuickActions() {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
                <Zap className="size-5 text-warning fill-warning" />
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="flex flex-col h-auto py-4 items-center gap-2 hover:bg-muted border-0 bg-secondary/30 shadow-none transition-all hover:scale-105"
                        >
                            <div className={`p-2 rounded-lg ${action.color}`}>
                                <action.icon className="size-5" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-tight">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
