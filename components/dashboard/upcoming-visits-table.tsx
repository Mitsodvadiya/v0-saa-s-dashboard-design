"use client"

import { MoreHorizontal, Mail, Phone, Check, X, Clock, Calendar, User } from "lucide-react"
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

const visits = [
  {
    id: "V-2026-101",
    patient: { name: "Robert Wilson", id: "P-1123" },
    study: "MERIDIAN-2024",
    visitName: "Week 12 Assessment",
    date: "Mar 12, 2026",
    status: "Pending",
  },
  {
    id: "V-2026-102",
    patient: { name: "Lisa Thompson", id: "P-1156" },
    study: "BEACON-2024",
    visitName: "Month 9 Check-up",
    date: "Mar 13, 2026",
    status: "Confirmed",
  },
  {
    id: "V-2026-103",
    patient: { name: "John Smith", id: "P-1001" },
    study: "BEACON-2024",
    visitName: "Visit 4 - Follow Up",
    date: "Mar 14, 2026",
    status: "Pending",
  },
  {
    id: "V-2026-104",
    patient: { name: "Emily Johnson", id: "P-1002" },
    study: "AURORA-Phase2",
    visitName: "Week 4 Review",
    date: "Mar 15, 2026",
    status: "Confirmed",
  },
]

export function UpcomingVisitsTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold">Upcoming Visits (Next 7 Days)</CardTitle>
          <CardDescription>Visits scheduled Mar 11 - Mar 17, 2026</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Study</TableHead>
              <TableHead>Visit Name</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow
                key={visit.id}
                className={visit.status === "Pending" ? "bg-warning/5" : ""}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{visit.patient.name}</span>
                    <span className="text-xs text-muted-foreground">{visit.patient.id}</span>
                  </div>
                </TableCell>
                <TableCell>{visit.study}</TableCell>
                <TableCell>{visit.visitName}</TableCell>
                <TableCell>{visit.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      visit.status === "Confirmed"
                        ? "bg-success/10 text-success border-0"
                        : "bg-warning/10 text-warning border-0"
                    }
                  >
                    {visit.status === "Pending" && <Clock className="size-3 mr-1" />}
                    {visit.status === "Confirmed" && <Check className="size-3 mr-1" />}
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
                        <User className="mr-2 size-4" /> View Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Check className="mr-2 size-4" /> Confirm Visit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 size-4" /> Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Phone className="mr-2 size-4" /> Call Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 size-4" /> Send Email
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
