"use client"

import { useState } from "react"
import { Calendar, Eye, FileText, MoreHorizontal, Plus, Search, Upload } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const patients = [
  {
    id: "PT-1001",
    name: "John Smith",
    initials: "JS",
    age: 54,
    gender: "Male",
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
  const [searchQuery, setSearchQuery] = useState("")
  const [studyFilter, setStudyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStudy = studyFilter === "all" || patient.study === studyFilter
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStudy && matchesStatus
  })

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Patient
              </Button>
            </DialogTrigger>
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
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input id="firstName" placeholder="John" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input id="lastName" placeholder="Smith" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="age">Age</FieldLabel>
                    <Input id="age" type="number" placeholder="45" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="study">Assign to Study</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beacon">BEACON-2024</SelectItem>
                      <SelectItem value="aurora">AURORA-Phase2</SelectItem>
                      <SelectItem value="nova">NOVA-Trial</SelectItem>
                      <SelectItem value="meridian">MERIDIAN-2024</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" placeholder="patient@email.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Add Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {patient.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {patient.id} • {patient.age}y • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{patient.study}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{patient.enrolledDate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[patient.status as keyof typeof statusStyles]}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient.nextVisit ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{patient.nextVisit}</div>
                          {patient.visitStatus && (
                            <Badge
                              className={
                                visitStatusStyles[patient.visitStatus as keyof typeof visitStatusStyles]
                              }
                            >
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 size-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 size-4" />
                            Schedule Visit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 size-4" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 size-4" />
                            Upload Document
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Withdraw Patient
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
      </div>
    </>
  )
}
