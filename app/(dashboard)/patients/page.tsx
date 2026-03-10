"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  UserMinus,
  Edit2,
  Phone,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
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
  sponsor: string
  enrolledDate: string
  dateOfBirth: string
  status: "active" | "screening" | "completed" | "withdrawn"
  nextVisit: string | null
  visitStatus: "confirmed" | "pending" | "rescheduled" | null
  compliance: number | null
  bloodGroup: string
  height: string
  weight: string
  medicalHistory: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  emergencyContactName: string
  emergencyRelationship: string
  emergencyPhone: string
  screeningNumber: string
  randomizationNumber: string
  consentSigned: "yes" | "no"
  consentDate: string
}

const initialPatients: Patient[] = [
  {
    id: "PT-1001",
    name: "John Smith",
    initials: "JS",
    age: 54,
    dateOfBirth: "1970-03-15",
    gender: "Male",
    email: "john.smith@email.com",
    phone: "+1 (555) 111-2222",
    study: "BEACON-2024",
    sponsor: "Pfizer Inc.",
    enrolledDate: "Jan 20, 2024",
    status: "active",
    nextVisit: "Mar 15, 2024",
    visitStatus: "confirmed",
    compliance: 95,
    bloodGroup: "O+",
    height: "178 cm",
    weight: "82 kg",
    medicalHistory: "Hypertension, Hyperlipidemia",
    address: "123 Oak Street",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalCode: "02108",
    emergencyContactName: "Mary Smith",
    emergencyRelationship: "Wife",
    emergencyPhone: "+1 (555) 987-6543",
    screeningNumber: "SCR-001",
    randomizationNumber: "RND-001",
    consentSigned: "yes",
    consentDate: "2024-01-18",
  },
  {
    id: "PT-1002",
    name: "Emily Johnson",
    initials: "EJ",
    age: 42,
    dateOfBirth: "1982-07-22",
    gender: "Female",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 222-3333",
    study: "AURORA-Phase2",
    sponsor: "Novartis AG",
    enrolledDate: "Feb 12, 2024",
    status: "active",
    nextVisit: "Mar 12, 2024",
    visitStatus: "pending",
    compliance: 88,
    bloodGroup: "A+",
    height: "165 cm",
    weight: "62 kg",
    medicalHistory: "Osteoporosis, Vitamin D Deficiency",
    address: "456 Maple Ave",
    city: "Cambridge",
    state: "MA",
    country: "USA",
    postalCode: "02139",
    emergencyContactName: "Tom Johnson",
    emergencyRelationship: "Husband",
    emergencyPhone: "+1 (555) 876-5432",
    screeningNumber: "SCR-002",
    randomizationNumber: "RND-002",
    consentSigned: "yes",
    consentDate: "2024-02-10",
  },
  {
    id: "PT-1003",
    name: "Michael Chen",
    initials: "MC",
    age: 61,
    dateOfBirth: "1963-11-08",
    gender: "Male",
    email: "michael.chen@email.com",
    phone: "+1 (555) 333-4444",
    study: "BEACON-2024",
    sponsor: "Pfizer Inc.",
    enrolledDate: "Jan 18, 2024",
    status: "active",
    nextVisit: "Mar 18, 2024",
    visitStatus: "confirmed",
    compliance: 100,
    bloodGroup: "B+",
    height: "172 cm",
    weight: "78 kg",
    medicalHistory: "None significant",
    address: "789 Pine Road",
    city: "Somerville",
    state: "MA",
    country: "USA",
    postalCode: "02143",
    emergencyContactName: "Li Chen",
    emergencyRelationship: "Spouse",
    emergencyPhone: "+1 (555) 444-1111",
    screeningNumber: "SCR-003",
    randomizationNumber: "RND-003",
    consentSigned: "yes",
    consentDate: "2024-01-16",
  },
  {
    id: "PT-1004",
    name: "Sarah Williams",
    initials: "SW",
    age: 37,
    dateOfBirth: "1987-04-30",
    gender: "Female",
    email: "sarah.williams@email.com",
    phone: "+1 (555) 444-5555",
    study: "NOVA-Trial",
    sponsor: "Johnson & Johnson",
    enrolledDate: "Dec 5, 2023",
    status: "active",
    nextVisit: "Mar 13, 2024",
    visitStatus: "rescheduled",
    compliance: 92,
    bloodGroup: "AB-",
    height: "162 cm",
    weight: "58 kg",
    medicalHistory: "Asthma (mild, controlled)",
    address: "321 Elm Street",
    city: "Newton",
    state: "MA",
    country: "USA",
    postalCode: "02458",
    emergencyContactName: "James Williams",
    emergencyRelationship: "Brother",
    emergencyPhone: "+1 (555) 555-2222",
    screeningNumber: "SCR-004",
    randomizationNumber: "RND-004",
    consentSigned: "yes",
    consentDate: "2023-12-03",
  },
  {
    id: "PT-1005",
    name: "David Brown",
    initials: "DB",
    age: 48,
    dateOfBirth: "1976-09-14",
    gender: "Male",
    email: "david.brown@email.com",
    phone: "+1 (555) 555-6666",
    study: "AURORA-Phase2",
    sponsor: "Novartis AG",
    enrolledDate: "Feb 20, 2024",
    status: "screening",
    nextVisit: "Mar 14, 2024",
    visitStatus: "pending",
    compliance: null,
    bloodGroup: "O-",
    height: "180 cm",
    weight: "90 kg",
    medicalHistory: "Type 2 Diabetes",
    address: "654 Birch Lane",
    city: "Brookline",
    state: "MA",
    country: "USA",
    postalCode: "02445",
    emergencyContactName: "Karen Brown",
    emergencyRelationship: "Wife",
    emergencyPhone: "+1 (555) 666-3333",
    screeningNumber: "SCR-005",
    randomizationNumber: "",
    consentSigned: "yes",
    consentDate: "2024-02-18",
  },
  {
    id: "PT-1006",
    name: "Lisa Anderson",
    initials: "LA",
    age: 55,
    dateOfBirth: "1969-06-21",
    gender: "Female",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 666-7777",
    study: "MERIDIAN-2024",
    sponsor: "Roche Holding AG",
    enrolledDate: "Mar 5, 2024",
    status: "screening",
    nextVisit: "Mar 20, 2024",
    visitStatus: "pending",
    compliance: null,
    bloodGroup: "A-",
    height: "167 cm",
    weight: "70 kg",
    medicalHistory: "Hypertension",
    address: "987 Cedar Ave",
    city: "Waltham",
    state: "MA",
    country: "USA",
    postalCode: "02451",
    emergencyContactName: "Paul Anderson",
    emergencyRelationship: "Husband",
    emergencyPhone: "+1 (555) 777-4444",
    screeningNumber: "SCR-006",
    randomizationNumber: "",
    consentSigned: "yes",
    consentDate: "2024-03-03",
  },
  {
    id: "PT-1007",
    name: "Robert Martinez",
    initials: "RM",
    age: 67,
    dateOfBirth: "1957-02-08",
    gender: "Male",
    email: "robert.martinez@email.com",
    phone: "+1 (555) 777-8888",
    study: "NOVA-Trial",
    sponsor: "Johnson & Johnson",
    enrolledDate: "Nov 15, 2023",
    status: "completed",
    nextVisit: null,
    visitStatus: null,
    compliance: 98,
    bloodGroup: "B-",
    height: "175 cm",
    weight: "85 kg",
    medicalHistory: "Coronary Artery Disease, HTN",
    address: "111 Walnut Street",
    city: "Quincy",
    state: "MA",
    country: "USA",
    postalCode: "02169",
    emergencyContactName: "Anna Martinez",
    emergencyRelationship: "Daughter",
    emergencyPhone: "+1 (555) 888-5555",
    screeningNumber: "SCR-007",
    randomizationNumber: "RND-007",
    consentSigned: "yes",
    consentDate: "2023-11-13",
  },
  {
    id: "PT-1008",
    name: "Jennifer Taylor",
    initials: "JT",
    age: 44,
    dateOfBirth: "1980-12-03",
    gender: "Female",
    email: "jennifer.taylor@email.com",
    phone: "+1 (555) 888-9999",
    study: "BEACON-2024",
    sponsor: "Pfizer Inc.",
    enrolledDate: "Jan 25, 2024",
    status: "withdrawn",
    nextVisit: null,
    visitStatus: null,
    compliance: 75,
    bloodGroup: "O+",
    height: "160 cm",
    weight: "65 kg",
    medicalHistory: "None",
    address: "222 Oak Circle",
    city: "Medford",
    state: "MA",
    country: "USA",
    postalCode: "02155",
    emergencyContactName: "Mark Taylor",
    emergencyRelationship: "Husband",
    emergencyPhone: "+1 (555) 999-6666",
    screeningNumber: "SCR-008",
    randomizationNumber: "RND-008",
    consentSigned: "yes",
    consentDate: "2024-01-23",
  },
]

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-0",
  screening: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  withdrawn: "bg-destructive/10 text-destructive border-0",
}

const visitStatusStyles: Record<string, string> = {
  confirmed: "bg-success/10 text-success border-0",
  pending: "bg-warning/10 text-warning border-0",
  rescheduled: "bg-primary/10 text-primary border-0",
}

const STUDIES = ["BEACON-2024", "AURORA-Phase2", "NOVA-Trial", "MERIDIAN-2024", "HORIZON-2023"]
const SPONSORS: Record<string, string> = {
  "BEACON-2024": "Pfizer Inc.",
  "AURORA-Phase2": "Novartis AG",
  "NOVA-Trial": "Johnson & Johnson",
  "MERIDIAN-2024": "Roche Holding AG",
  "HORIZON-2023": "Merck & Co.",
}
const PAGE_SIZE = 6

const emptyForm = {
  firstName: "", lastName: "", dateOfBirth: "", gender: "",
  phone: "", email: "", address: "", city: "", state: "", country: "USA", postalCode: "",
  study: "", enrolledDate: "", screeningNumber: "", randomizationNumber: "",
  bloodGroup: "", height: "", weight: "", medicalHistory: "",
  emergencyContactName: "", emergencyRelationship: "", emergencyPhone: "",
  consentSigned: "yes" as "yes" | "no", consentDate: "",
  patientStatus: "screening" as Patient["status"],
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [searchQuery, setSearchQuery] = useState("")
  const [studyFilter, setStudyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", visitType: "" })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Calculated age from dob
  const calcAge = (dob: string) => {
    if (!dob) return 0
    const birth = new Date(dob)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--
    return age
  }

  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStudy = studyFilter === "all" || p.study === studyFilter
      const matchesStatus = statusFilter === "all" || p.status === statusFilter
      return matchesSearch && matchesStudy && matchesStatus
    })
    .sort((a, b) => {
      const da = new Date(a.enrolledDate).getTime()
      const db = new Date(b.enrolledDate).getTime()
      return sortOrder === "desc" ? db - da : da - db
    })

  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE)
  const paginatedPatients = filteredPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = "Required"
    if (!formData.lastName.trim()) errors.lastName = "Required"
    if (!formData.study) errors.study = "Required"
    if (!formData.phone.trim()) errors.phone = "Required"
    if (!formData.enrolledDate) errors.enrolledDate = "Required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    if (!validate()) { toast.error("Please fill in required fields"); return }
    const initials = (formData.firstName[0] + formData.lastName[0]).toUpperCase()
    const age = calcAge(formData.dateOfBirth)
    const newPatient: Patient = {
      id: `PT-${1000 + patients.length + 1}`,
      name: `${formData.firstName} ${formData.lastName}`,
      initials,
      age,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender || "Unknown",
      email: formData.email,
      phone: formData.phone,
      study: formData.study,
      sponsor: SPONSORS[formData.study] || "",
      enrolledDate: formData.enrolledDate ? new Date(formData.enrolledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "screening",
      nextVisit: null, visitStatus: null, compliance: null,
      bloodGroup: formData.bloodGroup,
      height: formData.height,
      weight: formData.weight,
      medicalHistory: formData.medicalHistory,
      address: formData.address, city: formData.city, state: formData.state,
      country: formData.country, postalCode: formData.postalCode,
      emergencyContactName: formData.emergencyContactName,
      emergencyRelationship: formData.emergencyRelationship,
      emergencyPhone: formData.emergencyPhone,
      screeningNumber: formData.screeningNumber,
      randomizationNumber: formData.randomizationNumber,
      consentSigned: formData.consentSigned,
      consentDate: formData.consentDate,
    }
    setPatients([...patients, newPatient])
    setIsAddOpen(false)
    setFormData(emptyForm)
    setFormErrors({})
    toast.success("Patient registered successfully")
  }

  const handleEdit = () => {
    if (!selectedPatient || !validate()) { toast.error("Please fill in required fields"); return }
    const age = calcAge(formData.dateOfBirth)
    setPatients(patients.map((p) => p.id === selectedPatient.id ? {
      ...p,
      name: `${formData.firstName} ${formData.lastName}`,
      initials: (formData.firstName[0] + formData.lastName[0]).toUpperCase(),
      age, dateOfBirth: formData.dateOfBirth, gender: formData.gender || p.gender,
      email: formData.email, phone: formData.phone, study: formData.study,
      sponsor: SPONSORS[formData.study] || p.sponsor,
      status: formData.patientStatus,
      bloodGroup: formData.bloodGroup, height: formData.height, weight: formData.weight,
      medicalHistory: formData.medicalHistory, address: formData.address,
      city: formData.city, state: formData.state, country: formData.country,
      postalCode: formData.postalCode, emergencyContactName: formData.emergencyContactName,
      emergencyRelationship: formData.emergencyRelationship, emergencyPhone: formData.emergencyPhone,
      screeningNumber: formData.screeningNumber, randomizationNumber: formData.randomizationNumber,
      consentSigned: formData.consentSigned, consentDate: formData.consentDate,
    } : p))
    setIsEditOpen(false); setSelectedPatient(null); setFormData(emptyForm); setFormErrors({})
    toast.success("Patient updated successfully")
  }

  const handleSchedule = () => {
    if (!selectedPatient || !scheduleData.date) { toast.error("Please select a date"); return }
    const formattedDate = new Date(scheduleData.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    setPatients(patients.map((p) => p.id === selectedPatient.id ? { ...p, nextVisit: formattedDate, visitStatus: "pending" as const } : p))
    setIsScheduleOpen(false); setSelectedPatient(null)
    setScheduleData({ date: "", time: "", visitType: "" })
    toast.success("Visit scheduled successfully")
  }

  const handleWithdraw = () => {
    if (!selectedPatient) return
    setPatients(patients.map((p) => p.id === selectedPatient.id ? { ...p, status: "withdrawn" as const, nextVisit: null, visitStatus: null } : p))
    setIsWithdrawOpen(false); setSelectedPatient(null)
    toast.success("Patient withdrawn from study")
  }

  const openAdd = () => { setFormData(emptyForm); setFormErrors({}); setIsAddOpen(true) }

  const openEdit = (patient: Patient) => {
    const [firstName, ...rest] = patient.name.split(" ")
    setSelectedPatient(patient)
    setFormData({
      firstName, lastName: rest.join(" "),
      dateOfBirth: patient.dateOfBirth, gender: patient.gender,
      phone: patient.phone, email: patient.email,
      address: patient.address, city: patient.city, state: patient.state,
      country: patient.country, postalCode: patient.postalCode,
      study: patient.study, enrolledDate: "", screeningNumber: patient.screeningNumber,
      randomizationNumber: patient.randomizationNumber,
      bloodGroup: patient.bloodGroup, height: patient.height, weight: patient.weight,
      medicalHistory: patient.medicalHistory,
      emergencyContactName: patient.emergencyContactName,
      emergencyRelationship: patient.emergencyRelationship,
      emergencyPhone: patient.emergencyPhone,
      consentSigned: patient.consentSigned, consentDate: patient.consentDate,
      patientStatus: patient.status,
    })
    setFormErrors({})
    setIsEditOpen(true)
  }

  const f = (k: keyof typeof formData, v: string) => setFormData((prev) => ({ ...prev, [k]: v }))

  return (
    <>
      <DashboardHeader title="Patients" description="Manage enrolled patients across all clinical studies" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }} className="w-full sm:w-64 pl-8" />
            </div>
            <Select value={studyFilter} onValueChange={(v) => { setStudyFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Studies" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Studies</SelectItem>
                {STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Enrolled: Newest</SelectItem>
                <SelectItem value="asc">Enrolled: Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAdd}><Plus className="mr-2 size-4" />Add Patient</Button>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Study / Sponsor</TableHead>
                  <TableHead>Gender / Age</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Visit</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">No patients found</TableCell>
                  </TableRow>
                ) : paginatedPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/patients/${patient.id}`} className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{patient.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium hover:text-primary transition-colors">{patient.name}</div>
                          <div className="text-[10px] text-muted-foreground">{patient.id}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{patient.study}</div>
                      <div className="text-[10px] text-muted-foreground">{patient.sponsor}</div>
                    </TableCell>
                    <TableCell className="text-sm">{patient.gender} • {patient.age}y</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{patient.phone}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{patient.enrolledDate}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[patient.status]}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient.nextVisit ? (
                        <div>
                          <div className="text-sm">{patient.nextVisit}</div>
                          {patient.visitStatus && (
                            <Badge className={visitStatusStyles[patient.visitStatus] + " text-[10px] mt-0.5"}>
                              {patient.visitStatus.charAt(0).toUpperCase() + patient.visitStatus.slice(1)}
                            </Badge>
                          )}
                        </div>
                      ) : <span className="text-sm text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {patient.compliance !== null ? (
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${patient.compliance >= 90 ? "bg-success" : patient.compliance >= 75 ? "bg-warning" : "bg-destructive"}`} />
                          <span className="text-sm font-medium">{patient.compliance}%</span>
                        </div>
                      ) : <span className="text-sm text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`}><Eye className="mr-2 size-4" />View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(patient)}><Edit2 className="mr-2 size-4" />Edit Patient</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedPatient(patient); setIsUploadOpen(true) }}><Upload className="mr-2 size-4" />Upload Document</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedPatient(patient); setScheduleData({ date: "", time: "", visitType: "" }); setIsScheduleOpen(true) }}><Calendar className="mr-2 size-4" />Schedule Visit</DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={`/patients/${patient.id}?tab=documents`}><FileText className="mr-2 size-4" />View Documents</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {patient.status !== "withdrawn" && patient.status !== "completed" && (
                            <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedPatient(patient); setIsWithdrawOpen(true) }}>
                              <UserMinus className="mr-2 size-4" />Withdraw Patient
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredPatients.length)} of {filteredPatients.length} patients
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <Button key={n} variant={n === page ? "default" : "outline"} size="icon" className="size-8" onClick={() => setPage(n)}>{n}</Button>
              ))}
              <Button variant="outline" size="icon" className="size-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Patient Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
            <DialogDescription>Enter complete patient information for trial enrollment.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-2 space-y-6">
            {/* Basic */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="add-fn">First Name *</FieldLabel>
                  <Input id="add-fn" placeholder="First name" value={formData.firstName} onChange={e => f("firstName", e.target.value)} className={formErrors.firstName ? "border-destructive" : ""} />
                  {formErrors.firstName && <p className="text-xs text-destructive mt-1">{formErrors.firstName}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="add-ln">Last Name *</FieldLabel>
                  <Input id="add-ln" placeholder="Last name" value={formData.lastName} onChange={e => f("lastName", e.target.value)} className={formErrors.lastName ? "border-destructive" : ""} />
                  {formErrors.lastName && <p className="text-xs text-destructive mt-1">{formErrors.lastName}</p>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="add-dob">Date of Birth</FieldLabel>
                  <Input id="add-dob" type="date" value={formData.dateOfBirth} onChange={e => f("dateOfBirth", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={formData.gender} onValueChange={v => f("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Phone *</FieldLabel>
                  <Input placeholder="+1 (555) 123-4567" value={formData.phone} onChange={e => f("phone", e.target.value)} className={formErrors.phone ? "border-destructive" : ""} />
                  {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" placeholder="patient@email.com" value={formData.email} onChange={e => f("email", e.target.value)} />
                </Field>
                <Field className="col-span-2">
                  <FieldLabel>Address Line 1</FieldLabel>
                  <Input placeholder="Street address" value={formData.address} onChange={e => f("address", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Input placeholder="City" value={formData.city} onChange={e => f("city", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>State</FieldLabel>
                  <Input placeholder="State" value={formData.state} onChange={e => f("state", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Input placeholder="Country" value={formData.country} onChange={e => f("country", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Postal Code</FieldLabel>
                  <Input placeholder="ZIP" value={formData.postalCode} onChange={e => f("postalCode", e.target.value)} />
                </Field>
              </div>
            </div>
            {/* Study Enrollment */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Study Enrollment</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field className="col-span-2">
                  <FieldLabel>Study *</FieldLabel>
                  <Select value={formData.study} onValueChange={v => f("study", v)}>
                    <SelectTrigger className={formErrors.study ? "border-destructive" : ""}><SelectValue placeholder="Select study" /></SelectTrigger>
                    <SelectContent>{STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  {formErrors.study && <p className="text-xs text-destructive mt-1">{formErrors.study}</p>}
                </Field>
                <Field>
                  <FieldLabel>Enrollment Date *</FieldLabel>
                  <Input type="date" value={formData.enrolledDate} onChange={e => f("enrolledDate", e.target.value)} className={formErrors.enrolledDate ? "border-destructive" : ""} />
                  {formErrors.enrolledDate && <p className="text-xs text-destructive mt-1">{formErrors.enrolledDate}</p>}
                </Field>
                <Field>
                  <FieldLabel>Screening Number</FieldLabel>
                  <Input placeholder="SCR-XXX" value={formData.screeningNumber} onChange={e => f("screeningNumber", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Randomization Number</FieldLabel>
                  <Input placeholder="RND-XXX" value={formData.randomizationNumber} onChange={e => f("randomizationNumber", e.target.value)} />
                </Field>
              </div>
            </div>
            {/* Medical */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Medical Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Blood Group</FieldLabel>
                  <Select value={formData.bloodGroup} onValueChange={v => f("bloodGroup", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Height (cm)</FieldLabel>
                  <Input placeholder="170" value={formData.height} onChange={e => f("height", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <Input placeholder="70" value={formData.weight} onChange={e => f("weight", e.target.value)} />
                </Field>
                <Field className="col-span-3">
                  <FieldLabel>Medical History</FieldLabel>
                  <Textarea placeholder="Relevant medical history, comorbidities..." rows={3} value={formData.medicalHistory} onChange={e => f("medicalHistory", e.target.value)} />
                </Field>
              </div>
            </div>
            {/* Emergency Contact */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Emergency Contact</h4>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input placeholder="Contact name" value={formData.emergencyContactName} onChange={e => f("emergencyContactName", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Relationship</FieldLabel>
                  <Input placeholder="e.g. Spouse" value={formData.emergencyRelationship} onChange={e => f("emergencyRelationship", e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input placeholder="+1 (555)..." value={formData.emergencyPhone} onChange={e => f("emergencyPhone", e.target.value)} />
                </Field>
              </div>
            </div>
            {/* Consent */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Informed Consent</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Consent Signed</FieldLabel>
                  <Select value={formData.consentSigned} onValueChange={v => f("consentSigned", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Consent Date</FieldLabel>
                  <Input type="date" value={formData.consentDate} onChange={e => f("consentDate", e.target.value)} />
                </Field>
              </div>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Patient Dialog ── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient — {selectedPatient?.name}</DialogTitle>
            <DialogDescription>Update patient information. All changes are saved immediately.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-2 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field><FieldLabel>First Name *</FieldLabel><Input value={formData.firstName} onChange={e => f("firstName", e.target.value)} className={formErrors.firstName ? "border-destructive" : ""} /></Field>
                <Field><FieldLabel>Last Name *</FieldLabel><Input value={formData.lastName} onChange={e => f("lastName", e.target.value)} className={formErrors.lastName ? "border-destructive" : ""} /></Field>
                <Field><FieldLabel>Date of Birth</FieldLabel><Input type="date" value={formData.dateOfBirth} onChange={e => f("dateOfBirth", e.target.value)} /></Field>
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={formData.gender} onValueChange={v => f("gender", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Patient Status</FieldLabel>
                  <Select value={formData.patientStatus} onValueChange={v => f("patientStatus", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Contact Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field><FieldLabel>Phone *</FieldLabel><Input value={formData.phone} onChange={e => f("phone", e.target.value)} className={formErrors.phone ? "border-destructive" : ""} /></Field>
                <Field><FieldLabel>Email</FieldLabel><Input type="email" value={formData.email} onChange={e => f("email", e.target.value)} /></Field>
                <Field className="col-span-2"><FieldLabel>Address</FieldLabel><Input value={formData.address} onChange={e => f("address", e.target.value)} /></Field>
                <Field><FieldLabel>City</FieldLabel><Input value={formData.city} onChange={e => f("city", e.target.value)} /></Field>
                <Field><FieldLabel>State</FieldLabel><Input value={formData.state} onChange={e => f("state", e.target.value)} /></Field>
                <Field><FieldLabel>Country</FieldLabel><Input value={formData.country} onChange={e => f("country", e.target.value)} /></Field>
                <Field><FieldLabel>Postal Code</FieldLabel><Input value={formData.postalCode} onChange={e => f("postalCode", e.target.value)} /></Field>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Study Enrollment</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field className="col-span-2">
                  <FieldLabel>Study *</FieldLabel>
                  <Select value={formData.study} onValueChange={v => f("study", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field><FieldLabel>Screening Number</FieldLabel><Input value={formData.screeningNumber} onChange={e => f("screeningNumber", e.target.value)} /></Field>
                <Field><FieldLabel>Randomization Number</FieldLabel><Input value={formData.randomizationNumber} onChange={e => f("randomizationNumber", e.target.value)} /></Field>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Medical Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Blood Group</FieldLabel>
                  <Select value={formData.bloodGroup} onValueChange={v => f("bloodGroup", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field><FieldLabel>Height (cm)</FieldLabel><Input value={formData.height} onChange={e => f("height", e.target.value)} /></Field>
                <Field><FieldLabel>Weight (kg)</FieldLabel><Input value={formData.weight} onChange={e => f("weight", e.target.value)} /></Field>
                <Field className="col-span-3"><FieldLabel>Medical History</FieldLabel><Textarea rows={3} value={formData.medicalHistory} onChange={e => f("medicalHistory", e.target.value)} /></Field>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Emergency Contact</h4>
              <div className="grid grid-cols-3 gap-4">
                <Field><FieldLabel>Full Name</FieldLabel><Input value={formData.emergencyContactName} onChange={e => f("emergencyContactName", e.target.value)} /></Field>
                <Field><FieldLabel>Relationship</FieldLabel><Input value={formData.emergencyRelationship} onChange={e => f("emergencyRelationship", e.target.value)} /></Field>
                <Field><FieldLabel>Phone</FieldLabel><Input value={formData.emergencyPhone} onChange={e => f("emergencyPhone", e.target.value)} /></Field>
              </div>
            </div>
          </FieldGroup>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Update Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Schedule Visit Dialog ── */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Visit</DialogTitle>
            <DialogDescription>Schedule a new visit for {selectedPatient?.name}.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Visit Type</FieldLabel>
              <Select value={scheduleData.visitType} onValueChange={v => setScheduleData({ ...scheduleData, visitType: v })}>
                <SelectTrigger><SelectValue placeholder="Select visit type" /></SelectTrigger>
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
              <Input type="date" value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel>Time</FieldLabel>
              <Select value={scheduleData.time} onValueChange={v => setScheduleData({ ...scheduleData, time: v })}>
                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(t => (
                    <SelectItem key={t} value={t}>{t.replace("09", "09").replace("10", "10").replace("11", "11").replace("14", "02").replace("15", "03").replace("16", "04")} {parseInt(t) < 12 ? "AM" : "PM"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>Schedule Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Upload Document Dialog ── */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document for {selectedPatient?.name}.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Document Type</FieldLabel>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consent">Informed Consent</SelectItem>
                  <SelectItem value="lab">Lab Report</SelectItem>
                  <SelectItem value="ae">AE Report</SelectItem>
                  <SelectItem value="diary">Patient Diary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>File</FieldLabel>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-primary font-medium">click to browse</span></p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG up to 10MB</p>
                <Input type="file" className="hidden" />
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsUploadOpen(false); toast.success("Document uploaded successfully") }}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Withdraw Confirmation ── */}
      <AlertDialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw <strong>{selectedPatient?.name}</strong> from <strong>{selectedPatient?.study}</strong>? This action will mark the patient as withdrawn and cancel all scheduled visits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWithdraw} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Withdraw Patient</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
