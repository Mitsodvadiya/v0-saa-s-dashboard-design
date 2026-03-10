"use client"

import { MoreHorizontal, User, CheckCircle, Clock, XCircle, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const visits = [
    {
        id: "P-1002",
        patientName: "Sarah Johnson",
        study: "BEACON-2024",
        visitType: "Month 6 Follow-up",
        time: "09:00 AM",
        status: "Confirmed",
    },
    {
        id: "P-1045",
        patientName: "Michael Chen",
        study: "AURORA-Phase2",
        visitType: "Screening",
        time: "10:30 AM",
        status: "Pending",
    },
    {
        id: "P-1089",
        patientName: "Emma Davis",
        study: "NOVA-Trial",
        visitType: "Baseline Visit",
        time: "01:15 PM",
        status: "Completed",
    },
    {
        id: "P-1123",
        patientName: "Robert Wilson",
        study: "MERIDIAN-2024",
        visitType: "Week 12 Assessment",
        time: "03:00 PM",
        status: "Missed",
    },
    {
        id: "P-1156",
        patientName: "Lisa Thompson",
        study: "BEACON-2024",
        visitType: "Unscheduled Visit",
        time: "04:30 PM",
        status: "Confirmed",
    },
]

export function TodaysVisitsTable() {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="text-lg font-semibold">Today's Visits</CardTitle>
                    <CardDescription>Scheduled visits for March 10, 2026</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Study</TableHead>
                            <TableHead>Visit Type</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visits.map((visit) => (
                            <TableRow key={visit.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{visit.patientName}</span>
                                        <span className="text-xs text-muted-foreground">{visit.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{visit.study}</TableCell>
                                <TableCell>{visit.visitType}</TableCell>
                                <TableCell>{visit.time}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            visit.status === "Confirmed"
                                                ? "bg-success/10 text-success border-0"
                                                : visit.status === "Pending"
                                                    ? "bg-warning/10 text-warning border-0"
                                                    : visit.status === "Completed"
                                                        ? "bg-primary/10 text-primary border-0"
                                                        : "bg-destructive/10 text-destructive border-0"
                                        }
                                    >
                                        {visit.status === "Confirmed" && <CheckCircle className="size-3 mr-1" />}
                                        {visit.status === "Pending" && <Clock className="size-3 mr-1" />}
                                        {visit.status === "Missed" && <XCircle className="size-3 mr-1" />}
                                        {visit.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="size-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <User className="mr-2 h-4 w-4" /> View Patient
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Confirm Visit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Calendar className="mr-2 h-4 w-4" /> Reschedule Visit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">
                                                Cancel Visit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
