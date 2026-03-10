"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit2,
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
  Users,
  XCircle,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

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
  city: string
  state: string
  country: string
  postalCode: string
  study: string
  sponsor: string
  studyArm: string
  enrolledDate: string
  screeningNumber: string
  randomizationNumber: string
  status: "active" | "screening" | "completed" | "withdrawn"
  nextVisit: string
  visitStatus: string
  compliance: number
  totalVisits: number
  completedVisits: number
  bloodGroup: string
  height: string
  weight: string
  primaryDiagnosis: string
  medicalHistory: string[]
  allergies: string[]
  currentMedications: { name: string; dosage: string; frequency: string }[]
  emergencyContactName: string
  emergencyRelationship: string
  emergencyPhone: string
  consentSigned: string
  consentDate: string
  principalInvestigator: string
  siteCoordinator: string
}

interface MedicalNote {
  id: string
  type: string
  content: string
  author: string
  timestamp: string
}

interface Document {
  id: string
  name: string
  type: string
  uploadedBy: string
  uploadDate: string
  size: string
  status: string
}

const patientsData: Record<string, PatientData> = {
  "PT-1001": {
    id: "PT-1001", name: "John Smith", initials: "JS", age: 54,
    dateOfBirth: "Mar 15, 1970", gender: "Male",
    email: "john.smith@email.com", phone: "+1 (555) 111-2222",
    address: "123 Oak Street", city: "Boston", state: "MA", country: "USA", postalCode: "02108",
    study: "BEACON-2024", sponsor: "Pfizer Inc.", studyArm: "Treatment Group A",
    enrolledDate: "Jan 20, 2024", screeningNumber: "SCR-001", randomizationNumber: "RND-001",
    status: "active", nextVisit: "Mar 15, 2024", visitStatus: "confirmed",
    compliance: 95, totalVisits: 8, completedVisits: 6,
    bloodGroup: "O+", height: "178 cm", weight: "82 kg",
    primaryDiagnosis: "Type 2 Diabetes Mellitus",
    medicalHistory: ["Hypertension", "Hyperlipidemia", "Obesity"],
    allergies: ["Penicillin", "Sulfa drugs"],
    currentMedications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
    ],
    emergencyContactName: "Mary Smith", emergencyRelationship: "Wife", emergencyPhone: "+1 (555) 987-6543",
    consentSigned: "Yes", consentDate: "Jan 18, 2024",
    principalInvestigator: "Dr. Sarah Chen", siteCoordinator: "Emily Rodriguez",
  },
  "PT-1002": {
    id: "PT-1002", name: "Emily Johnson", initials: "EJ", age: 42,
    dateOfBirth: "Jul 22, 1982", gender: "Female",
    email: "emily.johnson@email.com", phone: "+1 (555) 222-3333",
    address: "456 Maple Ave", city: "Cambridge", state: "MA", country: "USA", postalCode: "02139",
    study: "AURORA-Phase2", sponsor: "Novartis AG", studyArm: "Placebo Group",
    enrolledDate: "Feb 12, 2024", screeningNumber: "SCR-002", randomizationNumber: "RND-002",
    status: "active", nextVisit: "Mar 12, 2024", visitStatus: "pending",
    compliance: 88, totalVisits: 6, completedVisits: 4,
    bloodGroup: "A+", height: "165 cm", weight: "62 kg",
    primaryDiagnosis: "Rheumatoid Arthritis",
    medicalHistory: ["Osteoporosis", "Vitamin D Deficiency"],
    allergies: ["None known"],
    currentMedications: [
      { name: "Methotrexate", dosage: "15mg", frequency: "Weekly" },
      { name: "Folic Acid", dosage: "1mg", frequency: "Daily" },
    ],
    emergencyContactName: "Tom Johnson", emergencyRelationship: "Husband", emergencyPhone: "+1 (555) 876-5432",
    consentSigned: "Yes", consentDate: "Feb 10, 2024",
    principalInvestigator: "Dr. Michael Park", siteCoordinator: "Jessica Lee",
  },
}

const visitHistory = [
  { id: "V-001", date: "Jan 20, 2024", type: "Screening", window: "Day -14 to -1", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "Initial screening completed. Eligibility criteria met." },
  { id: "V-002", date: "Jan 27, 2024", type: "Baseline (V1)", window: "Day 1", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "Baseline measurements. Study drug dispensed." },
  { id: "V-003", date: "Feb 10, 2024", type: "Week 2 (V2)", window: "Day 14 ± 3", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "No adverse events. Patient tolerating medication well." },
  { id: "V-004", date: "Feb 24, 2024", type: "Week 4 (V3)", window: "Day 28 ± 3", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "Blood work collected. Mild headache — resolved." },
  { id: "V-005", date: "Mar 02, 2024", type: "Week 6 (V4)", window: "Day 42 ± 7", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "Positive response. Compliance excellent." },
  { id: "V-006", date: "Mar 09, 2024", type: "Week 7 (V5)", window: "Day 49 ± 7", status: "completed", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "Interim assessment completed." },
  { id: "V-007", date: "Mar 15, 2024", type: "Week 8 (V6)", window: "Day 56 ± 7", status: "scheduled", confirmation: "confirmed", investigator: "Dr. Sarah Chen", notes: "" },
  { id: "V-008", date: "Mar 30, 2024", type: "Week 10 (V7)", window: "Day 70 ± 7", status: "scheduled", confirmation: "pending", investigator: "Dr. Sarah Chen", notes: "" },
]

const initialDocuments: Document[] = [
  { id: "DOC-001", name: "Informed Consent Form", type: "Consent", uploadedBy: "Emily Rodriguez", uploadDate: "Jan 20, 2024", size: "124 KB", status: "signed" },
  { id: "DOC-002", name: "Medical History Form", type: "Medical Record", uploadedBy: "Emily Rodriguez", uploadDate: "Jan 20, 2024", size: "88 KB", status: "completed" },
  { id: "DOC-003", name: "Baseline Lab Results", type: "Lab Report", uploadedBy: "Lab System", uploadDate: "Jan 27, 2024", size: "256 KB", status: "verified" },
  { id: "DOC-004", name: "Week 4 Lab Results", type: "Lab Report", uploadedBy: "Lab System", uploadDate: "Feb 24, 2024", size: "312 KB", status: "verified" },
  { id: "DOC-005", name: "AE Report — Headache", type: "AE Report", uploadedBy: "Dr. Sarah Chen", uploadDate: "Feb 24, 2024", size: "45 KB", status: "resolved" },
  { id: "DOC-006", name: "Medication Diary — Feb", type: "Patient Diary", uploadedBy: "Patient Portal", uploadDate: "Mar 01, 2024", size: "72 KB", status: "reviewed" },
]

const initialNotes: MedicalNote[] = [
  { id: "N-001", type: "Clinical Observation", content: "Patient reports consistent improvement in energy levels. No new complaints.", author: "Dr. Sarah Chen", timestamp: "Mar 09, 2024 at 10:30 AM" },
  { id: "N-002", type: "Follow-up Required", content: "Scheduled follow-up for blood pressure monitoring. Patient instructed to log readings daily.", author: "Emily Rodriguez", timestamp: "Feb 24, 2024 at 2:15 PM" },
  { id: "N-003", type: "Adverse Event", content: "Patient reported mild headache (Grade 1) after Week 4 visit. Resolved within 24 hours without intervention.", author: "Dr. Sarah Chen", timestamp: "Feb 24, 2024 at 11:00 AM" },
  { id: "N-004", type: "General Note", content: "Patient expressed satisfaction with study participation. No protocol deviations to date.", author: "Emily Rodriguez", timestamp: "Feb 10, 2024 at 9:45 AM" },
]

const activityTimeline = [
  { action: "Visit completed", detail: "Week 7 (V5) visit completed successfully", user: "Dr. Sarah Chen", time: "Mar 09, 2024 at 11:00 AM", icon: CheckCircle2, color: "text-success" },
  { action: "Medical note added", detail: "Clinical observation recorded after visit", user: "Dr. Sarah Chen", time: "Mar 09, 2024 at 10:30 AM", icon: MessageSquare, color: "text-primary" },
  { action: "Document uploaded", detail: "Medication Diary — Feb uploaded via Patient Portal", user: "Patient Portal", time: "Mar 01, 2024 at 8:00 AM", icon: FileText, color: "text-primary" },
  { action: "Visit completed", detail: "Week 6 (V4) visit completed. Adverse event logged.", user: "Dr. Sarah Chen", time: "Feb 24, 2024 at 2:00 PM", icon: CheckCircle2, color: "text-success" },
  { action: "Visit rescheduled", detail: "Week 3 visit rescheduled from Feb 17 to Feb 24", user: "Emily Rodriguez", time: "Feb 15, 2024 at 9:00 AM", icon: Calendar, color: "text-warning" },
  { action: "Patient enrolled", detail: "John Smith enrolled into BEACON-2024 study arm", user: "Emily Rodriguez", time: "Jan 20, 2024 at 9:00 AM", icon: Users, color: "text-primary" },
]

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-0",
  screening: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  withdrawn: "bg-destructive/10 text-destructive border-0",
  scheduled: "bg-primary/10 text-primary border-0",
  missed: "bg-destructive/10 text-destructive border-0",
  rescheduled: "bg-warning/10 text-warning border-0",
  confirmed: "bg-success/10 text-success border-0",
  pending: "bg-warning/10 text-warning border-0",
  signed: "bg-success/10 text-success border-0",
  verified: "bg-success/10 text-success border-0",
  reviewed: "bg-success/10 text-success border-0",
  resolved: "bg-muted text-muted-foreground border-0",
}

const noteTypeStyles: Record<string, string> = {
  "Clinical Observation": "bg-primary/10 text-primary border-0",
  "Follow-up Required": "bg-warning/10 text-warning border-0",
  "Adverse Event": "bg-destructive/10 text-destructive border-0",
  "General Note": "bg-muted text-muted-foreground border-0",
}

const TAB_CLASS = "rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const patient = patientsData[resolvedParams.id] || patientsData["PT-1001"]
  const progressPct = Math.round((patient.completedVisits / patient.totalVisits) * 100)

  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [notes, setNotes] = useState<MedicalNote[]>(initialNotes)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [editNote, setEditNote] = useState<MedicalNote | null>(null)
  const [noteForm, setNoteForm] = useState({ type: "General Note", content: "" })

  const handleSaveNote = () => {
    if (!noteForm.content.trim()) { toast.error("Note content is required"); return }
    if (editNote) {
      setNotes(notes.map(n => n.id === editNote.id ? { ...n, type: noteForm.type, content: noteForm.content } : n))
      toast.success("Note updated")
    } else {
      const newNote: MedicalNote = {
        id: `N-${String(notes.length + 1).padStart(3, "0")}`,
        type: noteForm.type, content: noteForm.content,
        author: "Dr. Sarah Chen",
        timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      }
      setNotes([newNote, ...notes])
      toast.success("Note added")
    }
    setIsNoteOpen(false); setEditNote(null); setNoteForm({ type: "General Note", content: "" })
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    toast.success("Note deleted")
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id))
    toast.success("Document deleted")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Sticky Header ── */}
      <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur sticky top-0 z-10 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients"><ArrowLeft className="size-4" /></Link>
        </Button>
        <Avatar className="size-10">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{patient.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{patient.name}</h1>
            <Badge className={statusStyles[patient.status]}>
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{patient.id}</span>
            <span>•</span>
            <span>{patient.age}y {patient.gender}</span>
            <span>•</span>
            <span>{patient.study}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="mr-2 size-4" />Edit Profile
          </Button>
          <Button size="sm" onClick={() => { setNoteForm({ type: "General Note", content: "" }); setEditNote(null); setIsNoteOpen(true) }}>
            <Plus className="mr-2 size-4" />Add Note
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b shrink-0">
          <TabsList className="bg-transparent h-auto p-0 py-2 gap-2 flex-wrap">
            <TabsTrigger value="overview" className={TAB_CLASS}>Overview</TabsTrigger>
            <TabsTrigger value="visits" className={TAB_CLASS}>Visits ({visitHistory.length})</TabsTrigger>
            <TabsTrigger value="documents" className={TAB_CLASS}>Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="notes" className={TAB_CLASS}>Medical Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="analytics" className={TAB_CLASS}>Analytics</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-0">

            {/* ── OVERVIEW ── */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Left: main info card */}
                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Information</CardTitle>
                    <CardDescription>Personal, contact, and study details</CardDescription>
                  </CardHeader>
                  <div className="space-y-8 p-6 pt-0">
                    {/* Personal */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Personal Details</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Patient ID</p>
                          <p className="text-sm font-semibold">{patient.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Date of Birth</p>
                          <p className="text-sm font-semibold">{patient.dateOfBirth}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Age</p>
                          <p className="text-sm font-semibold">{patient.age} years</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Gender</p>
                          <p className="text-sm font-semibold">{patient.gender}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                          <a href={`mailto:${patient.email}`} className="text-sm font-semibold text-primary hover:underline">{patient.email}</a>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                          <p className="text-sm font-semibold">{patient.phone}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Address</p>
                          <p className="text-sm font-semibold">{patient.address}, {patient.city}, {patient.state} {patient.postalCode}, {patient.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Study */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Study Enrollment</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Study</p>
                          <Link href={`/studies/${patient.study}`} className="text-sm font-semibold text-primary hover:underline">{patient.study}</Link>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sponsor</p>
                          <p className="text-sm font-semibold">{patient.sponsor}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Study Arm</p>
                          <p className="text-sm font-semibold">{patient.studyArm}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enrolled Date</p>
                          <p className="text-sm font-semibold">{patient.enrolledDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Screening #</p>
                          <p className="text-sm font-semibold">{patient.screeningNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Randomization #</p>
                          <p className="text-sm font-semibold">{patient.randomizationNumber || "—"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">PI</p>
                          <p className="text-sm font-semibold">{patient.principalInvestigator}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Site Coordinator</p>
                          <p className="text-sm font-semibold">{patient.siteCoordinator}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Informed Consent</p>
                          <Badge className={patient.consentSigned === "Yes" ? "bg-success/10 text-success border-0 text-xs" : "bg-destructive/10 text-destructive border-0 text-xs"}>
                            {patient.consentSigned === "Yes" ? `Signed — ${patient.consentDate}` : "Not Signed"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Medical */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Medical Information</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Blood Group</p>
                          <p className="text-sm font-semibold">{patient.bloodGroup}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Height / Weight</p>
                          <p className="text-sm font-semibold">{patient.height} / {patient.weight}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Primary Diagnosis</p>
                          <p className="text-sm font-semibold">{patient.primaryDiagnosis}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Medical History</p>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.medicalHistory.map(h => <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Allergies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.allergies.map(a => <Badge key={a} variant="outline" className="text-xs border-destructive/40 text-destructive">{a}</Badge>)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Emergency Contact</h4>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Full Name</p>
                          <p className="text-sm font-semibold">{patient.emergencyContactName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Relationship</p>
                          <p className="text-sm font-semibold">{patient.emergencyRelationship}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                          <p className="text-sm font-semibold">{patient.emergencyPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Right: stat cards */}
                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Activity className="size-5" /></div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight">PROGRESS</Badge>
                      </div>
                      <div className="space-y-1 mb-4">
                        <p className="text-3xl font-bold">{patient.completedVisits}/{patient.totalVisits}</p>
                        <p className="text-sm text-muted-foreground font-medium">Visits Completed</p>
                      </div>
                      <Progress value={progressPct} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">{progressPct}% complete</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success"><CheckCircle2 className="size-5" /></div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight">COMPLIANCE</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">{patient.compliance}%</p>
                        <p className="text-sm text-muted-foreground font-medium">Protocol Compliance</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning"><Calendar className="size-5" /></div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight">NEXT VISIT</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">{patient.nextVisit}</p>
                        <p className="text-sm text-muted-foreground font-medium">Upcoming appointment</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Timeline */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Activity Timeline</CardTitle>
                      <CardDescription>Recent patient activity</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      {activityTimeline.slice(0, 5).map((item, i) => {
                        const Icon = item.icon
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`size-6 rounded-full bg-muted flex items-center justify-center shrink-0`}>
                                <Icon className={`size-3 ${item.color}`} />
                              </div>
                              {i < activityTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                            </div>
                            <div className="pb-4 min-w-0">
                              <p className="text-xs font-semibold">{item.action}</p>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">{item.detail}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.user} • {item.time.split(",")[0]}</p>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Current Medications */}
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Pill className="size-4" />
                  <div>
                    <CardTitle className="text-base">Current Medications</CardTitle>
                    <CardDescription>Active medications and dosing regimen</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow><TableHead>Medication</TableHead><TableHead>Dosage</TableHead><TableHead>Frequency</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.currentMedications.map(med => (
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

            {/* ── VISITS ── */}
            <TabsContent value="visits" className="mt-0">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base text-primary">Visit Schedule</CardTitle>
                    <CardDescription>{patient.completedVisits} of {patient.totalVisits} visits completed</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="mr-2 size-4" />Schedule Visit</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Visit</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Window</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Confirmation</TableHead>
                        <TableHead>Investigator</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitHistory.map(v => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.type}</TableCell>
                          <TableCell className="text-sm">{v.date}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{v.window}</TableCell>
                          <TableCell>
                            <Badge className={statusStyles[v.status] + " text-[10px]"}>
                              {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusStyles[v.confirmation] + " text-[10px]"}>
                              {v.confirmation.charAt(0).toUpperCase() + v.confirmation.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{v.investigator}</TableCell>
                          <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">{v.notes || "—"}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {v.status === "scheduled" && <><DropdownMenuItem>Confirm Visit</DropdownMenuItem><DropdownMenuItem>Reschedule</DropdownMenuItem></>}
                                {v.status === "completed" && <DropdownMenuItem>View Notes</DropdownMenuItem>}
                                <DropdownMenuItem onClick={() => toast.success("Marked as completed")}>Mark Completed</DropdownMenuItem>
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

            {/* ── DOCUMENTS ── */}
            <TabsContent value="documents" className="mt-0">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base text-primary">Patient Documents</CardTitle>
                    <CardDescription>{documents.length} documents on file</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsUploadOpen(true)}><Upload className="mr-2 size-4" />Upload Document</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{doc.type}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{doc.uploadedBy}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{doc.uploadDate}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                          <TableCell><Badge className={statusStyles[doc.status] + " text-[10px]"}>{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Download className="mr-2 size-4" />Download</DropdownMenuItem>
                                <DropdownMenuItem><FileText className="mr-2 size-4" />Preview</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDocument(doc.id)}><XCircle className="mr-2 size-4" />Delete</DropdownMenuItem>
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

            {/* ── MEDICAL NOTES ── */}
            <TabsContent value="notes" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Medical Notes</h3>
                  <p className="text-sm text-muted-foreground">Clinical observations and follow-up notes</p>
                </div>
                <Button size="sm" onClick={() => { setNoteForm({ type: "General Note", content: "" }); setEditNote(null); setIsNoteOpen(true) }}>
                  <Plus className="mr-2 size-4" />Add Note
                </Button>
              </div>
              <div className="space-y-4">
                {notes.map(note => (
                  <Card key={note.id} className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={noteTypeStyles[note.type] + " text-[10px]"}>{note.type}</Badge>
                            <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{note.content}</p>
                          <p className="text-xs font-medium text-muted-foreground">— {note.author}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8 shrink-0"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditNote(note); setNoteForm({ type: note.type, content: note.content }); setIsNoteOpen(true) }}>
                              <Edit2 className="mr-2 size-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNote(note.id)}>
                              <XCircle className="mr-2 size-4" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── ANALYTICS ── */}
            <TabsContent value="analytics" className="mt-0 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Performance</CardTitle>
                    <CardDescription>Participation and compliance analytics</CardDescription>
                  </CardHeader>
                  <div className="space-y-8 p-6 pt-0">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Visit Completion</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {[
                          { label: "Total Scheduled Visits", value: patient.totalVisits },
                          { label: "Completed Visits", value: patient.completedVisits },
                          { label: "Remaining Visits", value: patient.totalVisits - patient.completedVisits },
                          { label: "Completion Rate", value: `${progressPct}%` },
                          { label: "Missed Visits", value: 0 },
                          { label: "Rescheduled Visits", value: 1 },
                        ].map(item => (
                          <div key={item.label} className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Compliance & Safety</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {[
                          { label: "Protocol Compliance", value: `${patient.compliance}%` },
                          { label: "Adverse Events", value: 1 },
                          { label: "Protocol Deviations", value: 0 },
                          { label: "AE Severity", value: "Grade 1 (Mild)" },
                          { label: "Medication Adherence", value: "Excellent" },
                          { label: "Overall Status", value: patient.status.charAt(0).toUpperCase() + patient.status.slice(1) },
                        ].map(item => (
                          <div key={item.label} className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Visit progress bar */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Visit Completion Progress</h4>
                      <div className="space-y-3">
                        {visitHistory.map(v => (
                          <div key={v.id} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 shrink-0">{v.type}</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${v.status === "completed" ? "bg-success" : "bg-muted-foreground/20"}`} style={{ width: v.status === "completed" ? "100%" : "0%" }} />
                            </div>
                            <Badge className={statusStyles[v.status] + " text-[10px] w-20 justify-center"}>{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success"><TrendingUp className="size-5" /></div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight">TREND</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">+7%</p>
                        <p className="text-sm text-muted-foreground font-medium">Compliance vs. Last Month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive"><AlertTriangle className="size-5" /></div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight">SAFETY</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">1</p>
                        <p className="text-sm text-muted-foreground font-medium">Adverse Events Reported</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Full Activity Timeline */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-primary">Full Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      {activityTimeline.map((item, i) => {
                        const Icon = item.icon
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Icon className={`size-3 ${item.color}`} />
                              </div>
                              {i < activityTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                            </div>
                            <div className="pb-4 min-w-0">
                              <p className="text-xs font-semibold">{item.action}</p>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">{item.detail}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.user} • {item.time}</p>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

          </div>
        </ScrollArea>
      </Tabs>

      {/* ── Note Dialog ── */}
      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editNote ? "Edit Note" : "Add Medical Note"}</DialogTitle>
            <DialogDescription>Add a clinical observation for {patient.name}.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Note Type</FieldLabel>
              <Select value={noteForm.type} onValueChange={v => setNoteForm({ ...noteForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Note">General Note</SelectItem>
                  <SelectItem value="Clinical Observation">Clinical Observation</SelectItem>
                  <SelectItem value="Follow-up Required">Follow-up Required</SelectItem>
                  <SelectItem value="Adverse Event">Adverse Event</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Note *</FieldLabel>
              <Textarea placeholder="Enter your note here..." rows={4} value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote}>{editNote ? "Update Note" : "Save Note"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Upload Dialog ── */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document for {patient.name}.</DialogDescription>
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
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-primary font-medium">click to browse</span></p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG up to 10MB</p>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsUploadOpen(false); toast.success("Document uploaded successfully") }}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
