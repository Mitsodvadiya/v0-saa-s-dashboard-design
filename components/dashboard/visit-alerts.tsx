"use client"

import { AlertCircle, Phone, Calendar, Mail, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const alerts = [
    {
        id: 1,
        patientName: "Robert Wilson",
        study: "MERIDIAN-2024",
        visitDate: "Mar 12, 2026",
        result: "Declined",
        reason: "Transportation issues",
    },
    {
        id: 2,
        patientName: "John Smith",
        study: "BEACON-2024",
        visitDate: "Mar 14, 2026",
        result: "No Response",
        reason: "N/A",
    },
]

export function VisitAlerts() {
    return (
        <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader className="pb-3 text-destructive">
                <div className="flex items-center gap-2">
                    <AlertCircle className="size-5" />
                    <CardTitle className="text-lg font-semibold">Visit Confirmation Alerts</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((alert) => (
                    <Alert key={alert.id} className="bg-background border-destructive/20">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <AlertTitle className="text-sm font-bold flex items-center justify-between">
                            <span>{alert.patientName} — {alert.study}</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive uppercase tracking-wider">
                                {alert.result}
                            </span>
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-xs space-y-2">
                            <div className="flex flex-col gap-1">
                                <p><span className="font-semibold text-muted-foreground">Visit Date:</span> {alert.visitDate}</p>
                                <p><span className="font-semibold text-muted-foreground">Reason:</span> {alert.reason}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Button variant="outline" size="sm" className="h-7 text-[10px] border-destructive/20 hover:bg-destructive/5">
                                    <Phone className="mr-1 size-3" /> Call Patient
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-[10px] border-destructive/20 hover:bg-destructive/5">
                                    <Calendar className="mr-1 size-3" /> Reschedule
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-[10px] border-destructive/20 hover:bg-destructive/5">
                                    <Mail className="mr-1 size-3" /> Email CRA
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                ))}
            </CardContent>
        </Card>
    )
}
