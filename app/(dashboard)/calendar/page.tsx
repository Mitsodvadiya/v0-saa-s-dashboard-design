"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Sample visits data for March 2024
const visitsByDate: Record<string, Array<{
  id: string
  patient: { name: string; initials: string }
  study: string
  time: string
  type: string
  status: "confirmed" | "pending" | "rescheduled"
}>> = {
  "2024-03-12": [
    { id: "V-001", patient: { name: "John Smith", initials: "JS" }, study: "BEACON-2024", time: "09:00 AM", type: "Follow Up", status: "confirmed" },
    { id: "V-002", patient: { name: "Emily Johnson", initials: "EJ" }, study: "AURORA-Phase2", time: "10:30 AM", type: "Screening", status: "pending" },
    { id: "V-003", patient: { name: "Michael Chen", initials: "MC" }, study: "BEACON-2024", time: "02:00 PM", type: "Treatment", status: "confirmed" },
  ],
  "2024-03-13": [
    { id: "V-004", patient: { name: "Sarah Williams", initials: "SW" }, study: "NOVA-Trial", time: "09:30 AM", type: "Assessment", status: "rescheduled" },
    { id: "V-005", patient: { name: "David Brown", initials: "DB" }, study: "AURORA-Phase2", time: "11:00 AM", type: "Baseline", status: "pending" },
  ],
  "2024-03-14": [
    { id: "V-006", patient: { name: "Lisa Anderson", initials: "LA" }, study: "MERIDIAN-2024", time: "10:00 AM", type: "Screening", status: "pending" },
    { id: "V-007", patient: { name: "Robert Martinez", initials: "RM" }, study: "NOVA-Trial", time: "02:30 PM", type: "End of Study", status: "confirmed" },
  ],
  "2024-03-15": [
    { id: "V-008", patient: { name: "Jennifer Taylor", initials: "JT" }, study: "BEACON-2024", time: "09:00 AM", type: "Treatment", status: "confirmed" },
  ],
  "2024-03-18": [
    { id: "V-009", patient: { name: "James Wilson", initials: "JW" }, study: "AURORA-Phase2", time: "10:00 AM", type: "Follow Up", status: "pending" },
    { id: "V-010", patient: { name: "Maria Garcia", initials: "MG" }, study: "BEACON-2024", time: "01:30 PM", type: "Treatment", status: "confirmed" },
  ],
  "2024-03-20": [
    { id: "V-011", patient: { name: "Thomas Lee", initials: "TL" }, study: "NOVA-Trial", time: "09:00 AM", type: "Assessment", status: "confirmed" },
    { id: "V-012", patient: { name: "Nancy White", initials: "NW" }, study: "MERIDIAN-2024", time: "11:00 AM", type: "Baseline", status: "pending" },
    { id: "V-013", patient: { name: "Christopher Davis", initials: "CD" }, study: "BEACON-2024", time: "03:00 PM", type: "Follow Up", status: "confirmed" },
  ],
  "2024-03-22": [
    { id: "V-014", patient: { name: "Patricia Brown", initials: "PB" }, study: "AURORA-Phase2", time: "10:30 AM", type: "Treatment", status: "confirmed" },
  ],
  "2024-03-25": [
    { id: "V-015", patient: { name: "Daniel Miller", initials: "DM" }, study: "NOVA-Trial", time: "09:00 AM", type: "Screening", status: "pending" },
    { id: "V-016", patient: { name: "Sandra Johnson", initials: "SJ" }, study: "BEACON-2024", time: "02:00 PM", type: "End of Study", status: "confirmed" },
  ],
}

const statusColors = {
  confirmed: "bg-success",
  pending: "bg-warning",
  rescheduled: "bg-primary",
}

const statusStyles = {
  confirmed: "bg-success/10 text-success border-0",
  pending: "bg-warning/10 text-warning border-0",
  rescheduled: "bg-primary/10 text-primary border-0",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)) // March 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const formatDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const selectedVisits = selectedDate ? visitsByDate[selectedDate] || [] : []

  return (
    <>
      <DashboardHeader title="Calendar" description="View and manage visit schedules" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                {MONTHS[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="bg-muted px-2 py-3 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  const dateKey = day ? formatDateKey(day) : null
                  const dayVisits = dateKey ? visitsByDate[dateKey] || [] : []
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] bg-card p-2 transition-colors",
                        day && "cursor-pointer hover:bg-accent/50",
                        isToday(day!) && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (day && dayVisits.length > 0) {
                          setSelectedDate(dateKey)
                          setIsModalOpen(true)
                        }
                      }}
                    >
                      {day && (
                        <>
                          <div
                            className={cn(
                              "flex size-7 items-center justify-center rounded-full text-sm",
                              isToday(day) && "bg-primary text-primary-foreground font-semibold"
                            )}
                          >
                            {day}
                          </div>
                          {dayVisits.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {dayVisits.slice(0, 2).map((visit) => (
                                <div
                                  key={visit.id}
                                  className={cn(
                                    "flex items-center gap-1 rounded px-1.5 py-0.5 text-xs",
                                    visit.status === "confirmed" && "bg-success/10 text-success",
                                    visit.status === "pending" && "bg-warning/10 text-warning",
                                    visit.status === "rescheduled" && "bg-primary/10 text-primary"
                                  )}
                                >
                                  <span className={cn("size-1.5 rounded-full", statusColors[visit.status])} />
                                  <span className="truncate">{visit.patient.initials}</span>
                                </div>
                              ))}
                              {dayVisits.length > 2 && (
                                <div className="text-xs text-muted-foreground pl-1">
                                  +{dayVisits.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Today&apos;s Schedule</CardTitle>
                <CardDescription>March 12, 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(visitsByDate["2024-03-12"] || []).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {visit.patient.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{visit.patient.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {visit.time}
                      </div>
                    </div>
                    <Badge className={statusStyles[visit.status]}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-success" />
                  <span className="text-sm">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-warning" />
                  <span className="text-sm">Pending Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-primary" />
                  <span className="text-sm">Rescheduled</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full">
              <Plus className="mr-2 size-4" />
              Schedule New Visit
            </Button>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Visits on {selectedDate}</DialogTitle>
              <DialogDescription>
                {selectedVisits.length} visit{selectedVisits.length !== 1 ? "s" : ""} scheduled
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {selectedVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {visit.patient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{visit.patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {visit.study} • {visit.type}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {visit.time}
                    </div>
                  </div>
                  <Badge className={statusStyles[visit.status]}>
                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
