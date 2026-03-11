"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, Plus, Clock, User, Calendar,
  CheckCircle2, X, Check, MoreHorizontal, AlertTriangle,
  StickyNote, Ban, Eye, RefreshCw, Filter,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────
type VisitStatus = "scheduled" | "confirmed" | "completed" | "missed" | "rescheduled" | "cancelled"
type ViewMode = "monthly" | "weekly" | "daily"

interface CalendarVisit {
  id: string
  patientName: string
  patientId: string
  initials: string
  study: string
  visitName: string
  visitType: string
  date: string   // YYYY-MM-DD
  time: string
  status: VisitStatus
  assignedDoctor: string
  assignedCoordinator: string
  isCritical: boolean
}

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS: Record<VisitStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  scheduled: { label: "Scheduled", dot: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  confirmed: { label: "Confirmed", dot: "bg-green-500", bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  completed: { label: "Completed", dot: "bg-gray-400", bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700" },
  missed: { label: "Missed", dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  rescheduled: { label: "Rescheduled", dot: "bg-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  cancelled: { label: "Cancelled", dot: "bg-gray-300", bg: "bg-gray-50 dark:bg-gray-900/40", text: "text-gray-400 dark:text-gray-500", border: "border-gray-100 dark:border-gray-800" },
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const HOURS = ["08:00 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"]
const CRITICAL_TYPES = new Set(["Baseline", "Final Visit", "Screening"])

// ─── Mock visits ─────────────────────────────────────────────────────────────
const INITIAL_VISITS: CalendarVisit[] = [
  { id: "V-001", patientName: "John Smith", patientId: "PT-1001", initials: "JS", study: "BEACON-2024", visitName: "Visit 3 – Follow-up", visitType: "Follow-up", date: "2024-03-12", time: "09:00 AM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez", isCritical: false },
  { id: "V-002", patientName: "Emily Johnson", patientId: "PT-1002", initials: "EJ", study: "AURORA-Phase2", visitName: "Screening", visitType: "Screening", date: "2024-03-12", time: "10:30 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee", isCritical: true },
  { id: "V-003", patientName: "Michael Chen", patientId: "PT-1003", initials: "MC", study: "BEACON-2024", visitName: "Visit 5 – Treatment", visitType: "Routine", date: "2024-03-12", time: "02:00 PM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez", isCritical: false },
  { id: "V-004", patientName: "Sarah Williams", patientId: "PT-1004", initials: "SW", study: "NOVA-Trial", visitName: "Visit 2 – Assessment", visitType: "Routine", date: "2024-03-14", time: "09:30 AM", status: "rescheduled", assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez", isCritical: false },
  { id: "V-005", patientName: "David Brown", patientId: "PT-1005", initials: "DB", study: "AURORA-Phase2", visitName: "Visit 1 – Baseline", visitType: "Baseline", date: "2024-03-13", time: "11:00 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee", isCritical: true },
  { id: "V-006", patientName: "Lisa Anderson", patientId: "PT-1006", initials: "LA", study: "MERIDIAN-2024", visitName: "Screening", visitType: "Screening", date: "2024-03-14", time: "10:00 AM", status: "scheduled", assignedDoctor: "Dr. Anna Roberts", assignedCoordinator: "David Kim", isCritical: true },
  { id: "V-007", patientName: "Robert Martinez", patientId: "PT-1007", initials: "RM", study: "NOVA-Trial", visitName: "Visit 8 – End of Study", visitType: "Final Visit", date: "2024-03-14", time: "02:30 PM", status: "confirmed", assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez", isCritical: true },
  { id: "V-008", patientName: "Jennifer Taylor", patientId: "PT-1008", initials: "JT", study: "BEACON-2024", visitName: "Visit 4 – Treatment", visitType: "Routine", date: "2024-03-15", time: "09:00 AM", status: "missed", assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez", isCritical: false },
  { id: "V-009", patientName: "James Wilson", patientId: "PT-1009", initials: "JW", study: "AURORA-Phase2", visitName: "Visit 3 – Follow-up", visitType: "Follow-up", date: "2024-03-18", time: "10:00 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee", isCritical: false },
  { id: "V-010", patientName: "Maria Garcia", patientId: "PT-1010", initials: "MG", study: "BEACON-2024", visitName: "Visit 6 – Treatment", visitType: "Routine", date: "2024-03-18", time: "01:30 PM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez", isCritical: false },
  { id: "V-011", patientName: "Thomas Lee", patientId: "PT-1011", initials: "TL", study: "NOVA-Trial", visitName: "Visit 4 – Assessment", visitType: "Routine", date: "2024-03-20", time: "09:00 AM", status: "scheduled", assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez", isCritical: false },
  { id: "V-012", patientName: "Nancy White", patientId: "PT-1012", initials: "NW", study: "MERIDIAN-2024", visitName: "Visit 1 – Baseline", visitType: "Baseline", date: "2024-03-20", time: "11:00 AM", status: "completed", assignedDoctor: "Dr. Anna Roberts", assignedCoordinator: "David Kim", isCritical: true },
  { id: "V-013", patientName: "Christopher Davis", patientId: "PT-1013", initials: "CD", study: "BEACON-2024", visitName: "Visit 7 – Follow-up", visitType: "Follow-up", date: "2024-03-22", time: "03:00 PM", status: "cancelled", assignedDoctor: "Dr. Sarah Chen", assignedCoordinator: "Emily Rodriguez", isCritical: false },
  { id: "V-014", patientName: "Amanda Moore", patientId: "PT-1014", initials: "AM", study: "NOVA-Trial", visitName: "Screening", visitType: "Screening", date: "2024-03-07", time: "09:00 AM", status: "completed", assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez", isCritical: true },
  { id: "V-015", patientName: "Kevin Brown", patientId: "PT-1015", initials: "KB", study: "AURORA-Phase2", visitName: "Final Visit", visitType: "Final Visit", date: "2024-03-05", time: "10:00 AM", status: "completed", assignedDoctor: "Dr. Michael Park", assignedCoordinator: "Jessica Lee", isCritical: true },
  { id: "V-016", patientName: "Harry Wilson", patientId: "PT-1016", initials: "HW", study: "MERIDIAN-2024", visitName: "Visit 2 – Routine", visitType: "Routine", date: "2024-03-12", time: "11:30 AM", status: "scheduled", assignedDoctor: "Dr. Anna Roberts", assignedCoordinator: "David Kim", isCritical: false },
  { id: "V-017", patientName: "Priya Patel", patientId: "PT-1017", initials: "PP", study: "NOVA-Trial", visitName: "Visit 5", visitType: "Routine", date: "2024-03-12", time: "01:00 PM", status: "confirmed", assignedDoctor: "Dr. James Wilson", assignedCoordinator: "Maria Lopez", isCritical: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
const ALL_STUDIES = [...new Set(INITIAL_VISITS.map(v => v.study))]
const ALL_DOCTORS = [...new Set(INITIAL_VISITS.map(v => v.assignedDoctor))]
const ALL_VISIT_TYPES = [...new Set(INITIAL_VISITS.map(v => v.visitType))]
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

// ─── Component ───────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const TODAY = useMemo(() => new Date(2024, 2, 12), [])
  const [visits, setVisits] = useState<CalendarVisit[]>(INITIAL_VISITS)
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth())
  const [viewYear, setViewYear] = useState(TODAY.getFullYear())
  const [viewMode, setViewMode] = useState<ViewMode>("monthly")
  const [weekOff, setWeekOff] = useState(0)
  const [dayOff, setDayOff] = useState(0)

  // Filters
  const [fStudy, setFStudy] = useState("all")
  const [fDoctor, setFDoctor] = useState("all")
  const [fType, setFType] = useState("all")
  const [fStatus, setFStatus] = useState("all")

  // Drawer
  const [drawerVisit, setDrawerVisit] = useState<CalendarVisit | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Day list modal
  const [dayModalDate, setDayModalDate] = useState("")
  const [dayModalVisits, setDayModalVisits] = useState<CalendarVisit[]>([])
  const [dayModalOpen, setDayModalOpen] = useState(false)

  // Date click quick action
  const [quickDate, setQuickDate] = useState("")
  const [quickOpen, setQuickOpen] = useState(false)

  // Drag & drop reschedule
  const [dragId, setDragId] = useState<string | null>(null)
  const [rescModal, setRescModal] = useState(false)
  const [rescTarget, setRescTarget] = useState<{ visit: CalendarVisit; newDate: string } | null>(null)
  const [rescReason, setRescReason] = useState("")

  // Tooltip
  const [tooltipVid, setTooltipVid] = useState<string | null>(null)

  const todayStr = fmt(TODAY)

  // Apply filters
  const filteredVisits = useMemo(() => visits.filter(v =>
    (fStudy === "all" || v.study === fStudy) &&
    (fDoctor === "all" || v.assignedDoctor === fDoctor) &&
    (fType === "all" || v.visitType === fType) &&
    (fStatus === "all" || v.status === fStatus)
  ), [visits, fStudy, fDoctor, fType, fStatus])

  const visitsForDate = useCallback((d: string) =>
    filteredVisits.filter(v => v.date === d), [filteredVisits])

  const todayVisits = useMemo(() => filteredVisits.filter(v => v.date === todayStr).sort((a, b) => a.time.localeCompare(b.time)), [filteredVisits, todayStr])

  // ── Navigation ──────────────────────────────────────────────────────────
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }
  const goToday = () => { setViewMonth(TODAY.getMonth()); setViewYear(TODAY.getFullYear()); setWeekOff(0); setDayOff(0) }

  // ── Weekly & Daily helpers ───────────────────────────────────────────────
  const weekDates = useMemo(() => {
    const s = new Date(TODAY); s.setDate(TODAY.getDate() - TODAY.getDay() + weekOff * 7)
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d })
  }, [TODAY, weekOff])

  const dayDate = useMemo(() => { const d = new Date(TODAY); d.setDate(TODAY.getDate() + dayOff); return d }, [TODAY, dayOff])

  // ── Monthly grid ─────────────────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay()
    const total = new Date(viewYear, viewMonth + 1, 0).getDate()
    const days: (number | null)[] = Array(first).fill(null)
    for (let d = 1; d <= total; d++) days.push(d)
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [viewMonth, viewYear])

  // ── Actions ─────────────────────────────────────────────────────────────
  const openVisitDrawer = (v: CalendarVisit) => { setDrawerVisit(v); setDrawerOpen(true) }

  const openDayModal = (dateStr: string) => {
    const dv = visitsForDate(dateStr)
    setDayModalVisits(dv); setDayModalDate(dateStr); setDayModalOpen(true)
  }

  const handleDayClick = (dateStr: string) => {
    const dv = visitsForDate(dateStr)
    if (dv.length > 0) openDayModal(dateStr)
    else { setQuickDate(dateStr); setQuickOpen(true) }
  }

  const handleDrop = (targetDate: string) => {
    if (!dragId) return
    const v = visits.find(x => x.id === dragId)
    if (!v || v.date === targetDate) { setDragId(null); return }
    setRescTarget({ visit: v, newDate: targetDate })
    setRescModal(true)
    setDragId(null)
  }

  const confirmReschedule = () => {
    if (!rescTarget) return
    const formatted = new Date(rescTarget.newDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    setVisits(prev => prev.map(v => v.id === rescTarget.visit.id
      ? { ...v, date: rescTarget.newDate, status: "rescheduled" }
      : v))
    toast.success(`${rescTarget.visit.patientName}'s visit rescheduled to ${formatted}`)
    setRescModal(false); setRescTarget(null); setRescReason("")
  }

  const confirmVisit = (id: string) => {
    setVisits(p => p.map(v => v.id === id ? { ...v, status: "confirmed" } : v))
    if (drawerVisit?.id === id) setDrawerVisit(d => d ? { ...d, status: "confirmed" } : d)
    toast.success("Visit confirmed")
  }
  const completeVisit = (id: string) => {
    setVisits(p => p.map(v => v.id === id ? { ...v, status: "completed" } : v))
    if (drawerVisit?.id === id) setDrawerVisit(d => d ? { ...d, status: "completed" } : d)
    toast.success("Visit marked as completed")
  }

  // ── Event card renderer ──────────────────────────────────────────────────
  const EventCard = ({ v, compact = false }: { v: CalendarVisit; compact?: boolean }) => {
    const s = STATUS[v.status]
    return (
      <div
        draggable
        onDragStart={() => setDragId(v.id)}
        onMouseEnter={() => setTooltipVid(v.id)}
        onMouseLeave={() => setTooltipVid(null)}
        onClick={e => { e.stopPropagation(); openVisitDrawer(v) }}
        className={`relative rounded px-1.5 py-1 cursor-pointer border transition-all hover:shadow-sm hover:scale-[1.01] group ${s.bg} ${s.text} ${s.border} mb-0.5`}
        title=""
      >
        {/* Critical badge */}
        {v.isCritical && (
          <span className="absolute -top-1 -right-1 size-3 bg-amber-400 rounded-full border border-white dark:border-background shadow-sm flex items-center justify-center">
            <AlertTriangle className="size-2 text-white" />
          </span>
        )}
        <div className="flex items-start gap-1 min-w-0">
          <div className={`size-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold leading-tight truncate">{v.patientName.split(" ")[0]} — {v.visitType}</p>
            {!compact && (
              <>
                <p className="text-[10px] opacity-75 truncate">{v.study}</p>
                <p className="text-[10px] opacity-70 flex items-center gap-0.5"><Clock className="size-2.5" />{v.time}</p>
              </>
            )}
          </div>
        </div>

        {/* Hover tooltip */}
        {tooltipVid === v.id && (
          <div className="absolute left-full ml-2 top-0 z-50 w-56 rounded-lg border bg-popover text-popover-foreground shadow-xl p-3 space-y-2 pointer-events-none" style={{ minWidth: 220 }}>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{v.initials}</div>
              <div>
                <p className="text-sm font-semibold leading-tight">{v.patientName}</p>
                <p className="text-xs text-muted-foreground">{v.patientId}</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Study</span><span className="font-medium text-right max-w-[130px] truncate">{v.study}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Visit</span><span className="font-medium">{v.visitType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{v.time}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className={`${s.bg} ${s.text} border-0 text-[10px] px-1.5 py-0`}>{s.label}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium text-right max-w-[130px] truncate">{v.assignedDoctor}</span></div>
            </div>
            <div className="flex gap-1 pt-1 border-t">
              <span className="text-[10px] text-muted-foreground">Click to open drawer</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <DashboardHeader title="Visit Calendar" description="Manage and track all patient visit schedules" />
      <div className="flex-1 overflow-auto p-6 space-y-4">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={viewMode} onValueChange={v => setViewMode(v as ViewMode)}>
            <TabsList className="h-9">
              <TabsTrigger value="monthly" className="text-sm px-4">Monthly</TabsTrigger>
              <TabsTrigger value="weekly" className="text-sm px-4">Weekly</TabsTrigger>
              <TabsTrigger value="daily" className="text-sm px-4">Daily</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Nav arrows */}
          {viewMode === "monthly" && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-9" onClick={prevMonth}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-36 text-center text-sm">{MONTHS[viewMonth]} {viewYear}</span>
              <Button variant="outline" size="icon" className="size-9" onClick={nextMonth}><ChevronRight className="size-4" /></Button>
            </div>
          )}
          {viewMode === "weekly" && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-9" onClick={() => setWeekOff(n => n - 1)}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-52 text-center text-sm">
                {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" className="size-9" onClick={() => setWeekOff(n => n + 1)}><ChevronRight className="size-4" /></Button>
            </div>
          )}
          {viewMode === "daily" && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-9" onClick={() => setDayOff(n => n - 1)}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-48 text-center text-sm">{dayDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</span>
              <Button variant="outline" size="icon" className="size-9" onClick={() => setDayOff(n => n + 1)}><ChevronRight className="size-4" /></Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <div className="ml-auto flex gap-2">
            <Button size="sm"><Plus className="mr-2 size-4" />Schedule Visit</Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          {[
            { value: fStudy, setter: setFStudy, placeholder: "All Studies", options: ALL_STUDIES },
            { value: fDoctor, setter: setFDoctor, placeholder: "All Doctors", options: ALL_DOCTORS },
            { value: fType, setter: setFType, placeholder: "All Visit Types", options: ALL_VISIT_TYPES },
          ].map(({ value, setter, placeholder, options }) => (
            <Select key={placeholder} value={value} onValueChange={setter}>
              <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder={placeholder} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{placeholder}</SelectItem>
                {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
          <Select value={fStatus} onValueChange={setFStatus}>
            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.keys(STATUS) as VisitStatus[]).map(s => <SelectItem key={s} value={s}>{STATUS[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
          {(fStudy !== "all" || fDoctor !== "all" || fType !== "all" || fStatus !== "all") && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setFStudy("all"); setFDoctor("all"); setFType("all"); setFStatus("all") }}>
              <X className="mr-1 size-3" />Clear
            </Button>
          )}
        </div>

        {/* ── Main Content + Today Panel ── */}
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">

            {/* ══ MONTHLY VIEW ══ */}
            {viewMode === "monthly" && (
              <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-7 border-b bg-muted/50">
                    {DAYS.map(d => (
                      <div key={d} className="border-r last:border-r-0 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {monthDays.map((day, idx) => {
                      const dateStr = day ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""
                      const dv = day ? visitsForDate(dateStr) : []
                      const isCurrentDay = dateStr === todayStr
                      const preview = dv.slice(0, 2)
                      const extra = dv.length - 2
                      return (
                        <div
                          key={idx}
                          onDragOver={e => { e.preventDefault() }}
                          onDrop={() => day && handleDrop(dateStr)}
                          onClick={() => day && handleDayClick(dateStr)}
                          className={`border-b border-r last-of-type:border-r-0 min-h-[110px] p-1.5 transition-colors ${day ? "cursor-pointer hover:bg-muted/20" : "bg-muted/10"} ${isCurrentDay ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""}`}
                        >
                          {day && (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-semibold size-6 flex items-center justify-center rounded-full ${isCurrentDay ? "bg-primary text-primary-foreground" : ""}`}>{day}</p>
                                {dv.length > 0 && (
                                  <span className="text-[10px] text-muted-foreground font-medium">{dv.length} visit{dv.length !== 1 ? "s" : ""}</span>
                                )}
                              </div>
                              {preview.map(v => <EventCard key={v.id} v={v} />)}
                              {extra > 0 && (
                                <p className="text-[10px] text-primary font-medium px-1">+{extra} more</p>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ══ WEEKLY VIEW ══ */}
            {viewMode === "weekly" && (
              <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-8 border-b bg-muted/50">
                    <div className="border-r p-2 text-xs text-muted-foreground font-semibold">Time</div>
                    {weekDates.map((d, i) => {
                      const ds = fmt(d)
                      const dv = visitsForDate(ds)
                      const tod = ds === todayStr
                      return (
                        <div key={i} className={`border-r last:border-r-0 p-2 text-center cursor-pointer hover:bg-muted/20 transition-colors ${tod ? "bg-primary/5" : ""}`}
                          onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(ds)}>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{DAYS[d.getDay()]}</p>
                          <p className={`text-lg font-bold mx-auto size-8 flex items-center justify-center rounded-full ${tod ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</p>
                          {dv.length > 0 && <p className="text-[10px] text-muted-foreground mt-0.5">{dv.length} visit{dv.length !== 1 ? "s" : ""}</p>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="divide-y">
                    {HOURS.map(hour => (
                      <div key={hour} className="grid grid-cols-8 min-h-[52px]">
                        <div className="px-2 py-2 text-xs text-muted-foreground border-r">{hour}</div>
                        {weekDates.map((d, i) => {
                          const ds = fmt(d)
                          const sv = visitsForDate(ds).filter(v => v.time === hour)
                          return (
                            <div key={i} className="border-r last:border-r-0 p-0.5 min-h-[52px]" onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(ds)}>
                              {sv.map(v => <EventCard key={v.id} v={v} />)}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ══ DAILY VIEW ══ */}
            {viewMode === "daily" && (
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="border-b py-3 px-4">
                  <CardTitle className="text-sm font-semibold">{dayDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</CardTitle>
                  <p className="text-xs text-muted-foreground">{visitsForDate(fmt(dayDate)).length} visit(s) scheduled</p>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {HOURS.map(hour => {
                    const sv = visitsForDate(fmt(dayDate)).filter(v => v.time === hour)
                    return (
                      <div key={hour} className="flex gap-4 px-4 py-3 min-h-[58px] hover:bg-muted/10 transition-colors"
                        onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(fmt(dayDate))}>
                        <span className="text-xs text-muted-foreground w-20 shrink-0 mt-0.5">{hour}</span>
                        <div className="flex-1 space-y-1.5">
                          {sv.map(v => {
                            const s = STATUS[v.status]
                            return (
                              <div key={v.id} onClick={() => openVisitDrawer(v)} draggable onDragStart={() => setDragId(v.id)}
                                className={`rounded-lg px-3 py-2 cursor-pointer border hover:opacity-90 transition flex items-center gap-3 ${s.bg} ${s.border}`}
                              >
                                <div className="size-8 rounded-full bg-background/60 flex items-center justify-center text-xs font-bold">{v.initials}</div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold truncate ${s.text}`}>{v.patientName} — {v.visitType}</p>
                                  <p className="text-[11px] truncate text-muted-foreground">{v.study}</p>
                                  {v.isCritical && <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1 py-0 mt-0.5">Critical</Badge>}
                                </div>
                                <Badge className={`${s.bg} ${s.text} border-0 text-[10px] shrink-0`}>{s.label}</Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* ── Legend ── */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              {(Object.entries(STATUS) as [VisitStatus, typeof STATUS[VisitStatus]][]).map(([, c]) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <span className={`size-2.5 rounded-full ${c.dot}`} />
                  <span>{c.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-400 flex items-center justify-center"><AlertTriangle className="size-1.5 text-white" /></span>
                <span>Critical Visit</span>
              </div>
            </div>
          </div>

          {/* ── Today's Visits Panel ── */}
          <div className="w-64 shrink-0">
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm text-primary">Today&apos;s Visits</CardTitle>
                <p className="text-xs text-muted-foreground">{TODAY.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
              </CardHeader>
              <CardContent className="px-3 pb-4">
                <ScrollArea className="h-[480px]">
                  <div className="space-y-2 pr-2">
                    {todayVisits.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-6">No visits today</p>
                    )}
                    {todayVisits.map(v => {
                      const s = STATUS[v.status]
                      return (
                        <div key={v.id} onClick={() => openVisitDrawer(v)}
                          className={`rounded-lg border p-2.5 cursor-pointer hover:shadow-sm transition-all ${s.bg} ${s.border}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Clock className={`size-3 shrink-0 ${s.text}`} />
                            <span className={`text-[11px] font-semibold ${s.text}`}>{v.time}</span>
                            {v.isCritical && <AlertTriangle className="size-3 text-amber-500 ml-auto" />}
                          </div>
                          <p className="text-xs font-semibold truncate">{v.patientName}</p>
                          <p className={`text-[11px] truncate ${s.text} opacity-80`}>{v.visitType}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{v.study}</p>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ════════════════════════ VISIT DRAWER ════════════════════════ */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-[420px] sm:max-w-[420px] p-0 overflow-auto">
            {drawerVisit && (() => {
              const s = STATUS[drawerVisit.status]
              return (
                <>
                  <div className={`p-5 border-b ${s.bg}`}>
                    <SheetHeader>
                      <SheetTitle className={`text-base font-bold ${s.text}`}>{drawerVisit.visitName}</SheetTitle>
                      <SheetDescription className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${s.bg} ${s.text} border-0 text-[10px]`}>{s.label}</Badge>
                        {drawerVisit.isCritical && <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]"><AlertTriangle className="size-2.5 mr-1" />Critical Visit</Badge>}
                        <span className="text-xs font-mono text-muted-foreground">{drawerVisit.id}</span>
                      </SheetDescription>
                    </SheetHeader>
                  </div>
                  <div className="p-5 space-y-6">
                    {/* Visit Info */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Visit Information</h4>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        {[
                          ["Visit Type", drawerVisit.visitType],
                          ["Date", new Date(drawerVisit.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                          ["Time", drawerVisit.time],
                        ].map(([l, v]) => (
                          <div key={l} className="space-y-0.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{l}</p>
                            <p className="text-sm font-semibold">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Patient Info */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Patient Information</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{drawerVisit.initials}</div>
                        <div>
                          <p className="text-sm font-semibold">{drawerVisit.patientName}</p>
                          <p className="text-xs text-muted-foreground">{drawerVisit.patientId}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-y-3">
                        {[
                          ["Study", drawerVisit.study],
                          ["Doctor", drawerVisit.assignedDoctor],
                          ["Coordinator", drawerVisit.assignedCoordinator],
                        ].map(([l, v]) => (
                          <div key={l} className="space-y-0.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{l}</p>
                            <p className="text-sm font-semibold">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Actions */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {drawerVisit.status !== "confirmed" && drawerVisit.status !== "completed" && drawerVisit.status !== "cancelled" && (
                          <Button size="sm" className="col-span-2" onClick={() => confirmVisit(drawerVisit.id)}>
                            <Check className="mr-2 size-4" />Confirm Visit
                          </Button>
                        )}
                        {drawerVisit.status !== "completed" && drawerVisit.status !== "cancelled" && (
                          <Button variant="outline" size="sm" className="col-span-2" onClick={() => completeVisit(drawerVisit.id)}>
                            <CheckCircle2 className="mr-2 size-4" />Mark Completed
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => { setDrawerOpen(false); setRescTarget({ visit: drawerVisit, newDate: "" }); setRescModal(true) }}>
                          <RefreshCw className="mr-2 size-4" />Reschedule
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/patients/${drawerVisit.patientId}`} onClick={() => setDrawerOpen(false)}>
                            <User className="mr-2 size-4" />Patient Profile
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="col-span-2" asChild>
                          <Link href={`/visits/${drawerVisit.id}`} onClick={() => setDrawerOpen(false)}>
                            <Eye className="mr-2 size-4" />Open Full Visit Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
          </SheetContent>
        </Sheet>

        {/* ════════════════════════ DAY VISITS MODAL ════════════════════════ */}
        <Dialog open={dayModalOpen} onOpenChange={setDayModalOpen}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                {dayModalDate ? new Date(dayModalDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : ""}
              </DialogTitle>
              <DialogDescription>{dayModalVisits.length} visit{dayModalVisits.length !== 1 ? "s" : ""} scheduled</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {dayModalVisits.map(v => {
                const s = STATUS[v.status]
                return (
                  <div key={v.id} onClick={() => { setDayModalOpen(false); openVisitDrawer(v) }}
                    className={`rounded-lg border p-3 cursor-pointer hover:opacity-90 transition ${s.bg} ${s.border}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-background/60 flex items-center justify-center text-xs font-bold">{v.initials}</div>
                        <div>
                          <p className={`text-sm font-semibold ${s.text}`}>{v.patientName} — {v.visitType}</p>
                          <p className="text-xs text-muted-foreground">{v.study}</p>
                        </div>
                      </div>
                      <Badge className={`${s.bg} ${s.text} border-0 text-[10px] shrink-0`}>{s.label}</Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />{v.time}
                      {v.isCritical && <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0"><AlertTriangle className="size-2.5 mr-1 inline" />Critical</Badge>}
                    </div>
                  </div>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* ════════════════════════ RESCHEDULE MODAL ════════════════════════ */}
        <Dialog open={rescModal} onOpenChange={v => { if (!v) { setRescModal(false); setRescTarget(null); setRescReason("") } }}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Reschedule Visit</DialogTitle>
              <DialogDescription>
                {rescTarget?.visit.patientName} — {rescTarget?.visit.visitType}
                {rescTarget?.newDate && rescTarget.newDate !== "" && (
                  <><br />Moving to: {new Date(rescTarget.newDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
                )}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel>New Visit Date *</FieldLabel>
                <Input type="date" value={rescTarget?.newDate || ""} onChange={e => setRescTarget(t => t ? { ...t, newDate: e.target.value } : t)} />
              </Field>
              <Field>
                <FieldLabel>Reason for Reschedule</FieldLabel>
                <Textarea placeholder="Enter reason…" rows={3} value={rescReason} onChange={e => setRescReason(e.target.value)} />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setRescModal(false); setRescTarget(null); setRescReason("") }}>Cancel</Button>
              <Button onClick={confirmReschedule} disabled={!rescTarget?.newDate}>Confirm Reschedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ════════════════════════ EMPTY DATE QUICK ACTIONS ════════════════ */}
        <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>
                {quickDate ? new Date(quickDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}
              </DialogTitle>
              <DialogDescription>No visits on this date. What would you like to do?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-2">
              {[
                { icon: Plus, label: "Schedule Visit", action: () => { setQuickOpen(false); toast.success("Opening Schedule Visit form…") } },
                { icon: StickyNote, label: "Add Note", action: () => { setQuickOpen(false); toast.success("Note added for " + quickDate) } },
                { icon: Ban, label: "Block Time", action: () => { setQuickOpen(false); toast.success("Time blocked for " + quickDate) } },
              ].map(({ icon: Icon, label, action }) => (
                <Button key={label} variant="outline" className="justify-start" onClick={action}>
                  <Icon className="mr-2 size-4" />{label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
