"use client"

import { useState } from "react"
import {
  Calendar,
  Check,
  Clock,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  X,
  Filter,
  CalendarDays,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const visits = [
  {
    id: "V-2024-001",
    patient: { name: "John Smith", id: "PT-1001", initials: "JS" },
    study: "BEACON-2024",
    visitType: "Visit 3 - Follow Up",
    date: "Mar 12, 2024",
    time: "09:00 AM",
    status: "confirmed",
    aiCallResult: "Confirmed attendance",
    procedures: ["Blood Draw", "ECG", "Physical Exam"],
  },
  {
    id: "V-2024-002",
    patient: { name: "Emily Johnson", id: "PT-1002", initials: "EJ" },
    study: "AURORA-Phase2",
    visitType: "Screening",
    date: "Mar 12, 2024",
    time: "10:30 AM",
    status: "pending",
    aiCallResult: null,
    procedures: ["Consent", "Medical History", "Lab Work"],
  },
  {
    id: "V-2024-003",
    patient: { name: "Michael Chen", id: "PT-1003", initials: "MC" },
    study: "BEACON-2024",
    visitType: "Visit 5 - Treatment",
    date: "Mar 12, 2024",
    time: "02:00 PM",
    status: "confirmed",
    aiCallResult: "Confirmed attendance",
    procedures: ["Drug Administration", "Vital Signs", "AE Assessment"],
  },
  {
    id: "V-2024-004",
    patient: { name: "Sarah Williams", id: "PT-1004", initials: "SW" },
    study: "NOVA-Trial",
    visitType: "Visit 2 - Assessment",
    date: "Mar 13, 2024",
    time: "09:30 AM",
    status: "rescheduled",
    aiCallResult: "Patient requested new date - work conflict",
    procedures: ["MRI Scan", "Blood Work", "Quality of Life Survey"],
  },
  {
    id: "V-2024-005",
    patient: { name: "David Brown", id: "PT-1005", initials: "DB" },
    study: "AURORA-Phase2",
    visitType: "Visit 1 - Baseline",
    date: "Mar 13, 2024",
    time: "11:00 AM",
    status: "pending",
    aiCallResult: null,
    procedures: ["Full Physical", "Baseline Labs", "ECG"],
  },
  {
    id: "V-2024-006",
    patient: { name: "Lisa Anderson", id: "PT-1006", initials: "LA" },
    study: "MERIDIAN-2024",
    visitType: "Screening",
    date: "Mar 14, 2024",
    time: "10:00 AM",
    status: "not_confirmed",
    aiCallResult: "No answer - 3 attempts",
    procedures: ["Consent", "Screening Labs"],
  },
  {
    id: "V-2024-007",
    patient: { name: "Robert Martinez", id: "PT-1007", initials: "RM" },
    study: "NOVA-Trial",
    visitType: "Visit 8 - End of Study",
    date: "Mar 14, 2024",
    time: "02:30 PM",
    status: "confirmed",
    aiCallResult: "Confirmed attendance",
    procedures: ["Final Assessment", "Labs", "Exit Interview"],
  },
  {
    id: "V-2024-008",
    patient: { name: "Jennifer Taylor", id: "PT-1008", initials: "JT" },
    study: "BEACON-2024",
    visitType: "Visit 4 - Treatment",
    date: "Mar 15, 2024",
    time: "09:00 AM",
    status: "missed",
    aiCallResult: "Patient did not attend - calling to reschedule",
    procedures: ["Drug Administration", "Safety Labs"],
  },
]

const statusStyles = {
  confirmed: { label: "Confirmed", className: "bg-success/10 text-success border-0" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-0" },
  rescheduled: { label: "Rescheduled", className: "bg-primary/10 text-primary border-0" },
  not_confirmed: { label: "Not Confirmed", className: "bg-destructive/10 text-destructive border-0" },
  missed: { label: "Missed", className: "bg-destructive/10 text-destructive border-0" },
}

export default function VisitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedVisit, setSelectedVisit] = useState<typeof visits[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.study.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = selectedTab === "all" || visit.status === selectedTab
    return matchesSearch && matchesTab
  })

  const stats = {
    total: visits.length,
    confirmed: visits.filter((v) => v.status === "confirmed").length,
    pending: visits.filter((v) => v.status === "pending").length,
    needsAttention: visits.filter((v) => ["not_confirmed", "missed"].includes(v.status)).length,
  }

  return (
    <>
      <DashboardHeader title="Visits" description="Manage patient visit schedules" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
                  <Check className="size-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock className="size-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
                  <X className="size-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.needsAttention}</p>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search visits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 size-4" />
              Date Range
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All Visits</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rescheduled">Rescheduled</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedTab} className="mt-4">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Study</TableHead>
                      <TableHead>Visit Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Call Result</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisits.map((visit) => (
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
                              <div className="text-xs text-muted-foreground">
                                {visit.patient.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{visit.study}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{visit.visitType}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{visit.date}</div>
                          <div className="text-xs text-muted-foreground">{visit.time}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusStyles[visit.status as keyof typeof statusStyles].className
                            }
                          >
                            {statusStyles[visit.status as keyof typeof statusStyles].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                            {visit.aiCallResult || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVisit(visit)
                                  setIsDetailOpen(true)
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Check className="mr-2 size-4" />
                                Confirm Visit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVisit(visit)
                                  setIsRescheduleOpen(true)
                                }}
                              >
                                <Clock className="mr-2 size-4" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 size-4" />
                                AI Voice Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 size-4" />
                                Generate Email
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
          </TabsContent>
        </Tabs>

        {/* Visit Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Visit Details</DialogTitle>
              <DialogDescription>
                {selectedVisit?.id} - {selectedVisit?.visitType}
              </DialogDescription>
            </DialogHeader>
            {selectedVisit && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedVisit.patient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedVisit.patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedVisit.patient.id} • {selectedVisit.study}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedVisit.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedVisit.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={
                        statusStyles[selectedVisit.status as keyof typeof statusStyles].className
                      }
                    >
                      {statusStyles[selectedVisit.status as keyof typeof statusStyles].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visit Type</p>
                    <p className="font-medium">{selectedVisit.visitType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Required Procedures</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVisit.procedures.map((proc) => (
                      <Badge key={proc} variant="outline">
                        {proc}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedVisit.aiCallResult && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium mb-1">AI Call Result</p>
                    <p className="text-sm text-muted-foreground">{selectedVisit.aiCallResult}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button>
                <Mail className="mr-2 size-4" />
                Send Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Visit</DialogTitle>
              <DialogDescription>
                Select a new date and time for this visit.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>New Date</FieldLabel>
                <Input type="date" />
              </Field>
              <Field>
                <FieldLabel>New Time</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Reason</FieldLabel>
                <Textarea placeholder="Reason for rescheduling..." rows={3} />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsRescheduleOpen(false)}>
                Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
