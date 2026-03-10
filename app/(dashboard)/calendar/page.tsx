"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Calendar, Clock, Plus, User,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────
type VisitStatus = "scheduled" | "confirmed" | "completed" | "missed" | "rescheduled" | "cancelled"
interface CalendarVisit {
  id: string
  patientName: string
  initials: string
  study: string
  visitName: string
  date: string   // YYYY-MM-DD
  time: string
  status: VisitStatus
  assignedDoctor: string
}

const statusColors: Record<VisitStatus, { dot: string; badge: string; label: string }> = {
  scheduled: { dot: "bg-primary", badge: "bg-primary/10 text-primary border-0", label: "Scheduled" },
  confirmed: { dot: "bg-green-500", badge: "bg-green-500/10 text-green-600 border-0", label: "Confirmed" },
  completed: { dot: "bg-gray-400", badge: "bg-muted text-muted-foreground border-0", label: "Completed" },
  missed: { dot: "bg-red-500", badge: "bg-red-500/10 text-red-600 border-0", label: "Missed" },
  rescheduled: { dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 border-0", label: "Rescheduled" },
  cancelled: { dot: "bg-gray-300", badge: "bg-muted text-muted-foreground border-0", label: "Cancelled" },
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const HOURS = ["08:00 AM", "09:00 AM", "10:00 AM", "10:30 AM", "11:00 AM", "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"]

const visits: CalendarVisit[] = [
  { id: "V-2024-001", patientName: "John Smith", initials: "JS", study: "BEACON-2024", visitName: "Visit 3 – Follow-up", date: "2024-03-12", time: "09:00 AM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen" },
  { id: "V-2024-002", patientName: "Emily Johnson", initials: "EJ", study: "AURORA-Phase2", visitName: "Screening", date: "2024-03-12", time: "10:30 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park" },
  { id: "V-2024-003", patientName: "Michael Chen", initials: "MC", study: "BEACON-2024", visitName: "Visit 5 – Treatment", date: "2024-03-12", time: "02:00 PM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen" },
  { id: "V-2024-004", patientName: "Sarah Williams", initials: "SW", study: "NOVA-Trial", visitName: "Visit 2 – Assessment", date: "2024-03-14", time: "09:30 AM", status: "rescheduled", assignedDoctor: "Dr. James Wilson" },
  { id: "V-2024-005", patientName: "David Brown", initials: "DB", study: "AURORA-Phase2", visitName: "Visit 1 – Baseline", date: "2024-03-13", time: "11:00 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park" },
  { id: "V-2024-006", patientName: "Lisa Anderson", initials: "LA", study: "MERIDIAN-2024", visitName: "Screening", date: "2024-03-14", time: "10:00 AM", status: "scheduled", assignedDoctor: "Dr. Anna Roberts" },
  { id: "V-2024-007", patientName: "Robert Martinez", initials: "RM", study: "NOVA-Trial", visitName: "Visit 8 – End of Study", date: "2024-03-14", time: "02:30 PM", status: "confirmed", assignedDoctor: "Dr. James Wilson" },
  { id: "V-2024-008", patientName: "Jennifer Taylor", initials: "JT", study: "BEACON-2024", visitName: "Visit 4 – Treatment", date: "2024-03-15", time: "09:00 AM", status: "missed", assignedDoctor: "Dr. Sarah Chen" },
  { id: "V-2024-009", patientName: "James Wilson", initials: "JW", study: "AURORA-Phase2", visitName: "Visit 3 – Follow-up", date: "2024-03-18", time: "10:00 AM", status: "scheduled", assignedDoctor: "Dr. Michael Park" },
  { id: "V-2024-010", patientName: "Maria Garcia", initials: "MG", study: "BEACON-2024", visitName: "Visit 6 – Treatment", date: "2024-03-18", time: "01:30 PM", status: "confirmed", assignedDoctor: "Dr. Sarah Chen" },
  { id: "V-2024-011", patientName: "Thomas Lee", initials: "TL", study: "NOVA-Trial", visitName: "Visit 4 – Assessment", date: "2024-03-20", time: "09:00 AM", status: "scheduled", assignedDoctor: "Dr. James Wilson" },
  { id: "V-2024-012", patientName: "Nancy White", initials: "NW", study: "MERIDIAN-2024", visitName: "Visit 1 – Baseline", date: "2024-03-20", time: "11:00 AM", status: "completed", assignedDoctor: "Dr. Anna Roberts" },
  { id: "V-2024-013", patientName: "Christopher Davis", initials: "CD", study: "BEACON-2024", visitName: "Visit 7 – Follow-up", date: "2024-03-22", time: "03:00 PM", status: "cancelled", assignedDoctor: "Dr. Sarah Chen" },
  { id: "V-2024-014", patientName: "Amanda Moore", initials: "AM", study: "NOVA-Trial", visitName: "Screening", date: "2024-03-07", time: "09:00 AM", status: "completed", assignedDoctor: "Dr. James Wilson" },
  { id: "V-2024-015", patientName: "Kevin Brown", initials: "KB", study: "AURORA-Phase2", visitName: "Visit 2 – Baseline", date: "2024-03-05", time: "10:00 AM", status: "completed", assignedDoctor: "Dr. Michael Park" },
]

function getVisitsForDate(date: string) {
  return visits.filter(v => v.date === date)
}

export default function CalendarPage() {
  const router = useRouter()
  const today = useMemo(() => new Date(2024, 2, 12), []) // Mock today = Mar 12, 2024
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">("monthly")
  const [weekOffset, setWeekOffset] = useState(0)
  const [dayOffset, setDayOffset] = useState(0)
  const [selectedDateVisits, setSelectedDateVisits] = useState<CalendarVisit[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState("")

  const todayStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const goToToday = () => {
    setViewMonth(today.getMonth())
    setViewYear(today.getFullYear())
    setWeekOffset(0)
    setDayOffset(0)
  }

  const openDay = (dateStr: string) => {
    const dayVisits = getVisitsForDate(dateStr)
    setSelectedDateVisits(dayVisits)
    setModalDate(dateStr)
    if (dayVisits.length > 0) setIsModalOpen(true)
  }

  // ─── Monthly view ─────────────────────────────────────────────────────────
  const computeMonthDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const days: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    while (days.length % 7 !== 0) days.push(null)
    return days
  }

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }

  // ─── Weekly view ─────────────────────────────────────────────────────────
  const getWeekDates = (offset: number) => {
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + offset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })
  }
  const weekDates = getWeekDates(weekOffset)

  // ─── Daily view ──────────────────────────────────────────────────────────
  const dayDate = new Date(today)
  dayDate.setDate(today.getDate() + dayOffset)
  const dayStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`
  const dayVisits = getVisitsForDate(dayStr)

  const formatDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  const isToday = (d: Date) => d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()

  const monthDays = computeMonthDays()

  return (
    <>
      <DashboardHeader title="Visit Calendar" description="View and manage scheduled patient visits" />
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View switcher */}
          <Tabs value={viewMode} onValueChange={v => setViewMode(v as typeof viewMode)}>
            <TabsList className="h-9">
              <TabsTrigger value="monthly" className="text-sm px-4">Monthly</TabsTrigger>
              <TabsTrigger value="weekly" className="text-sm px-4">Weekly</TabsTrigger>
              <TabsTrigger value="daily" className="text-sm px-4">Daily</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Navigation */}
          {viewMode === "monthly" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-9" onClick={prevMonth}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-36 text-center">{MONTHS[viewMonth]} {viewYear}</span>
              <Button variant="outline" size="icon" className="size-9" onClick={nextMonth}><ChevronRight className="size-4" /></Button>
            </div>
          )}
          {viewMode === "weekly" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-9" onClick={() => setWeekOffset(n => n - 1)}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-52 text-center text-sm">
                {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" className="size-9" onClick={() => setWeekOffset(n => n + 1)}><ChevronRight className="size-4" /></Button>
            </div>
          )}
          {viewMode === "daily" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-9" onClick={() => setDayOffset(n => n - 1)}><ChevronLeft className="size-4" /></Button>
              <span className="font-semibold w-44 text-center text-sm">
                {dayDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" className="size-9" onClick={() => setDayOffset(n => n + 1)}><ChevronRight className="size-4" /></Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
          <div className="ml-auto">
            <Button size="sm" asChild><Link href="/visits"><Plus className="mr-2 size-4" />Schedule Visit</Link></Button>
          </div>
        </div>

        {/* ── MONTHLY VIEW ── */}
        {viewMode === "monthly" && (
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-7">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="border-b border-r last:border-r-0 bg-muted/50 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d}</div>
                ))}
                {monthDays.map((day, idx) => {
                  const dateStr = day ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : ""
                  const dayVisitsData = day ? getVisitsForDate(dateStr) : []
                  const isCurrentDay = day ? dateStr === todayStr : false
                  return (
                    <div
                      key={idx}
                      onClick={() => day && openDay(dateStr)}
                      className={`border-b border-r last-of-type:border-r-0 min-h-[110px] p-2 transition-colors ${day ? "cursor-pointer hover:bg-muted/30" : "bg-muted/10"} ${isCurrentDay ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""}`}
                    >
                      {day && (
                        <>
                          <p className={`text-sm font-semibold mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isCurrentDay ? "bg-primary text-primary-foreground" : ""}`}>{day}</p>
                          <div className="space-y-1">
                            {dayVisitsData.slice(0, 3).map(v => (
                              <div key={v.id} className="flex items-center gap-1.5 truncate">
                                <span className={`size-2 shrink-0 rounded-full ${statusColors[v.status].dot}`} />
                                <span className="text-[11px] leading-tight truncate">{v.patientName.split(" ")[0]}</span>
                              </div>
                            ))}
                            {dayVisitsData.length > 3 && (
                              <p className="text-[10px] text-muted-foreground">+{dayVisitsData.length - 3} more</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── WEEKLY VIEW ── */}
        {viewMode === "weekly" && (
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b bg-muted/50">
                {weekDates.map((d, i) => {
                  const dateStr = formatDateStr(d)
                  const dVisits = getVisitsForDate(dateStr)
                  const today_ = isToday(d)
                  return (
                    <div key={i} className={`border-r last:border-r-0 p-3 text-center cursor-pointer hover:bg-muted/30 transition-colors ${today_ ? "bg-primary/5" : ""}`} onClick={() => openDay(dateStr)}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{DAYS_OF_WEEK[d.getDay()]}</p>
                      <p className={`text-xl font-bold mt-1 mx-auto size-9 flex items-center justify-center rounded-full ${today_ ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</p>
                      {dVisits.length > 0 && (
                        <div className="flex gap-0.5 justify-center mt-2 flex-wrap">
                          {dVisits.slice(0, 4).map(v => (
                            <span key={v.id} className={`size-2 rounded-full ${statusColors[v.status].dot}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="divide-y">
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 min-h-[56px]">
                    <div className="px-3 py-2 text-xs text-muted-foreground border-r w-[90px] flex-shrink-0">{hour}</div>
                    {weekDates.map((d, i) => {
                      const dateStr = formatDateStr(d)
                      const slotVisits = getVisitsForDate(dateStr).filter(v => v.time === hour)
                      return (
                        <div key={i} className="border-r last:border-r-0 p-1 min-h-[56px]">
                          {slotVisits.map(v => (
                            <Link key={v.id} href={`/visits/${v.id}`}>
                              <div className={`rounded px-1.5 py-1 text-[10px] leading-snug cursor-pointer ${statusColors[v.status].badge} mb-0.5`}>
                                <p className="font-semibold truncate">{v.patientName.split(" ")[0]}</p>
                                <p className="truncate opacity-80">{v.visitName}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── DAILY VIEW ── */}
        {viewMode === "daily" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="border-b py-3 px-4">
                  <p className="font-semibold text-sm">{dayDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  <p className="text-xs text-muted-foreground">{dayVisits.length} visit{dayVisits.length !== 1 ? "s" : ""} scheduled</p>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {HOURS.map(hour => {
                    const slotVisits = dayVisits.filter(v => v.time === hour)
                    return (
                      <div key={hour} className="flex gap-4 px-4 py-3 min-h-[60px]">
                        <span className="text-xs text-muted-foreground w-20 shrink-0 mt-0.5">{hour}</span>
                        <div className="flex-1 space-y-2">
                          {slotVisits.map(v => (
                            <Link key={v.id} href={`/visits/${v.id}`}>
                              <div className={`rounded-lg p-3 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-3 ${statusColors[v.status].badge}`}>
                                <div className="size-8 rounded-full bg-background/50 flex items-center justify-center text-xs font-bold">{v.initials}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{v.patientName}</p>
                                  <p className="text-[11px] truncate opacity-80">{v.visitName} · {v.study}</p>
                                </div>
                                <Badge className={`${statusColors[v.status].badge} text-[10px] shrink-0`}>{statusColors[v.status].label}</Badge>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <p className="font-semibold text-sm text-primary">Day Summary</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(statusColors).map(([status, cfg]) => {
                    const count = dayVisits.filter(v => v.status === status).length
                    if (count === 0) return null
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${cfg.dot}`} />
                          <span className="text-sm">{cfg.label}</span>
                        </div>
                        <Badge className={`${cfg.badge} text-xs`}>{count}</Badge>
                      </div>
                    )
                  })}
                  {dayVisits.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No visits on this day</p>}
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader><p className="font-semibold text-sm text-primary">Assigned Staff Today</p></CardHeader>
                <CardContent className="space-y-2">
                  {[...new Set(dayVisits.map(v => v.assignedDoctor))].map(doc => (
                    <div key={doc} className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                  {dayVisits.length === 0 && <p className="text-sm text-muted-foreground">—</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {Object.values(statusColors).map(c => (
            <div key={c.label} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${c.dot}`} />
              <span>{c.label}</span>
            </div>
          ))}
        </div>

        {/* ── Day visits modal (monthly click) ── */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Visits on {modalDate ? new Date(modalDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : ""}
              </DialogTitle>
              <DialogDescription>{selectedDateVisits.length} visit{selectedDateVisits.length !== 1 ? "s" : ""} scheduled</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {selectedDateVisits.map(v => (
                <Link key={v.id} href={`/visits/${v.id}`} onClick={() => setIsModalOpen(false)}>
                  <div className="rounded-lg border p-3 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{v.initials}</div>
                        <div>
                          <p className="text-sm font-semibold">{v.patientName}</p>
                          <p className="text-xs text-muted-foreground">{v.study}</p>
                        </div>
                      </div>
                      <Badge className={`${statusColors[v.status].badge} text-[10px] shrink-0`}>{statusColors[v.status].label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{v.time}</span>
                      <span>·</span>
                      <span>{v.visitName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{v.assignedDoctor}</p>
                  </div>
                </Link>
              ))}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
