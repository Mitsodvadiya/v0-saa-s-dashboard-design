"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit,
  FileText,
  Heart,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Pill,
  Plus,
  TrendingUp,
  Upload,
  User,
  XCircle,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock patient data - in real app this would come from API
const patientsData: Record<string, PatientData> = {
  "PT-1001": {
    id: "PT-1001",
    name: "John Smith",
    initials: "JS",
    age: 54,
    dateOfBirth: "Mar 15, 1970",
    gender: "Male",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Oak Street, Boston, MA 02108",
    emergencyContact: "Mary Smith (Wife) - +1 (555) 987-6543",
    study: "BEACON-2024",
    studyArm: "Treatment Group A",
    enrolledDate: "Jan 20, 2024",
    status: "active",
    nextVisit: "Mar 15, 2024",
    visitStatus: "confirmed",
    compliance: 95,
    totalVisits: 8,
    completedVisits: 6,
    primaryDiagnosis: "Type 2 Diabetes Mellitus",
    medicalHistory: ["Hypertension", "Hyperlipidemia", "Obesity"],
    allergies: ["Penicillin", "Sulfa drugs"],
    currentMedications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
    ],
    principalInvestigator: "Dr. Sarah Chen",
    siteCoordinator: "Emily Rodriguez",
  },
  "PT-1002": {
    id: "PT-1002",
    name: "Emily Johnson",
    initials: "EJ",
    age: 42,
    dateOfBirth: "Jul 22, 1982",
    gender: "Female",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Maple Ave, Cambridge, MA 02139",
    emergencyContact: "Tom Johnson (Husband) - +1 (555) 876-5432",
    study: "AURORA-Phase2",
    studyArm: "Placebo Group",
    enrolledDate: "Feb 12, 2024",
    status: "active",
    nextVisit: "Mar 12, 2024",
    visitStatus: "pending",
    compliance: 88,
    totalVisits: 6,
    completedVisits: 4,
    primaryDiagnosis: "Rheumatoid Arthritis",
    medicalHistory: ["Osteoporosis", "Vitamin D Deficiency"],
    allergies: ["None known"],
    currentMedications: [
      { name: "Methotrexate", dosage: "15mg", frequency: "Weekly" },
      { name: "Folic Acid", dosage: "1mg", frequency: "Daily" },
      { name: "Calcium + D3", dosage: "600mg/800IU", frequency: "Daily" },
    ],
    principalInvestigator: "Dr. Michael Park",
    siteCoordinator: "Jessica Lee",
  },
}

interface PatientData {
  id: string
  name: string
  initials: string
  age: number
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  address: string
  emergencyContact: string
  study: string
  studyArm: string
  enrolledDate: string
  status: string
  nextVisit: string
  visitStatus: string
  compliance: number
  totalVisits: number
  completedVisits: number
  primaryDiagnosis: string
  medicalHistory: string[]
  allergies: string[]
  currentMedications: { name: string; dosage: string; frequency: string }[]
  principalInvestigator: string
  siteCoordinator: string
}

const visitHistory = [
  {
    id: "V-001",
    date: "Jan 20, 2024",
    type: "Screening",
    status: "completed",
    notes: "Initial screening completed. All eligibility criteria met.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-002",
    date: "Jan 27, 2024",
    type: "Baseline",
    status: "completed",
    notes: "Baseline measurements recorded. Study drug dispensed.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-003",
    date: "Feb 10, 2024",
    type: "Week 2",
    status: "completed",
    notes: "No adverse events. Patient tolerating medication well.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-004",
    date: "Feb 24, 2024",
    type: "Week 4",
    status: "completed",
    notes: "Blood work collected. Mild headache reported - resolved.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-005",
    date: "Mar 02, 2024",
    type: "Week 6",
    status: "completed",
    notes: "Positive response observed. Compliance remains excellent.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-006",
    date: "Mar 09, 2024",
    type: "Week 7",
    status: "completed",
    notes: "Interim assessment completed. Continuing to next phase.",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-007",
    date: "Mar 15, 2024",
    type: "Week 8",
    status: "scheduled",
    notes: "",
    investigator: "Dr. Sarah Chen",
  },
  {
    id: "V-008",
    date: "Mar 30, 2024",
    type: "Week 10",
    status: "scheduled",
    notes: "",
    investigator: "Dr. Sarah Chen",
  },
]

const documents = [
  {
    id: "DOC-001",
    name: "Informed Consent Form",
    type: "Consent",
    uploadDate: "Jan 20, 2024",
    uploadedBy: "Emily Rodriguez",
    status: "signed",
  },
  {
    id: "DOC-002",
    name: "Medical History Form",
    type: "Medical Record",
    uploadDate: "Jan 20, 2024",
    uploadedBy: "Emily Rodriguez",
    status: "completed",
  },
  {
    id: "DOC-003",
    name: "Baseline Lab Results",
    type: "Lab Report",
    uploadDate: "Jan 27, 2024",
    uploadedBy: "Lab System",
    status: "verified",
  },
  {
    id: "DOC-004",
    name: "Week 4 Lab Results",
    type: "Lab Report",
    uploadDate: "Feb 24, 2024",
    uploadedBy: "Lab System",
    status: "verified",
  },
  {
    id: "DOC-005",
    name: "Adverse Event Report - Headache",
    type: "AE Report",
    uploadDate: "Feb 24, 2024",
    uploadedBy: "Dr. Sarah Chen",
    status: "resolved",
  },
  {
    id: "DOC-006",
    name: "Medication Diary - Feb",
    type: "Patient Diary",
    uploadDate: "Mar 01, 2024",
    uploadedBy: "Patient Portal",
    status: "reviewed",
  },
]

const adverseEvents = [
  {
    id: "AE-001",
    event: "Mild Headache",
    reportedDate: "Feb 24, 2024",
    severity: "mild",
    relationship: "Possibly related",
    status: "resolved",
    resolution: "Resolved within 24 hours with rest",
  },
]

const vitalSignsData = [
  { date: "Jan 20", systolic: 142, diastolic: 88, heartRate: 78, weight: 198 },
  { date: "Jan 27", systolic: 138, diastolic: 86, heartRate: 76, weight: 197 },
  { date: "Feb 10", systolic: 135, diastolic: 84, heartRate: 74, weight: 195 },
  { date: "Feb 24", systolic: 132, diastolic: 82, heartRate: 72, weight: 193 },
  { date: "Mar 02", systolic: 130, diastolic: 80, heartRate: 72, weight: 191 },
  { date: "Mar 09", systolic: 128, diastolic: 79, heartRate: 70, weight: 190 },
]

const labResultsData = [
  { date: "Jan 27", hba1c: 8.2, glucose: 165, cholesterol: 210 },
  { date: "Feb 24", hba1c: 7.8, glucose: 148, cholesterol: 198 },
  { date: "Mar 09", hba1c: 7.4, glucose: 132, cholesterol: 185 },
]

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-0",
  screening: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  withdrawn: "bg-destructive/10 text-destructive border-0",
  scheduled: "bg-primary/10 text-primary border-0",
  signed: "bg-success/10 text-success border-0",
  verified: "bg-success/10 text-success border-0",
  reviewed: "bg-success/10 text-success border-0",
  resolved: "bg-muted text-muted-foreground border-0",
}

const severityStyles: Record<string, string> = {
  mild: "bg-warning/10 text-warning border-0",
  moderate: "bg-chart-4/20 text-chart-4 border-0",
  severe: "bg-destructive/10 text-destructive border-0",
}

const chartConfig = {
  systolic: { label: "Systolic", color: "var(--chart-1)" },
  diastolic: { label: "Diastolic", color: "var(--chart-2)" },
  heartRate: { label: "Heart Rate", color: "var(--chart-3)" },
  hba1c: { label: "HbA1c", color: "var(--chart-1)" },
  glucose: { label: "Glucose", color: "var(--chart-2)" },
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)

  const patient = patientsData[resolvedParams.id] || patientsData["PT-1001"]
  const progressPercentage = (patient.completedVisits / patient.totalVisits) * 100

  return (
    <>
      <DashboardHeader
        title="Patient Profile"
        description={`Viewing details for ${patient.name}`}
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/patients" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
            Back to Patients
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{patient.name}</span>
        </div>

        {/* Patient Header Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="size-16 text-lg">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">{patient.name}</h2>
                    <Badge className={statusStyles[patient.status]}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {patient.id} • {patient.age} years old • {patient.gender}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-4 text-muted-foreground" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-4 text-muted-foreground" />
                      {patient.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 size-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 size-4" />
                  Send Message
                </Button>
                <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 size-4" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Clinical Note</DialogTitle>
                      <DialogDescription>
                        Add a note to this patient&apos;s record.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-4">
                      <Field>
                        <FieldLabel>Note Type</FieldLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Note</SelectItem>
                            <SelectItem value="clinical">Clinical Observation</SelectItem>
                            <SelectItem value="followup">Follow-up Required</SelectItem>
                            <SelectItem value="adverse">Adverse Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Note</FieldLabel>
                        <Textarea placeholder="Enter your note here..." rows={4} />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsNoteDialogOpen(false)}>Save Note</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Progress Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Activity className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study</p>
                  <p className="font-semibold">{patient.study}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <CheckCircle2 className="size-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="font-semibold">{patient.compliance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-3/10 p-2">
                  <Calendar className="size-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Visit</p>
                  <p className="font-semibold">{patient.nextVisit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-4/10 p-2">
                  <TrendingUp className="size-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-semibold">{patient.completedVisits}/{patient.totalVisits} visits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visits">Visit History</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="adverse-events">Adverse Events</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Personal Information */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="size-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                    <span className="text-sm font-medium">{patient.dateOfBirth}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="text-sm font-medium">{patient.gender}</span>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Address</span>
                    <p className="text-sm font-medium mt-1">{patient.address}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Emergency Contact</span>
                    <p className="text-sm font-medium mt-1">{patient.emergencyContact}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Study Information */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="size-4" />
                    Study Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Study</span>
                    <span className="text-sm font-medium">{patient.study}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Study Arm</span>
                    <span className="text-sm font-medium">{patient.studyArm}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Enrolled Date</span>
                    <span className="text-sm font-medium">{patient.enrolledDate}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal Investigator</span>
                    <span className="text-sm font-medium">{patient.principalInvestigator}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Site Coordinator</span>
                    <span className="text-sm font-medium">{patient.siteCoordinator}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="size-4" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Primary Diagnosis</span>
                    <p className="text-sm font-medium mt-1">{patient.primaryDiagnosis}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Medical History</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {patient.medicalHistory.map((condition) => (
                        <Badge key={condition} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">Allergies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="outline" className="text-xs border-destructive/30 text-destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Study Progress Timeline */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Study Progress</CardTitle>
                <CardDescription>
                  {patient.completedVisits} of {patient.totalVisits} visits completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enrolled: {patient.enrolledDate}</span>
                  <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="grid grid-cols-8 gap-2 pt-2">
                  {visitHistory.map((visit, index) => (
                    <div
                      key={visit.id}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                        visit.status === "completed"
                          ? "bg-success/10"
                          : visit.status === "scheduled"
                          ? "bg-muted"
                          : "bg-muted/50"
                      }`}
                    >
                      {visit.status === "completed" ? (
                        <CheckCircle2 className="size-5 text-success" />
                      ) : (
                        <Clock className="size-5 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium text-center">{visit.type}</span>
                      <span className="text-[10px] text-muted-foreground">{visit.date.split(",")[0]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="size-4" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.currentMedications.map((med) => (
                      <TableRow key={med.name}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visit History Tab */}
          <TabsContent value="visits" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Visit History</CardTitle>
                  <CardDescription>Complete visit records and scheduled appointments</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 size-4" />
                  Schedule Visit
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Visit ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Investigator</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitHistory.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell className="font-medium">{visit.id}</TableCell>
                        <TableCell>{visit.date}</TableCell>
                        <TableCell>{visit.type}</TableCell>
                        <TableCell>
                          <Badge className={statusStyles[visit.status]}>
                            {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{visit.investigator}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {visit.notes || "—"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Notes</DropdownMenuItem>
                              {visit.status === "scheduled" && (
                                <>
                                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                                </>
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
          </TabsContent>

          {/* Vitals & Labs Tab */}
          <TabsContent value="vitals" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Blood Pressure Chart */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Blood Pressure Trends</CardTitle>
                  <CardDescription>Systolic and diastolic readings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vitalSignsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <YAxis domain={[60, 160]} className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="systolic"
                          stroke="var(--chart-1)"
                          fill="var(--chart-1)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="diastolic"
                          stroke="var(--chart-2)"
                          fill="var(--chart-2)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Heart Rate & Weight */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Heart Rate Trends</CardTitle>
                  <CardDescription>Resting heart rate measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalSignsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <YAxis domain={[60, 90]} className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          stroke="var(--chart-3)"
                          strokeWidth={2}
                          dot={{ fill: "var(--chart-3)", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Lab Results */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Lab Results - Key Markers</CardTitle>
                <CardDescription>HbA1c and fasting glucose trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labResultsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <YAxis domain={[6, 9]} className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="hba1c"
                          stroke="var(--chart-1)"
                          strokeWidth={2}
                          dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labResultsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <YAxis domain={[100, 200]} className="text-xs" tick={{ fill: 'var(--muted-foreground)' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="glucose"
                          stroke="var(--chart-2)"
                          strokeWidth={2}
                          dot={{ fill: "var(--chart-2)", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Vital Signs History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>BP (mmHg)</TableHead>
                      <TableHead>Heart Rate (bpm)</TableHead>
                      <TableHead>Weight (lbs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vitalSignsData.map((record) => (
                      <TableRow key={record.date}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{record.systolic}/{record.diastolic}</TableCell>
                        <TableCell>{record.heartRate}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Patient Documents</CardTitle>
                  <CardDescription>Consent forms, lab results, and patient records</CardDescription>
                </div>
                <Button size="sm">
                  <Upload className="mr-2 size-4" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.uploadedBy}</TableCell>
                        <TableCell>
                          <Badge className={statusStyles[doc.status]}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="size-8">
                            <Download className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adverse Events Tab */}
          <TabsContent value="adverse-events" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Adverse Events</CardTitle>
                  <CardDescription>Reported adverse events and their resolution status</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 size-4" />
                  Report AE
                </Button>
              </CardHeader>
              <CardContent>
                {adverseEvents.length > 0 ? (
                  <div className="space-y-4">
                    {adverseEvents.map((ae) => (
                      <div key={ae.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full p-1.5 ${
                              ae.status === "resolved" ? "bg-muted" : "bg-warning/10"
                            }`}>
                              {ae.status === "resolved" ? (
                                <CheckCircle2 className="size-4 text-muted-foreground" />
                              ) : (
                                <XCircle className="size-4 text-warning" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{ae.event}</h4>
                              <p className="text-sm text-muted-foreground">
                                Reported: {ae.reportedDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={severityStyles[ae.severity]}>
                              {ae.severity.charAt(0).toUpperCase() + ae.severity.slice(1)}
                            </Badge>
                            <Badge className={statusStyles[ae.status]}>
                              {ae.status.charAt(0).toUpperCase() + ae.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Relationship to Study Drug</span>
                            <p className="font-medium">{ae.relationship}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Resolution</span>
                            <p className="font-medium">{ae.resolution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="size-12 mx-auto mb-3 opacity-50" />
                    <p>No adverse events reported for this patient.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
