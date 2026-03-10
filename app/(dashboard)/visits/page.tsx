"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  X,
  XCircle,
  UserCheck,
  ArrowUpDown,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

type VisitStatus = "scheduled" | "confirmed" | "completed" | "missed" | "rescheduled" | "cancelled"
type ConfirmationStatus = "confirmed" | "pending" | "not_confirmed" | "unavailable" | "reschedule_requested"

interface Visit {
  id: string
  patient: { name: string; id: string; initials: string; phone: string }
  study: string
  sponsor: string
  visitName: string
  visitType: "Screening" | "Routine" | "Follow-up" | "Final Visit" | "Baseline"
  date: string
  dateISO: string
  time: string
  window: string
  status: VisitStatus
  confirmationStatus: ConfirmationStatus
  assignedDoctor: string
  assignedCoordinator: string
  aiCallResult: string | null
  procedures: string[]
  notes: string
}

// ─── Procedure buckets per visit type ─────────────────────────────────────────
const PROCEDURE_MAP: Record<string, string[]> = {
  Screening: ["Informed Consent", "Medical History", "Screening Labs", "Physical Exam"],
  Baseline: ["Vital Signs", "Baseline Labs", "ECG", "Full Physical"],
  Routine: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
  "Follow-up": ["Blood Draw", "ECG", "Quality of Life Survey", "Safety Assessment"],
  "Final Visit": ["Final Assessment", "Lab Work", "Exit Interview", "Drug Return"],
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialVisits: Visit[] = [
  {
    id: "V-2024-001", patient: { name: "John Smith", id: "PT-1001", initials: "JS", phone: "+1 (555) 111-2222" },
    study: "BEACON-2024", sponsor: "Pfizer Inc.", visitName: "Visit 3 – Follow-up", visitType: "Follow-up",
    date: "Mar 12, 2024", dateISO: "2024-03-12", time: "09:00 AM", window: "Day 42 ± 7",
    status: "confirmed", confirmationStatus: "confirmed",
    assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
    aiCallResult: "Patient confirmed attendance",
    procedures: ["Blood Draw", "ECG", "Quality of Life Survey", "Safety Assessment"],
    notes: "Patient doing well, no AEs reported at last visit.",
  },
  {
    id: "V-2024-002", patient: { name: "Emily Johnson", id: "PT-1002", initials: "EJ", phone: "+1 (555) 222-3333" },
    study: "AURORA-Phase2", sponsor: "Novartis AG", visitName: "Screening", visitType: "Screening",
    date: "Mar 12, 2024", dateISO: "2024-03-12", time: "10:30 AM", window: "Day -14 to -1",
    status: "scheduled", confirmationStatus: "pending",
    assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee",
    aiCallResult: null,
    procedures: ["Informed Consent", "Medical History", "Screening Labs", "Physical Exam"],
    notes: "",
  },
  {
    id: "V-2024-003", patient: { name: "Michael Chen", id: "PT-1003", initials: "MC", phone: "+1 (555) 333-4444" },
    study: "BEACON-2024", sponsor: "Pfizer Inc.", visitName: "Visit 5 – Treatment", visitType: "Routine",
    date: "Mar 12, 2024", dateISO: "2024-03-12", time: "02:00 PM", window: "Day 70 ± 7",
    status: "confirmed", confirmationStatus: "confirmed",
    assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
    aiCallResult: "Confirmed via AI call",
    procedures: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
    notes: "Study drug dispensed at last visit.",
  },
  {
    id: "V-2024-004", patient: { name: "Sarah Williams", id: "PT-1004", initials: "SW", phone: "+1 (555) 444-5555" },
    study: "NOVA-Trial", sponsor: "Roche Ltd.", visitName: "Visit 2 – Assessment", visitType: "Routine",
    date: "Mar 14, 2024", dateISO: "2024-03-14", time: "09:30 AM", window: "Day 28 ± 3",
    status: "rescheduled", confirmationStatus: "reschedule_requested",
    assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez",
    aiCallResult: "Patient requested new date – work conflict",
    procedures: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
    notes: "Originally scheduled Mar 13. Patient requested rescheduling.",
  },
  {
    id: "V-2024-005", patient: { name: "David Brown", id: "PT-1005", initials: "DB", phone: "+1 (555) 555-6666" },
    study: "AURORA-Phase2", sponsor: "Novartis AG", visitName: "Visit 1 – Baseline", visitType: "Baseline",
    date: "Mar 13, 2024", dateISO: "2024-03-13", time: "11:00 AM", window: "Day 1",
    status: "scheduled", confirmationStatus: "pending",
    assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee",
    aiCallResult: null,
    procedures: ["Vital Signs", "Baseline Labs", "ECG", "Full Physical"],
    notes: "",
  },
  {
    id: "V-2024-006", patient: { name: "Lisa Anderson", id: "PT-1006", initials: "LA", phone: "+1 (555) 666-7777" },
    study: "MERIDIAN-2024", sponsor: "AstraZeneca", visitName: "Screening", visitType: "Screening",
    date: "Mar 14, 2024", dateISO: "2024-03-14", time: "10:00 AM", window: "Day -14 to -1",
    status: "scheduled", confirmationStatus: "not_confirmed",
    assignedDoctor: "Dr. Anna Roberts", assignedCoordinator: "David Kim",
    aiCallResult: "No answer – 3 call attempts",
    procedures: ["Informed Consent", "Medical History", "Screening Labs", "Physical Exam"],
    notes: "Reached out via SMS after failed calls.",
  },
  {
    id: "V-2024-007", patient: { name: "Robert Martinez", id: "PT-1007", initials: "RM", phone: "+1 (555) 777-8888" },
    study: "NOVA-Trial", sponsor: "Roche Ltd.", visitName: "Visit 8 – End of Study", visitType: "Final Visit",
    date: "Mar 14, 2024", dateISO: "2024-03-14", time: "02:30 PM", window: "Day 168 ± 7",
    status: "confirmed", confirmationStatus: "confirmed",
    assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez",
    aiCallResult: "Patient confirmed attendance",
    procedures: ["Final Assessment", "Lab Work", "Exit Interview", "Drug Return"],
    notes: "Last visit for this patient in NOVA-Trial.",
  },
  {
    id: "V-2024-008", patient: { name: "Jennifer Taylor", id: "PT-1008", initials: "JT", phone: "+1 (555) 888-9999" },
    study: "BEACON-2024", sponsor: "Pfizer Inc.", visitName: "Visit 4 – Treatment", visitType: "Routine",
    date: "Mar 15, 2024", dateISO: "2024-03-15", time: "09:00 AM", window: "Day 56 ± 7",
    status: "missed", confirmationStatus: "not_confirmed",
    assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
    aiCallResult: "Patient did not attend – calling to reschedule",
    procedures: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
    notes: "Follow-up call scheduled for same day.",
  },
  {
    id: "V-2024-009", patient: { name: "James Wilson", id: "PT-1009", initials: "JW", phone: "+1 (555) 999-0000" },
    study: "AURORA-Phase2", sponsor: "Novartis AG", visitName: "Visit 3 – Follow-up", visitType: "Follow-up",
    date: "Mar 18, 2024", dateISO: "2024-03-18", time: "10:00 AM", window: "Day 56 ± 7",
    status: "scheduled", confirmationStatus: "pending",
    assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee",
    aiCallResult: null,
    procedures: ["Blood Draw", "ECG", "Quality of Life Survey", "Safety Assessment"],
    notes: "",
  },
  {
    id: "V-2024-010", patient: { name: "Maria Garcia", id: "PT-1010", initials: "MG", phone: "+1 (555) 100-2000" },
    study: "BEACON-2024", sponsor: "Pfizer Inc.", visitName: "Visit 6 – Treatment", visitType: "Routine",
    date: "Mar 18, 2024", dateISO: "2024-03-18", time: "01:30 PM", window: "Day 84 ± 7",
    status: "confirmed", confirmationStatus: "confirmed",
    assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
    aiCallResult: "Patient confirmed via portal",
    procedures: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
    notes: "",
  },
  {
    id: "V-2024-011", patient: { name: "Thomas Lee", id: "PT-1011", initials: "TL", phone: "+1 (555) 200-3000" },
    study: "NOVA-Trial", sponsor: "Roche Ltd.", visitName: "Visit 4 – Assessment", visitType: "Routine",
    date: "Mar 20, 2024", dateISO: "2024-03-20", time: "09:00 AM", window: "Day 56 ± 3",
    status: "scheduled", confirmationStatus: "pending",
    assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez",
    aiCallResult: null,
    procedures: ["Vital Signs", "Blood Draw", "AE Assessment", "Medication Review"],
    notes: "",
  },
  {
    id: "V-2024-012", patient: { name: "Nancy White", id: "PT-1012", initials: "NW", phone: "+1 (555) 300-4000" },
    study: "MERIDIAN-2024", sponsor: "AstraZeneca", visitName: "Visit 1 – Baseline", visitType: "Baseline",
    date: "Mar 20, 2024", dateISO: "2024-03-20", time: "11:00 AM", window: "Day 1",
    status: "completed", confirmationStatus: "confirmed",
    assignedDoctor: "Dr. Anna Roberts", assignedCoordinator: "David Kim",
    aiCallResult: "Confirmed via AI call",
    procedures: ["Vital Signs", "Baseline Labs", "ECG", "Full Physical"],
    notes: "Baseline completed successfully.",
  },
  {
    id: "V-2024-013", patient: { name: "Christopher Davis", id: "PT-1013", initials: "CD", phone: "+1 (555) 400-5000" },
    study: "BEACON-2024", sponsor: "Pfizer Inc.", visitName: "Visit 7 – Follow-up", visitType: "Follow-up",
    date: "Mar 22, 2024", dateISO: "2024-03-22", time: "03:00 PM", window: "Day 98 ± 7",
    status: "cancelled", confirmationStatus: "unavailable",
    assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
    aiCallResult: "Patient withdrew from study",
    procedures: ["Blood Draw", "ECG", "Quality of Life Survey", "Safety Assessment"],
    notes: "Patient withdrew consent on Mar 20.",
  },
]

const ALL_STUDIES = [...new Set(initialVisits.map(v => v.study))]
const statusConfig: Record<VisitStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-0" },
  confirmed: { label: "Confirmed", className: "bg-success/10 text-success border-0" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-0" },
  missed: { label: "Missed", className: "bg-destructive/10 text-destructive border-0" },
  rescheduled: { label: "Rescheduled", className: "bg-warning/10 text-warning border-0" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-0" },
}
const confirmConfig: Record<ConfirmationStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-success/10 text-success border-0" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-0" },
  not_confirmed: { label: "Not Confirmed", className: "bg-destructive/10 text-destructive border-0" },
  unavailable: { label: "Unavailable", className: "bg-destructive/10 text-destructive border-0" },
  reschedule_requested: { label: "Reschedule Req.", className: "bg-primary/10 text-primary border-0" },
}

const PAGE_SIZE = 8
const emptyScheduleForm = {
  patientId: "", visitName: "", visitType: "Screening" as Visit["visitType"],
  date: "", time: "09:00 AM", window: "", doctor: "", coordinator: "", notes: "",
  procedures: [] as string[],
}
const emptyRescheduleForm = { date: "", time: "", reason: "", notifySponsor: false }

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>(initialVisits)
  const [search, setSearch] = useState("")
  const [studyFilter, setStudyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  // dialog state
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isAICallOpen, setIsAICallOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [scheduleErrors, setScheduleErrors] = useState<Record<string, string>>({})
  const [scheduleForm, setScheduleForm] = useState({ ...emptyScheduleForm })
  const [rescheduleForm, setRescheduleForm] = useState({ ...emptyRescheduleForm })
  const [emailContent, setEmailContent] = useState("")

  // ─── Filtering + sorting + pagination ────────────────────────────────────
  const filtered = useMemo(() => {
    return visits
      .filter(v => {
        const q = search.toLowerCase()
        const matchSearch = v.patient.name.toLowerCase().includes(q) ||
          v.patient.id.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
        const matchStudy = studyFilter === "all" || v.study === studyFilter
        const matchStatus = statusFilter === "all" || v.status === statusFilter
        const matchFrom = !dateFrom || v.dateISO >= dateFrom
        const matchTo = !dateTo || v.dateISO <= dateTo
        return matchSearch && matchStudy && matchStatus && matchFrom && matchTo
      })
      .sort((a, b) => {
        const diff = a.dateISO.localeCompare(b.dateISO)
        return sortAsc ? diff : -diff
      })
  }, [visits, search, studyFilter, statusFilter, dateFrom, dateTo, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total: visits.filter(v => v.status !== "cancelled").length,
    confirmed: visits.filter(v => v.status === "confirmed").length,
    pending: visits.filter(v => v.status === "scheduled").length,
    attention: visits.filter(v => ["not_confirmed", "missed"].includes(v.status)).length,
  }

  // ─── Actions ─────────────────────────────────────────────────────────────
  const updateVisit = (id: string, patch: Partial<Visit>) =>
    setVisits(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v))

  const handleConfirm = (v: Visit) => {
    updateVisit(v.id, { status: "confirmed", confirmationStatus: "confirmed", aiCallResult: "Manually confirmed by coordinator" })
    toast.success(`Visit ${v.id} confirmed`)
  }
  const handleMarkCompleted = (v: Visit) => {
    updateVisit(v.id, { status: "completed", confirmationStatus: "confirmed" })
    toast.success(`Visit ${v.id} marked as completed`)
  }
  const handleCancel = () => {
    if (!selectedVisit) return
    updateVisit(selectedVisit.id, { status: "cancelled", aiCallResult: "Visit cancelled by coordinator" })
    setIsCancelOpen(false); setSelectedVisit(null); toast.success("Visit cancelled")
  }
  const handleReschedule = () => {
    if (!selectedVisit || !rescheduleForm.date) { toast.error("Please select a new date"); return }
    const formatted = new Date(rescheduleForm.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    updateVisit(selectedVisit.id, {
      date: formatted, dateISO: rescheduleForm.date,
      time: rescheduleForm.time || selectedVisit.time,
      status: "rescheduled", confirmationStatus: "reschedule_requested",
      aiCallResult: rescheduleForm.reason || "Rescheduled by coordinator",
    })
    if (rescheduleForm.notifySponsor) toast.info(`Sponsor ${selectedVisit.sponsor} notified of reschedule`)
    setIsRescheduleOpen(false); setSelectedVisit(null); setRescheduleForm({ ...emptyRescheduleForm })
    toast.success("Visit rescheduled successfully")
  }
  const handleAICall = () => {
    if (!selectedVisit) return
    setIsAICallOpen(false)
    toast.loading("AI calling patient…", { duration: 2000 })
    setTimeout(() => {
      const responses = ["Patient confirmed attendance", "Patient requested callback", "Left voicemail – will retry", "No answer – 3 attempts"]
      const r = responses[Math.floor(Math.random() * responses.length)]
      const isConfirmed = r.includes("confirmed")
      updateVisit(selectedVisit.id, {
        status: isConfirmed ? "confirmed" : selectedVisit.status,
        confirmationStatus: isConfirmed ? "confirmed" : "not_confirmed",
        aiCallResult: r,
      })
      toast.success(`AI call completed: ${r}`)
      setSelectedVisit(null)
    }, 2100)
  }
  const handleSendEmail = () => {
    if (!selectedVisit) return
    setIsEmailOpen(false); setEmailContent(""); toast.success(`Email sent to ${selectedVisit.patient.name}`)
    setSelectedVisit(null)
  }

  // ─── Schedule Visit ───────────────────────────────────────────────────────
  const validateSchedule = () => {
    const errs: Record<string, string> = {}
    if (!scheduleForm.patientId) errs.patientId = "Patient is required"
    if (!scheduleForm.visitName.trim()) errs.visitName = "Visit name is required"
    if (!scheduleForm.date) errs.date = "Visit date is required"
    setScheduleErrors(errs)
    return Object.keys(errs).length === 0
  }
  const handleScheduleVisit = () => {
    if (!validateSchedule()) return
    const patient = initialVisits.find(v => v.patient.id === scheduleForm.patientId)?.patient ||
      { name: scheduleForm.patientId, id: scheduleForm.patientId, initials: "?", phone: "" }
    const formatted = new Date(scheduleForm.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    const newVisit: Visit = {
      id: `V-2024-${String(visits.length + 1).padStart(3, "0")}`,
      patient,
      study: "BEACON-2024", sponsor: "Pfizer Inc.",
      visitName: scheduleForm.visitName, visitType: scheduleForm.visitType,
      date: formatted, dateISO: scheduleForm.date, time: scheduleForm.time || "09:00 AM",
      window: scheduleForm.window || "—",
      status: "scheduled", confirmationStatus: "pending",
      assignedDoctor: scheduleForm.doctor || "—",
      assignedCoordinator: scheduleForm.coordinator || "—",
      aiCallResult: null, notes: scheduleForm.notes,
      procedures: scheduleForm.procedures.length ? scheduleForm.procedures : PROCEDURE_MAP[scheduleForm.visitType] || [],
    }
    setVisits(prev => [newVisit, ...prev])
    setIsScheduleOpen(false); setScheduleForm({ ...emptyScheduleForm }); setScheduleErrors({})
    toast.success(`Visit ${newVisit.id} scheduled successfully`)
  }
  const toggleProcedure = (p: string) => {
    setScheduleForm(prev => ({
      ...prev,
      procedures: prev.procedures.includes(p) ? prev.procedures.filter(x => x !== p) : [...prev.procedures, p],
    }))
  }

  const openEmail = (v: Visit) => {
    setSelectedVisit(v)
    setEmailContent(`Dear ${v.patient.name},\n\nThis is a reminder about your upcoming visit scheduled for ${v.date} at ${v.time}.\n\nVisit: ${v.visitName}\nStudy: ${v.study}\n\nPlease confirm your attendance or contact us if you need to reschedule.\n\nBest regards,\nClinical Trial Team`)
    setIsEmailOpen(true)
  }

  return (
    <>
      <DashboardHeader title="Visits" description="Manage and track all patient visit schedules" />
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total This Week", value: stats.total, colorClass: "bg-primary/10 text-primary", icon: Calendar },
            { label: "Confirmed", value: stats.confirmed, colorClass: "bg-success/10 text-success", icon: CheckCircle2 },
            { label: "Pending", value: stats.pending, colorClass: "bg-warning/10 text-warning", icon: Clock },
            { label: "Needs Attention", value: stats.attention, colorClass: "bg-destructive/10 text-destructive", icon: XCircle },
          ].map(s => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${s.colorClass}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ── Filters row ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by patient name, ID, or visit ID…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="pl-8 w-full" />
          </div>
          <Select value={studyFilter} onValueChange={v => { setStudyFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Studies" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Studies</SelectItem>
              {ALL_STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.keys(statusConfig) as VisitStatus[]).map(s => (
                <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Input type="date" className="w-[140px]" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1) }} placeholder="From" />
            <span className="text-muted-foreground text-sm">—</span>
            <Input type="date" className="w-[140px]" value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1) }} placeholder="To" />
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSortAsc(p => !p)}>
              <ArrowUpDown className="mr-2 size-4" />
              {sortAsc ? "Oldest First" : "Newest First"}
            </Button>
            <Button size="sm" onClick={() => { setScheduleForm({ ...emptyScheduleForm }); setScheduleErrors({}); setIsScheduleOpen(true) }}>
              <Plus className="mr-2 size-4" />Schedule Visit
            </Button>
          </div>
        </div>

        {/* ── Table ── */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Study</TableHead>
                  <TableHead>Visit Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Visit Status</TableHead>
                  <TableHead>Confirmation</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                      No visits found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map(visit => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{visit.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{visit.patient.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{visit.patient.name}</p>
                            <p className="text-xs text-muted-foreground">{visit.patient.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{visit.study}</p>
                        <p className="text-xs text-muted-foreground">{visit.sponsor}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{visit.visitName}</p>
                        <p className="text-xs text-muted-foreground">{visit.visitType}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{visit.date}</p>
                        <p className="text-xs text-muted-foreground">{visit.time}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{visit.window}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[visit.status].className + " text-[10px]"}>
                          {statusConfig[visit.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={confirmConfig[visit.confirmationStatus].className + " text-[10px]"}>
                          {confirmConfig[visit.confirmationStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium">{visit.assignedDoctor}</p>
                        <p className="text-xs text-muted-foreground">{visit.assignedCoordinator}</p>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/visits/${visit.id}`}>
                                <Eye className="mr-2 size-4" />View Details
                              </Link>
                            </DropdownMenuItem>
                            {visit.status !== "confirmed" && visit.status !== "cancelled" && visit.status !== "completed" && (
                              <DropdownMenuItem onClick={() => handleConfirm(visit)}>
                                <Check className="mr-2 size-4" />Confirm Visit
                              </DropdownMenuItem>
                            )}
                            {visit.status !== "completed" && visit.status !== "cancelled" && (
                              <DropdownMenuItem onClick={() => handleMarkCompleted(visit)}>
                                <CheckCircle2 className="mr-2 size-4" />Mark Completed
                              </DropdownMenuItem>
                            )}
                            {visit.status !== "cancelled" && (
                              <DropdownMenuItem onClick={() => { setSelectedVisit(visit); setRescheduleForm({ ...emptyRescheduleForm }); setIsRescheduleOpen(true) }}>
                                <Clock className="mr-2 size-4" />Reschedule
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => { setSelectedVisit(visit); setIsAICallOpen(true) }}>
                              <Bot className="mr-2 size-4" />AI Voice Call
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEmail(visit)}>
                              <Mail className="mr-2 size-4" />Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {visit.status !== "cancelled" && (
                              <DropdownMenuItem className="text-destructive"
                                onClick={() => { setSelectedVisit(visit); setIsCancelOpen(true) }}>
                                <X className="mr-2 size-4" />Cancel Visit
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

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} visits
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <Button key={n} variant={page === n ? "default" : "outline"} size="icon" className="size-8"
                  onClick={() => setPage(n)}>{n}</Button>
              ))}
              <Button variant="outline" size="icon" className="size-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ DIALOGS */}

        {/* ── Schedule Visit Dialog ── */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Visit</DialogTitle>
              <DialogDescription>Fill in visit details to schedule a patient visit.</DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-2 space-y-6">
              {/* Patient & Study */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Patient & Study</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2">
                    <FieldLabel>Patient *</FieldLabel>
                    <Select value={scheduleForm.patientId} onValueChange={v => setScheduleForm(f => ({ ...f, patientId: v }))}>
                      <SelectTrigger className={scheduleErrors.patientId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Map(initialVisits.map(v => [v.patient.id, v.patient])).values()].map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {scheduleErrors.patientId && <p className="text-xs text-destructive mt-1">{scheduleErrors.patientId}</p>}
                  </Field>
                </div>
              </div>
              {/* Visit Info */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Visit Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Visit Name *</FieldLabel>
                    <Input placeholder="e.g. Visit 3 – Follow-up" value={scheduleForm.visitName}
                      onChange={e => setScheduleForm(f => ({ ...f, visitName: e.target.value }))}
                      className={scheduleErrors.visitName ? "border-destructive" : ""} />
                    {scheduleErrors.visitName && <p className="text-xs text-destructive mt-1">{scheduleErrors.visitName}</p>}
                  </Field>
                  <Field>
                    <FieldLabel>Visit Type</FieldLabel>
                    <Select value={scheduleForm.visitType}
                      onValueChange={v => setScheduleForm(f => ({ ...f, visitType: v as Visit["visitType"], procedures: [] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Screening", "Baseline", "Routine", "Follow-up", "Final Visit"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Visit Date *</FieldLabel>
                    <Input type="date" value={scheduleForm.date}
                      onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))}
                      className={scheduleErrors.date ? "border-destructive" : ""} />
                    {scheduleErrors.date && <p className="text-xs text-destructive mt-1">{scheduleErrors.date}</p>}
                  </Field>
                  <Field>
                    <FieldLabel>Visit Time</FieldLabel>
                    <Select value={scheduleForm.time} onValueChange={v => setScheduleForm(f => ({ ...f, time: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["08:00 AM", "09:00 AM", "10:00 AM", "10:30 AM", "11:00 AM", "01:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"].map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel>Visit Window</FieldLabel>
                    <Input placeholder="e.g. Day 42 ± 7" value={scheduleForm.window}
                      onChange={e => setScheduleForm(f => ({ ...f, window: e.target.value }))} />
                  </Field>
                </div>
              </div>
              {/* Staff */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Staff Assignment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Assigned Doctor</FieldLabel>
                    <Select value={scheduleForm.doctor} onValueChange={v => setScheduleForm(f => ({ ...f, doctor: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                      <SelectContent>
                        {["Dr. Sarah Chen", "Dr. Michael Park", "Dr. James Wilson", "Dr. Anna Roberts"].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Assigned Coordinator</FieldLabel>
                    <Select value={scheduleForm.coordinator} onValueChange={v => setScheduleForm(f => ({ ...f, coordinator: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select coordinator" /></SelectTrigger>
                      <SelectContent>
                        {["Emily Rodriguez", "Jessica Lee", "Maria Lopez", "David Kim"].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
              {/* Procedures */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">
                  Required Procedures <span className="normal-case font-normal text-muted-foreground">(pre-filled from visit type)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {(PROCEDURE_MAP[scheduleForm.visitType] || []).map(p => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={scheduleForm.procedures.includes(p) || scheduleForm.procedures.length === 0}
                        onCheckedChange={() => {
                          const base = scheduleForm.procedures.length === 0 ? PROCEDURE_MAP[scheduleForm.visitType] || [] : scheduleForm.procedures
                          const updated = base.includes(p) ? base.filter(x => x !== p) : [...base, p]
                          setScheduleForm(f => ({ ...f, procedures: updated }))
                        }} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              {/* Notes */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Additional Details</h4>
                <Field>
                  <FieldLabel>Visit Notes</FieldLabel>
                  <Textarea placeholder="Any relevant notes for this visit…" rows={3}
                    value={scheduleForm.notes} onChange={e => setScheduleForm(f => ({ ...f, notes: e.target.value }))} />
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
              <Button onClick={handleScheduleVisit}><Plus className="mr-2 size-4" />Schedule Visit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Reschedule Dialog ── */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Visit</DialogTitle>
              <DialogDescription>Select a new date and time for {selectedVisit?.patient.name}&apos;s visit.</DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>New Visit Date *</FieldLabel>
                <Input type="date" value={rescheduleForm.date}
                  onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))} />
              </Field>
              <Field>
                <FieldLabel>New Visit Time</FieldLabel>
                <Select value={rescheduleForm.time} onValueChange={v => setRescheduleForm(f => ({ ...f, time: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Reason for Reschedule</FieldLabel>
                <Textarea placeholder="Enter reason…" rows={3} value={rescheduleForm.reason}
                  onChange={e => setRescheduleForm(f => ({ ...f, reason: e.target.value }))} />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={rescheduleForm.notifySponsor}
                  onCheckedChange={v => setRescheduleForm(f => ({ ...f, notifySponsor: !!v }))} />
                <div>
                  <p className="text-sm font-medium">Notify Sponsor</p>
                  <p className="text-xs text-muted-foreground">Send an automatic notification to {selectedVisit?.sponsor}</p>
                </div>
              </label>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
              <Button onClick={handleReschedule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Cancel Confirmation ── */}
        <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Visit</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel {selectedVisit?.patient.name}&apos;s visit on {selectedVisit?.date}? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Visit</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Cancel Visit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── AI Call Dialog ── */}
        <Dialog open={isAICallOpen} onOpenChange={setIsAICallOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>AI Voice Confirmation Call</DialogTitle>
              <DialogDescription>The AI will call the patient and ask them to confirm their visit.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex flex-col items-center gap-4 rounded-lg border p-6 bg-muted/30">
                <div className="size-16 flex items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{selectedVisit?.patient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedVisit?.patient.phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">Visit: {selectedVisit?.date} at {selectedVisit?.time}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedVisit?.visitName} · {selectedVisit?.study}</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  The AI will call 1–2 days before the visit, ask for confirmation, and record the patient response automatically.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAICallOpen(false)}>Cancel</Button>
              <Button onClick={handleAICall}><Phone className="mr-2 size-4" />Start AI Call</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Email Dialog ── */}
        <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Email Notification</DialogTitle>
              <DialogDescription>Send a visit reminder to {selectedVisit?.patient.name}.</DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>To</FieldLabel>
                <Input value={`${selectedVisit?.patient.name} <patient@email.com>`} disabled />
              </Field>
              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Input defaultValue={`Visit Reminder — ${selectedVisit?.visitName} on ${selectedVisit?.date}`} />
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea rows={8} value={emailContent} onChange={e => setEmailContent(e.target.value)} />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailOpen(false)}>Cancel</Button>
              <Button onClick={handleSendEmail}><Mail className="mr-2 size-4" />Send Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
