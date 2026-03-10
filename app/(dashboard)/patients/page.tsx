"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Eye, FileText, MoreHorizontal, Plus, Search, Upload, UserMinus, Edit2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"

interface Patient {
  id: string
  name: string
  initials: string
  age: number
  gender: string
  email: string
  phone: string
  study: string
  enrolledDate: string
  status: "active" | "screening" | "completed" | "withdrawn"
  nextVisit: string | null
  visitStatus: "confirmed" | "pending" | "rescheduled" | null
  compliance: number | null
}

const initialPatients: Patient[] = [
  {
    id: "PT-1001",
    name: "John Smith",
    initials: "JS",
    age: 54,
    gender: "Male",
    email: "john.smith@email.com",
    phone: "+1 (555) 111-2222",
    study: "BEACON-2024",
    enrolledDate: "Jan 20, 2024",
    status: "active",
    nextVisit: "Mar 15, 2024",
    visitStatus: "confirmed",
    compliance: 95,
  },
  {
    id: "PT-1002",
    name: "Emily Johnson",
    initials: "EJ",
    age: 42,
    gender: "Female",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 222-3333",
    study: "AURORA-Phase2",
    enrolledDate: "Feb 12, 2024",
    status: "active",
    nextVisit: "Mar 12, 2024",
    visitStatus: "pending",
    compliance: 88,
  },
  {
    id: "PT-1003",
    name: "Michael Chen",
    initials: "MC",
    age: 61,
    gender: "Male",
    email: "michael.chen@email.com",
    phone: "+1 (555) 333-4444",
    study: "BEACON-2024",
    enrolledDate: "Jan 18, 2024",
    status: "active",
    nextVisit: "Mar 18, 2024",
    visitStatus: "confirmed",
    compliance: 100,
  },
  {
    id: "PT-1004",
    name: "Sarah Williams",
    initials: "SW",
    age: 37,
    gender: "Female",
    email: "sarah.williams@email.com",
    phone: "+1 (555) 444-5555",
    study: "NOVA-Trial",
    enrolledDate: "Dec 5, 2023",
    status: "active",
    nextVisit: "Mar 13, 2024",
    visitStatus: "rescheduled",
    compliance: 92,
  },
  {
    id: "PT-1005",
    name: "David Brown",
    initials: "DB",
    age: 48,
    gender: "Male",
    email: "david.brown@email.com",
    phone: "+1 (555) 555-6666",
    study: "AURORA-Phase2",
    enrolledDate: "Feb 20, 2024",
    status: "screening",
    nextVisit: "Mar 14, 2024",
    visitStatus: "pending",
    compliance: null,
  },
  {
    id: "PT-1006",
    name: "Lisa Anderson",
    initials: "LA",
    age: 55,
    gender: "Female",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 666-7777",
    study: "MERIDIAN-2024",
    enrolledDate: "Mar 5, 2024",
    status: "screening",
    nextVisit: "Mar 20, 2024",
    visitStatus: "pending",
    compliance: null,
  },
  {
    id: "PT-1007",
    name: "Robert Martinez",
    initials: "RM",
    age: 67,
    gender: "Male",
    email: "robert.martinez@email.com",
    phone: "+1 (555) 777-8888",
    study: "NOVA-Trial",
    enrolledDate: "Nov 15, 2023",
    status: "completed",
    nextVisit: null,
    visitStatus: null,
    compliance: 98,
  },
  {
    id: "PT-1008",
    name: "Jennifer Taylor",
    initials: "JT",
    age: 44,
    gender: "Female",
    email: "jennifer.taylor@email.com",
    phone: "+1 (555) 888-9999",
    study: "BEACON-2024",
    enrolledDate: "Jan 25, 2024",
    status: "withdrawn",
    nextVisit: null,
    visitStatus: null,
    compliance: 75,
  },
]

const statusStyles = {
  active: "bg-success/10 text-success border-0",
  screening: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  withdrawn: "bg-destructive/10 text-destructive border-0",
}

const visitStatusStyles = {
  confirmed: "bg-success/10 text-success border-0",
  pending: "bg-warning/10 text-warning border-0",
  rescheduled: "bg-primary/10 text-primary border-0",
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [searchQuery, setSearchQuery] = useState("")
  const [studyFilter, setStudyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    study: "",
    email: "",
    phone: "",
  })
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    visitType: "",
  })

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStudy = studyFilter === "all" || patient.study === studyFilter
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStudy && matchesStatus
  })

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", age: "", gender: "", study: "", email: "", phone: "" })
  }

  const handleAdd = () => {
    if (!formData.firstName || !formData.lastName || !formData.study) {
      toast.error("Please fill in required fields")
      return
    }
    const initials = formData.firstName[0] + formData.lastName[0]
    const newPatient: Patient = {
      id: `PT-${1000 + patients.length + 1}`,
      name: `${formData.firstName} ${formData.lastName}`,
      initials: initials.toUpperCase(),
      age: parseInt(formData.age) || 0,
      gender: formData.gender || "Unknown",
      email: formData.email,
      phone: formData.phone,
      study: formData.study,
      enrolledDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "screening",
      nextVisit: null,
      visitStatus: null,
      compliance: null,
    }
    setPatients([...patients, newPatient])
    setIsAddOpen(false)
    resetForm()
    toast.success("Patient added successfully")
  }

  const handleEdit = () => {
    if (!selectedPatient) return
    setPatients(
      patients.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              name: `${formData.firstName} ${formData.lastName}`,
              initials: (formData.firstName[0] + formData.lastName[0]).toUpperCase(),
              age: parseInt(formData.age) || p.age,
              gender: formData.gender || p.gender,
              email: formData.email || p.email,
              phone: formData.phone || p.phone,
              study: formData.study || p.study,
            }
          : p
      )
    )
    setIsEditOpen(false)
    setSelectedPatient(null)
    resetForm()
    toast.success("Patient updated successfully")
  }

  const handleSchedule = () => {
    if (!selectedPatient || !scheduleData.date) {
      toast.error("Please select a date")
      return
    }
    const formattedDate = new Date(scheduleData.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    setPatients(
      patients.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, nextVisit: formattedDate, visitStatus: "pending" as const }
          : p
      )
    )
    setIsScheduleOpen(false)
    setSelectedPatient(null)
    setScheduleData({ date: "", time: "", visitType: "" })
    toast.success("Visit scheduled successfully")
  }

  const handleWithdraw = () => {
    if (!selectedPatient) return
    setPatients(
      patients.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, status: "withdrawn" as const, nextVisit: null, visitStatus: null }
          : p
      )
    )
    setIsWithdrawOpen(false)
    setSelectedPatient(null)
    toast.success("Patient withdrawn from study")
  }

  const openEdit = (patient: Patient) => {
    const [firstName, ...lastNameParts] = patient.name.split(" ")
    setSelectedPatient(patient)
    setFormData({
      firstName,
      lastName: lastNameParts.join(" "),
      age: String(patient.age),
      gender: patient.gender,
      study: patient.study,
      email: patient.email,
      phone: patient.phone,
    })
    setIsEditOpen(true)
  }

  const openSchedule = (patient: Patient) => {
    setSelectedPatient(patient)
    setScheduleData({ date: "", time: "", visitType: "" })
    setIsScheduleOpen(true)
  }

  const openWithdraw = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsWithdrawOpen(true)
  }

  return (
    <>
      <DashboardHeader title="Patients" description="Manage enrolled patients across studies" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-8"
              />
            </div>
            <Select value={studyFilter} onValueChange={setStudyFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Studies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Studies</SelectItem>
                <SelectItem value="BEACON-2024">BEACON-2024</SelectItem>
                <SelectItem value="AURORA-Phase2">AURORA-Phase2</SelectItem>
                <SelectItem value="NOVA-Trial">NOVA-Trial</SelectItem>
                <SelectItem value="MERIDIAN-2024">MERIDIAN-2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus className="mr-2 size-4" />
            Add Patient
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Study</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Visit</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/patients/${patient.id}`} className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {patient.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium hover:text-primary transition-colors">
                              {patient.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {patient.id} • {patient.age}y • {patient.gender}
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{patient.study}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{patient.enrolledDate}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[patient.status]}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {patient.nextVisit ? (
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{patient.nextVisit}</div>
                            {patient.visitStatus && (
                              <Badge className={visitStatusStyles[patient.visitStatus]}>
                                {patient.visitStatus.charAt(0).toUpperCase() +
                                  patient.visitStatus.slice(1)}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.compliance !== null ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-2 rounded-full ${
                                patient.compliance >= 90
                                  ? "bg-success"
                                  : patient.compliance >= 75
                                  ? "bg-warning"
                                  : "bg-destructive"
                              }`}
                            />
                            <span className="text-sm font-medium">{patient.compliance}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/patients/${patient.id}`}>
                                <Eye className="mr-2 size-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(patient)}>
                              <Edit2 className="mr-2 size-4" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openSchedule(patient)}>
                              <Calendar className="mr-2 size-4" />
                              Schedule Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/documents?patient=${patient.id}`}>
                                <FileText className="mr-2 size-4" />
                                View Documents
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {patient.status !== "withdrawn" && patient.status !== "completed" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openWithdraw(patient)}
                              >
                                <UserMinus className="mr-2 size-4" />
                                Withdraw Patient
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter patient information and assign to a study.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input
                  id="age"
                  type="number"
                  placeholder="45"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => setFormData({ ...formData, gender: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="study">Assign to Study *</FieldLabel>
              <Select
                value={formData.study}
                onValueChange={(v) => setFormData({ ...formData, study: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEACON-2024">BEACON-2024</SelectItem>
                  <SelectItem value="AURORA-Phase2">AURORA-Phase2</SelectItem>
                  <SelectItem value="NOVA-Trial">NOVA-Trial</SelectItem>
                  <SelectItem value="MERIDIAN-2024">MERIDIAN-2024</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="patient@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>Update patient information.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name *</FieldLabel>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Last Name *</FieldLabel>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Age</FieldLabel>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => setFormData({ ...formData, gender: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel>Assign to Study</FieldLabel>
              <Select
                value={formData.study}
                onValueChange={(v) => setFormData({ ...formData, study: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEACON-2024">BEACON-2024</SelectItem>
                  <SelectItem value="AURORA-Phase2">AURORA-Phase2</SelectItem>
                  <SelectItem value="NOVA-Trial">NOVA-Trial</SelectItem>
                  <SelectItem value="MERIDIAN-2024">MERIDIAN-2024</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Visit Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Visit</DialogTitle>
            <DialogDescription>
              Schedule a new visit for {selectedPatient?.name}.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Visit Type</FieldLabel>
              <Select
                value={scheduleData.visitType}
                onValueChange={(v) => setScheduleData({ ...scheduleData, visitType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="follow-up">Follow Up</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="end-of-study">End of Study</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Date *</FieldLabel>
              <Input
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>Time</FieldLabel>
              <Select
                value={scheduleData.time}
                onValueChange={(v) => setScheduleData({ ...scheduleData, time: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>Schedule Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation */}
      <AlertDialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw {selectedPatient?.name} from the study? This action
              will mark the patient as withdrawn and cancel all scheduled visits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
