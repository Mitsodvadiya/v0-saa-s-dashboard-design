"use client"

import { MoreHorizontal, Mail, Phone, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const visits = [
  {
    id: "V-2024-001",
    patient: {
      name: "John Smith",
      id: "PT-1001",
      initials: "JS",
    },
    study: "BEACON-2024",
    visit: "Visit 3 - Follow Up",
    date: "Mar 12, 2024",
    time: "09:00 AM",
    status: "confirmed",
  },
  {
    id: "V-2024-002",
    patient: {
      name: "Emily Johnson",
      id: "PT-1002",
      initials: "EJ",
    },
    study: "AURORA-Phase2",
    visit: "Screening",
    date: "Mar 12, 2024",
    time: "10:30 AM",
    status: "pending",
  },
  {
    id: "V-2024-003",
    patient: {
      name: "Michael Chen",
      id: "PT-1003",
      initials: "MC",
    },
    study: "BEACON-2024",
    visit: "Visit 5 - Treatment",
    date: "Mar 12, 2024",
    time: "02:00 PM",
    status: "confirmed",
  },
  {
    id: "V-2024-004",
    patient: {
      name: "Sarah Williams",
      id: "PT-1004",
      initials: "SW",
    },
    study: "NOVA-Trial",
    visit: "Visit 2 - Assessment",
    date: "Mar 13, 2024",
    time: "09:30 AM",
    status: "rescheduled",
  },
  {
    id: "V-2024-005",
    patient: {
      name: "David Brown",
      id: "PT-1005",
      initials: "DB",
    },
    study: "AURORA-Phase2",
    visit: "Visit 1 - Baseline",
    date: "Mar 13, 2024",
    time: "11:00 AM",
    status: "pending",
  },
]

const statusStyles = {
  confirmed: {
    label: "Confirmed",
    variant: "default" as const,
    className: "bg-success/10 text-success hover:bg-success/20 border-0",
  },
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-warning/10 text-warning hover:bg-warning/20 border-0",
  },
  rescheduled: {
    label: "Rescheduled",
    variant: "outline" as const,
    className: "bg-primary/10 text-primary hover:bg-primary/20 border-0",
  },
  missed: {
    label: "Missed",
    variant: "destructive" as const,
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-0",
  },
}

export function UpcomingVisitsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Upcoming Visits</CardTitle>
          <CardDescription>Scheduled visits for the next 7 days</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Study</TableHead>
              <TableHead>Visit</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {visit.patient.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{visit.patient.name}</div>
                      <div className="text-xs text-muted-foreground">{visit.patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{visit.study}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{visit.visit}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{visit.date}</div>
                  <div className="text-xs text-muted-foreground">{visit.time}</div>
                </TableCell>
                <TableCell>
                  <Badge className={statusStyles[visit.status as keyof typeof statusStyles].className}>
                    {statusStyles[visit.status as keyof typeof statusStyles].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Check className="mr-2 size-4" />
                        Confirm Visit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 size-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="mr-2 size-4" />
                        Call Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 size-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <X className="mr-2 size-4" />
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
