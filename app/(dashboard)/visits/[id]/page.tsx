"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
    ArrowLeft, Bot, Calendar, Check, CheckCircle2, Clock, Download,
    Edit2, Eye, FileText, Mail, MoreHorizontal, Phone, Plus, Upload,
    UserCheck, Users, X, XCircle, AlertTriangle, Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

type VisitStatus = "scheduled" | "confirmed" | "completed" | "missed" | "rescheduled" | "cancelled"
type ConfirmationStatus = "confirmed" | "pending" | "not_confirmed" | "unavailable" | "reschedule_requested"

interface Procedure { id: string; name: string; completed: boolean; notes: string }
interface VisitDocument { id: string; name: string; type: string; uploadedBy: string; date: string; size: string }
interface AICall { id: string; attemptDate: string; result: string; duration: string; response: string }
interface ActivityEntry { action: string; detail: string; user: string; time: string; icon: typeof CheckCircle2; color: string }

interface VisitDetail {
    id: string
    visitName: string
    visitType: string
    date: string
    time: string
    window: string
    status: VisitStatus
    confirmationStatus: ConfirmationStatus
    patient: { id: string; name: string; initials: string; age: number; gender: string; phone: string; study: string; sponsor: string }
    assignedDoctor: string
    assignedCoordinator: string
    aiCallResult: string | null
    notes: string
    procedures: Procedure[]
    documents: VisitDocument[]
    aiCalls: AICall[]
    activity: ActivityEntry[]
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const visitsDB: Record<string, VisitDetail> = {
    "V-2024-001": {
        id: "V-2024-001", visitName: "Visit 3 – Follow-up", visitType: "Follow-up",
        date: "Mar 12, 2024", time: "09:00 AM", window: "Day 42 ± 7",
        status: "confirmed", confirmationStatus: "confirmed",
        patient: { id: "PT-1001", name: "John Smith", initials: "JS", age: 54, gender: "Male", phone: "+1 (555) 111-2222", study: "BEACON-2024", sponsor: "Pfizer Inc." },
        assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez",
        aiCallResult: "Patient confirmed attendance",
        notes: "Patient doing well. No adverse events at last visit. Ensure blood sample collected before medication administration.",
        procedures: [
            { id: "P-001", name: "Blood Draw", completed: true, notes: "Collected 4 tubes — EDTA, SST x2, citrate" },
            { id: "P-002", name: "ECG", completed: true, notes: "12-lead ECG. Normal sinus rhythm." },
            { id: "P-003", name: "Quality of Life Survey", completed: false, notes: "" },
            { id: "P-004", name: "Safety Assessment", completed: false, notes: "" },
        ],
        documents: [
            { id: "D-001", name: "Visit 3 Lab Results", type: "Lab Report", uploadedBy: "Lab System", date: "Mar 12, 2024", size: "312 KB" },
            { id: "D-002", name: "ECG Trace – V3", type: "ECG Report", uploadedBy: "Dr. Sarah Chen", date: "Mar 12, 2024", size: "145 KB" },
            { id: "D-003", name: "AE Assessment Form", type: "AE Form", uploadedBy: "Emily Rodriguez", date: "Mar 12, 2024", size: "56 KB" },
        ],
        aiCalls: [
            { id: "C-001", attemptDate: "Mar 10, 2024 at 10:00 AM", result: "Confirmed", duration: "1m 42s", response: "Patient confirmed attendance for March 12 at 9:00 AM. Patient indicated no new symptoms to report." },
        ],
        activity: [
            { action: "Visit confirmed by patient", detail: "AI call confirmed attendance for Visit 3", user: "AI System", time: "Mar 10, 2024 at 10:02 AM", icon: CheckCircle2, color: "text-success" },
            { action: "AI call initiated", detail: "Automated confirmation call placed to +1 (555) 111-2222", user: "AI System", time: "Mar 10, 2024 at 10:00 AM", icon: Bot, color: "text-primary" },
            { action: "Email reminder sent", detail: "Visit reminder email sent to john.smith@email.com", user: "Emily Rodriguez", time: "Mar 09, 2024 at 4:00 PM", icon: Mail, color: "text-primary" },
            { action: "Visit scheduled", detail: "Visit 3 – Follow-up scheduled for Mar 12", user: "Emily Rodriguez", time: "Feb 01, 2024 at 9:00 AM", icon: Calendar, color: "text-primary" },
        ],
    },
    "V-2024-002": {
        id: "V-2024-002", visitName: "Screening", visitType: "Screening",
        date: "Mar 12, 2024", time: "10:30 AM", window: "Day -14 to -1",
        status: "scheduled", confirmationStatus: "pending",
        patient: { id: "PT-1002", name: "Emily Johnson", initials: "EJ", age: 42, gender: "Female", phone: "+1 (555) 222-3333", study: "AURORA-Phase2", sponsor: "Novartis AG" },
        assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee",
        aiCallResult: null,
        notes: "Initial screening visit. Ensure informed consent is obtained before any procedures.",
        procedures: [
            { id: "P-001", name: "Informed Consent", completed: false, notes: "" },
            { id: "P-002", name: "Medical History", completed: false, notes: "" },
            { id: "P-003", name: "Screening Labs", completed: false, notes: "" },
            { id: "P-004", name: "Physical Exam", completed: false, notes: "" },
        ],
        documents: [],
        aiCalls: [],
        activity: [
            { action: "Visit scheduled", detail: "Screening visit scheduled for Mar 12", user: "Jessica Lee", time: "Feb 15, 2024 at 2:00 PM", icon: Calendar, color: "text-primary" },
        ],
    },
    "V-2024-004": {
        id: "V-2024-004", visitName: "Visit 2 – Assessment", visitType: "Routine",
        date: "Mar 14, 2024", time: "09:30 AM", window: "Day 28 ± 3",
        status: "rescheduled", confirmationStatus: "reschedule_requested",
        patient: { id: "PT-1004", name: "Sarah Williams", initials: "SW", age: 38, gender: "Female", phone: "+1 (555) 444-5555", study: "NOVA-Trial", sponsor: "Roche Ltd." },
        assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez",
        aiCallResult: "Patient requested new date – work conflict",
        notes: "Originally scheduled Mar 13. Rescheduled due to patient work conflict.",
        procedures: [
            { id: "P-001", name: "Vital Signs", completed: false, notes: "" },
            { id: "P-002", name: "Blood Draw", completed: false, notes: "" },
            { id: "P-003", name: "AE Assessment", completed: false, notes: "" },
            { id: "P-004", name: "Medication Review", completed: false, notes: "" },
        ],
        documents: [],
        aiCalls: [
            { id: "C-001", attemptDate: "Mar 11, 2024 at 09:00 AM", result: "Reschedule Requested", duration: "2m 15s", response: "Patient confirmed they cannot attend on Mar 13 due to a work meeting. Requested rescheduling to Mar 14 or later." },
        ],
        activity: [
            { action: "Visit rescheduled", detail: "Visit moved from Mar 13 to Mar 14 — patient work conflict", user: "Maria Lopez", time: "Mar 11, 2024 at 10:00 AM", icon: Clock, color: "text-warning" },
            { action: "Reschedule requested via AI call", detail: "Patient requested new date due to work conflict", user: "AI System", time: "Mar 11, 2024 at 09:02 AM", icon: Bot, color: "text-primary" },
            { action: "Visit scheduled", detail: "Visit 2 – Assessment scheduled for Mar 13", user: "Maria Lopez", time: "Feb 01, 2024 at 9:00 AM", icon: Calendar, color: "text-primary" },
        ],
    },
}

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

const aiResultStyle = (result: string) => {
    if (result.toLowerCase().includes("confirmed")) return "text-success"
    if (result.toLowerCase().includes("reschedule")) return "text-warning"
    return "text-destructive"
}

const TAB_CLASS = "rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"

export default function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const visitData = visitsDB[id] || visitsDB["V-2024-001"]

    const [visit, setVisit] = useState<VisitDetail>(visitData)
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)
    const [isAICallOpen, setIsAICallOpen] = useState(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "", reason: "", notifySponsor: false })

    const completedProcs = visit.procedures.filter(p => p.completed).length
    const procPct = visit.procedures.length === 0 ? 0 : Math.round((completedProcs / visit.procedures.length) * 100)

    const toggleProcedure = (procId: string) => {
        setVisit(v => ({ ...v, procedures: v.procedures.map(p => p.id === procId ? { ...p, completed: !p.completed } : p) }))
    }
    const updateProcNote = (procId: string, notes: string) => {
        setVisit(v => ({ ...v, procedures: v.procedures.map(p => p.id === procId ? { ...p, notes } : p) }))
    }

    const handleConfirm = () => {
        setVisit(v => ({ ...v, status: "confirmed", confirmationStatus: "confirmed", aiCallResult: "Manually confirmed by coordinator" }))
        toast.success("Visit confirmed")
    }
    const handleMarkCompleted = () => {
        setVisit(v => ({ ...v, status: "completed" }))
        toast.success("Visit marked as completed")
    }
    const handleCancel = () => {
        setVisit(v => ({ ...v, status: "cancelled", aiCallResult: "Visit cancelled by coordinator" }))
        setIsCancelOpen(false); toast.success("Visit cancelled")
    }
    const handleReschedule = () => {
        if (!rescheduleForm.date) { toast.error("Please select a new date"); return }
        const formatted = new Date(rescheduleForm.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        setVisit(v => ({ ...v, date: formatted, dateISO: rescheduleForm.date, time: rescheduleForm.time || v.time, status: "rescheduled", confirmationStatus: "reschedule_requested", aiCallResult: rescheduleForm.reason || "Rescheduled by coordinator" } as typeof v & { dateISO: string }))
        if (rescheduleForm.notifySponsor) toast.info(`Sponsor ${visit.patient.sponsor} notified`)
        setIsRescheduleOpen(false); setRescheduleForm({ date: "", time: "", reason: "", notifySponsor: false })
        toast.success("Visit rescheduled")
    }
    const handleAICall = () => {
        setIsAICallOpen(false)
        toast.loading("AI calling patient…", { duration: 2000 })
        setTimeout(() => {
            const r = "Patient confirmed attendance"
            setVisit(v => ({
                ...v, status: "confirmed", confirmationStatus: "confirmed", aiCallResult: r,
                aiCalls: [{ id: `C-${v.aiCalls.length + 1}`, attemptDate: new Date().toLocaleString(), result: "Confirmed", duration: "1m 38s", response: "Patient confirmed attendance." }, ...v.aiCalls],
            }))
            toast.success(`AI call completed: ${r}`)
        }, 2100)
    }
    const handleDeleteDoc = (docId: string) => {
        setVisit(v => ({ ...v, documents: v.documents.filter(d => d.id !== docId) }))
        toast.success("Document deleted")
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ── Sticky Header ── */}
            <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur sticky top-0 z-10 shrink-0">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/visits"><ArrowLeft className="size-4" /></Link>
                </Button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold">{visit.visitName}</h1>
                        <Badge className={statusConfig[visit.status].className}>{statusConfig[visit.status].label}</Badge>
                        <Badge className={confirmConfig[visit.confirmationStatus].className}>{confirmConfig[visit.confirmationStatus].label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{visit.id}</span><span>•</span>
                        <span>{visit.patient.name}</span><span>•</span>
                        <span>{visit.date} at {visit.time}</span><span>•</span>
                        <span>{visit.patient.study}</span>
                    </div>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                    {visit.status !== "confirmed" && visit.status !== "cancelled" && visit.status !== "completed" && (
                        <Button variant="outline" size="sm" onClick={handleConfirm}><Check className="mr-2 size-4" />Confirm</Button>
                    )}
                    {visit.status !== "completed" && visit.status !== "cancelled" && (
                        <Button variant="outline" size="sm" onClick={handleMarkCompleted}><CheckCircle2 className="mr-2 size-4" />Mark Completed</Button>
                    )}
                    {visit.status !== "cancelled" && (
                        <Button variant="outline" size="sm" onClick={() => setIsRescheduleOpen(true)}><Clock className="mr-2 size-4" />Reschedule</Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setIsAICallOpen(true)}><Bot className="mr-2 size-4" />AI Call</Button>
                    <Button size="sm" onClick={() => toast.success("Email notification sent")}><Mail className="mr-2 size-4" />Send Email</Button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b shrink-0">
                    <TabsList className="bg-transparent h-auto p-0 py-2 gap-2">
                        <TabsTrigger value="overview" className={TAB_CLASS}>Overview</TabsTrigger>
                        <TabsTrigger value="procedures" className={TAB_CLASS}>Procedures ({visit.procedures.length})</TabsTrigger>
                        <TabsTrigger value="documents" className={TAB_CLASS}>Documents ({visit.documents.length})</TabsTrigger>
                        <TabsTrigger value="ai" className={TAB_CLASS}>AI Confirmation</TabsTrigger>
                        <TabsTrigger value="activity" className={TAB_CLASS}>Activity ({visit.activity.length})</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6">

                        {/* ── OVERVIEW ── */}
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Left: info card */}
                                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Visit Information</CardTitle>
                                        <CardDescription>Scheduling and assignment details</CardDescription>
                                    </CardHeader>
                                    <div className="space-y-8 p-6 pt-0">
                                        {/* Visit details */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Visit Details</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                                                {[
                                                    ["Visit ID", visit.id],
                                                    ["Visit Name", visit.visitName],
                                                    ["Visit Type", visit.visitType],
                                                    ["Protocol Window", visit.window],
                                                    ["Date", visit.date],
                                                    ["Time", visit.time],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                                                        <p className="text-sm font-semibold">{value}</p>
                                                    </div>
                                                ))}
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visit Status</p>
                                                    <Badge className={statusConfig[visit.status].className}>{statusConfig[visit.status].label}</Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Confirmation</p>
                                                    <Badge className={confirmConfig[visit.confirmationStatus].className}>{confirmConfig[visit.confirmationStatus].label}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Patient */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Patient Information</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Patient</p>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="size-7">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{visit.patient.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm font-semibold">{visit.patient.name}</p>
                                                    </div>
                                                </div>
                                                {[
                                                    ["Patient ID", visit.patient.id],
                                                    ["Age", `${visit.patient.age} years`],
                                                    ["Gender", visit.patient.gender],
                                                    ["Phone", visit.patient.phone],
                                                    ["Study", visit.patient.study],
                                                    ["Sponsor", visit.patient.sponsor],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                                                        <p className="text-sm font-semibold">{value}</p>
                                                    </div>
                                                ))}
                                                <div className="col-span-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/patients/${visit.patient.id}`}>
                                                            <Eye className="mr-2 size-4" />Open Patient Profile
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Staff */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Assigned Staff</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Doctor / PI</p>
                                                    <p className="text-sm font-semibold">{visit.assignedDoctor}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Coordinator</p>
                                                    <p className="text-sm font-semibold">{visit.assignedCoordinator}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Notes */}
                                        {visit.notes && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Visit Notes</h4>
                                                <p className="text-sm leading-relaxed">{visit.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Right: summary cards */}
                                <div className="space-y-6">
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Activity className="size-5" /></div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">PROCEDURES</Badge>
                                            </div>
                                            <p className="text-3xl font-bold">{completedProcs}/{visit.procedures.length}</p>
                                            <p className="text-sm text-muted-foreground font-medium mb-3">Completed</p>
                                            <Progress value={procPct} className="h-2" />
                                            <p className="text-xs text-muted-foreground mt-2">{procPct}% done</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success"><UserCheck className="size-5" /></div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">AI RESULT</Badge>
                                            </div>
                                            <p className={`text-sm font-semibold ${visit.aiCallResult ? aiResultStyle(visit.aiCallResult) : "text-muted-foreground"}`}>
                                                {visit.aiCallResult || "No call made yet"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning"><Calendar className="size-5" /></div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">DOCUMENTS</Badge>
                                            </div>
                                            <p className="text-3xl font-bold">{visit.documents.length}</p>
                                            <p className="text-sm text-muted-foreground font-medium">Files Uploaded</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ── PROCEDURES ── */}
                        <TabsContent value="procedures" className="mt-0 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold">Procedure Checklist</h3>
                                    <p className="text-sm text-muted-foreground">{completedProcs} of {visit.procedures.length} procedures completed</p>
                                </div>
                                <Progress value={procPct} className="h-2 w-40" />
                            </div>
                            <div className="space-y-3">
                                {visit.procedures.map(proc => (
                                    <Card key={proc.id} className={`shadow-sm transition-colors ${proc.completed ? "border-success/40 bg-success/5" : ""}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <Checkbox className="mt-0.5" checked={proc.completed} onCheckedChange={() => toggleProcedure(proc.id)} />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`text-sm font-semibold ${proc.completed ? "line-through text-muted-foreground" : ""}`}>{proc.name}</p>
                                                        {proc.completed && <Badge className="bg-success/10 text-success border-0 text-[10px]">Completed</Badge>}
                                                    </div>
                                                    <textarea
                                                        className="w-full text-xs text-muted-foreground bg-transparent border-0 resize-none focus:outline-none focus:ring-1 focus:ring-border rounded p-1 -ml-1 placeholder:text-muted-foreground/50"
                                                        placeholder="Add procedure notes…"
                                                        rows={proc.notes ? 2 : 1}
                                                        value={proc.notes}
                                                        onChange={e => updateProcNote(proc.id, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* ── DOCUMENTS ── */}
                        <TabsContent value="documents" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-primary">Visit Documents</CardTitle>
                                        <CardDescription>{visit.documents.length} documents on file</CardDescription>
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
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visit.documents.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No documents uploaded yet</TableCell></TableRow>
                                            ) : visit.documents.map(doc => (
                                                <TableRow key={doc.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="size-4 text-muted-foreground" />
                                                            <span className="text-sm font-medium">{doc.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline" className="text-[10px]">{doc.type}</Badge></TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{doc.uploadedBy}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{doc.date}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem><Eye className="mr-2 size-4" />Preview</DropdownMenuItem>
                                                                <DropdownMenuItem><Download className="mr-2 size-4" />Download</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDoc(doc.id)}><XCircle className="mr-2 size-4" />Delete</DropdownMenuItem>
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

                        {/* ── AI CONFIRMATION ── */}
                        <TabsContent value="ai" className="mt-0 space-y-6">
                            {/* Status card */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Confirmation Status</CardTitle>
                                        <CardDescription>Current AI confirmation result for this visit</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-12 rounded-full flex items-center justify-center ${visit.confirmationStatus === "confirmed" ? "bg-success/10" : "bg-warning/10"}`}>
                                                <Bot className={`size-6 ${visit.confirmationStatus === "confirmed" ? "text-success" : "text-warning"}`} />
                                            </div>
                                            <div>
                                                <Badge className={confirmConfig[visit.confirmationStatus].className}>{confirmConfig[visit.confirmationStatus].label}</Badge>
                                                <p className="text-sm text-muted-foreground mt-1">{visit.aiCallResult || "No call made yet"}</p>
                                            </div>
                                        </div>
                                        <Button className="w-full" onClick={() => setIsAICallOpen(true)}><Bot className="mr-2 size-4" />Initiate AI Call</Button>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Patient Contact</CardTitle>
                                        <CardDescription>Contact information for confirmation</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Patient</p>
                                            <p className="text-sm font-semibold">{visit.patient.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                                            <p className="text-sm font-semibold">{visit.patient.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visit Date</p>
                                            <p className="text-sm font-semibold">{visit.date} at {visit.time}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Call Policy</p>
                                            <p className="text-sm text-muted-foreground">Call 1–2 days before visit; record response automatically</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Call History */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base text-primary">Call History</CardTitle>
                                    <CardDescription>All AI call attempts for this visit</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Attempt Date</TableHead>
                                                <TableHead>Result</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead>Patient Response</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visit.aiCalls.length === 0 ? (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No AI calls made yet</TableCell></TableRow>
                                            ) : visit.aiCalls.map(call => (
                                                <TableRow key={call.id}>
                                                    <TableCell className="text-sm">{call.attemptDate}</TableCell>
                                                    <TableCell>
                                                        <Badge className={call.result === "Confirmed" ? "bg-success/10 text-success border-0 text-[10px]" : call.result.includes("Reschedule") ? "bg-warning/10 text-warning border-0 text-[10px]" : "bg-destructive/10 text-destructive border-0 text-[10px]"}>
                                                            {call.result}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{call.duration}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground max-w-xs">{call.response}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── ACTIVITY ── */}
                        <TabsContent value="activity" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base text-primary">Visit Activity Timeline</CardTitle>
                                    <CardDescription>All events and changes for this visit</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {visit.activity.map((entry, i) => {
                                        const Icon = entry.icon
                                        return (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <Icon className={`size-4 ${entry.color}`} />
                                                    </div>
                                                    {i < visit.activity.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                                                </div>
                                                <div className="pb-6 min-w-0">
                                                    <p className="text-sm font-semibold">{entry.action}</p>
                                                    <p className="text-xs text-muted-foreground">{entry.detail}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{entry.user} · {entry.time}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </div>
                </ScrollArea>
            </Tabs>

            {/* ═══════════════════════════════ DIALOGS */}

            {/* Reschedule */}
            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reschedule Visit</DialogTitle>
                        <DialogDescription>Select a new date and time for this visit.</DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-4">
                        <Field>
                            <FieldLabel>New Visit Date *</FieldLabel>
                            <Input type="date" value={rescheduleForm.date} onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))} />
                        </Field>
                        <Field>
                            <FieldLabel>New Visit Time</FieldLabel>
                            <Select value={rescheduleForm.time} onValueChange={v => setRescheduleForm(f => ({ ...f, time: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                                <SelectContent>
                                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel>Reason for Reschedule</FieldLabel>
                            <Textarea placeholder="Enter reason…" rows={3} value={rescheduleForm.reason} onChange={e => setRescheduleForm(f => ({ ...f, reason: e.target.value }))} />
                        </Field>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <Checkbox checked={rescheduleForm.notifySponsor} onCheckedChange={v => setRescheduleForm(f => ({ ...f, notifySponsor: !!v }))} />
                            <div>
                                <p className="text-sm font-medium">Notify Sponsor</p>
                                <p className="text-xs text-muted-foreground">Send notification to {visit.patient.sponsor}</p>
                            </div>
                        </label>
                    </FieldGroup>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
                        <Button onClick={handleReschedule}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel */}
            <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Visit</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to cancel this visit? This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Visit</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Visit</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* AI Call */}
            <Dialog open={isAICallOpen} onOpenChange={setIsAICallOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>AI Voice Confirmation Call</DialogTitle>
                        <DialogDescription>Initiate an automated call to confirm the patient&apos;s visit.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
                            <div className="size-16 flex items-center justify-center rounded-full bg-primary/10">
                                <Bot className="size-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{visit.patient.name}</p>
                                <p className="text-sm text-muted-foreground">{visit.patient.phone}</p>
                                <p className="text-sm text-muted-foreground mt-1">{visit.date} at {visit.time}</p>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">The AI will call the patient, ask for visit confirmation, and automatically record the response.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAICallOpen(false)}>Cancel</Button>
                        <Button onClick={handleAICall}><Phone className="mr-2 size-4" />Start AI Call</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Visit Document</DialogTitle>
                        <DialogDescription>Upload a document related to this visit.</DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-4">
                        <Field>
                            <FieldLabel>Document Type</FieldLabel>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    {["Lab Report", "ECG Report", "AE Form", "Visit Report", "Imaging", "Other"].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel>File</FieldLabel>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-primary font-medium">click to browse</span></p>
                                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, DICOM up to 50MB</p>
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
