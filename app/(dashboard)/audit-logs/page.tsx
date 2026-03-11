"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
  Calendar,
  Users,
  FileText,
  ArrowUpDown,
} from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// ── Data ──────────────────────────────────────────────────────────────────────
interface LogEntry {
  id: string
  user: { name: string; initials: string }
  action: string
  module: string
  description: string
  timestamp: string
  timestampMs: number
  ip: string
}

const allLogs: LogEntry[] = [
  { id: "LOG-001", user: { name: "Dr. Sarah Chen", initials: "SC" }, action: "created", module: "Patients", description: "Created patient PT-1006 (Lisa Anderson) and enrolled in BEACON-2024", timestamp: "Mar 12, 2024 10:30:15 AM", timestampMs: 1710246615000, ip: "192.168.1.100" },
  { id: "LOG-002", user: { name: "Emily Roberts", initials: "ER" }, action: "updated", module: "Visits", description: "Rescheduled Visit V-2024-004 for PT-1004 from Mar 15 to Mar 18", timestamp: "Mar 12, 2024 10:15:42 AM", timestampMs: 1710245742000, ip: "192.168.1.105" },
  { id: "LOG-003", user: { name: "Dr. James Wilson", initials: "JW" }, action: "uploaded", module: "Documents", description: "Uploaded Lab_Results_CBC.pdf (v1) for PT-1003 · BEACON-2024", timestamp: "Mar 12, 2024 09:45:20 AM", timestampMs: 1710243920000, ip: "192.168.1.110" },
  { id: "LOG-004", user: { name: "Dr. Sarah Chen", initials: "SC" }, action: "updated", module: "Studies", description: "Updated protocol for BEACON-2024 to v3.0 — Dosage revision", timestamp: "Mar 12, 2024 09:20:05 AM", timestampMs: 1710242405000, ip: "192.168.1.100" },
  { id: "LOG-005", user: { name: "System", initials: "SY" }, action: "sent", module: "Email Center", description: "AI-generated email sent to james.wilson@pfizer.com re: site visit", timestamp: "Mar 12, 2024 08:55:30 AM", timestampMs: 1710240930000, ip: "127.0.0.1" },
  { id: "LOG-006", user: { name: "Dr. Michael Park", initials: "MP" }, action: "confirmed", module: "Visits", description: "Confirmed Visit V-2024-001 (Baseline) for PT-1001 · Dr. Park attending", timestamp: "Mar 12, 2024 08:30:12 AM", timestampMs: 1710239412000, ip: "192.168.1.115" },
  { id: "LOG-007", user: { name: "Lisa Thompson", initials: "LT" }, action: "deleted", module: "Documents", description: "Deleted outdated consent form (v1) for PT-1002 — superseded by v2", timestamp: "Mar 11, 2024 04:45:00 PM", timestampMs: 1710163500000, ip: "192.168.1.120" },
  { id: "LOG-008", user: { name: "Dr. Sarah Chen", initials: "SC" }, action: "created", module: "Users", description: "Invited robert.martinez@pfizer.com as CRA for BEACON-2024 monitoring", timestamp: "Mar 11, 2024 03:20:45 PM", timestampMs: 1710157245000, ip: "192.168.1.100" },
  { id: "LOG-009", user: { name: "System", initials: "SY" }, action: "called", module: "Visits", description: "AI voice call completed to PT-1001 — Visit confirmed for Mar 14", timestamp: "Mar 11, 2024 02:00:00 PM", timestampMs: 1710151200000, ip: "127.0.0.1" },
  { id: "LOG-010", user: { name: "Dr. Nancy White", initials: "NW" }, action: "enrolled", module: "Patients", description: "Enrolled PT-1005 (David Brown) in AURORA-Phase2 — Screening passed", timestamp: "Mar 11, 2024 11:30:22 AM", timestampMs: 1710142222000, ip: "192.168.1.125" },
  { id: "LOG-011", user: { name: "Robert Martinez", initials: "RM" }, action: "downloaded", module: "Documents", description: "Downloaded Protocol_Amendment_v3.pdf for BEACON-2024 sponsor review", timestamp: "Mar 11, 2024 10:05:00 AM", timestampMs: 1710137100000, ip: "10.0.0.25" },
  { id: "LOG-012", user: { name: "Priya Sharma", initials: "PS" }, action: "login", module: "Users", description: "User logged in successfully from new device — IP flagged for review", timestamp: "Mar 11, 2024 08:00:00 AM", timestampMs: 1710129600000, ip: "203.0.113.42" },
  { id: "LOG-013", user: { name: "Dr. Sarah Chen", initials: "SC" }, action: "updated", module: "Roles", description: "Updated CRA role permissions — removed Edit access on Documents module", timestamp: "Mar 10, 2024 05:15:00 PM", timestampMs: 1710077700000, ip: "192.168.1.100" },
  { id: "LOG-014", user: { name: "Emily Roberts", initials: "ER" }, action: "created", module: "Visits", description: "Scheduled Visit V-2024-011 (Follow-Up #3) for PT-1003 on Mar 20", timestamp: "Mar 10, 2024 03:40:00 PM", timestampMs: 1710071200000, ip: "192.168.1.105" },
  { id: "LOG-015", user: { name: "Dr. James Wilson", initials: "JW" }, action: "updated", module: "Patients", description: "Updated patient consent status for PT-1002 — re-consent obtained", timestamp: "Mar 10, 2024 02:10:00 PM", timestampMs: 1710065400000, ip: "192.168.1.110" },
  { id: "LOG-016", user: { name: "System", initials: "SY" }, action: "sent", module: "Email Center", description: "Automated visit reminder sent to PT-1004 for Mar 12 appointment", timestamp: "Mar 10, 2024 09:00:00 AM", timestampMs: 1710050400000, ip: "127.0.0.1" },
  { id: "LOG-017", user: { name: "David Kim", initials: "DK" }, action: "downloaded", module: "Documents", description: "Downloaded AE_Report_001.pdf for AURORA-Phase2 sponsor file review", timestamp: "Mar 09, 2024 04:30:00 PM", timestampMs: 1709995800000, ip: "10.0.0.30" },
  { id: "LOG-018", user: { name: "Dr. Michael Park", initials: "MP" }, action: "created", module: "Studies", description: "Created new sub-study HEART-2024 under Pfizer cardiovascular trials", timestamp: "Mar 09, 2024 11:00:00 AM", timestampMs: 1709978400000, ip: "192.168.1.115" },
  { id: "LOG-019", user: { name: "Dr. Sarah Chen", initials: "SC" }, action: "deleted", module: "Users", description: "Deactivated account for usr.temp@hospital.org — contract ended", timestamp: "Mar 08, 2024 03:00:00 PM", timestampMs: 1709906400000, ip: "192.168.1.100" },
  { id: "LOG-020", user: { name: "Angela Foster", initials: "AF" }, action: "uploaded", module: "Documents", description: "Uploaded batch of 4 lab reports for PT-1001 through PT-1004 (BEACON)", timestamp: "Mar 08, 2024 10:15:00 AM", timestampMs: 1709889300000, ip: "192.168.1.130" },
]

const actionColors: Record<string, string> = {
  created: "bg-success/10 text-success border-0",
  updated: "bg-primary/10 text-primary border-0",
  deleted: "bg-destructive/10 text-destructive border-0",
  uploaded: "bg-warning/10 text-warning border-0",
  sent: "bg-muted text-muted-foreground border-0",
  confirmed: "bg-success/10 text-success border-0",
  enrolled: "bg-success/10 text-success border-0",
  called: "bg-primary/10 text-primary border-0",
  downloaded: "bg-muted text-muted-foreground border-0",
  login: "bg-primary/10 text-primary border-0",
}

const PAGE_SIZE = 10

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: number; sub?: string; color: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = allLogs.filter((log) => {
      const q = searchQuery.toLowerCase()
      const m = log.description.toLowerCase().includes(q) || log.user.name.toLowerCase().includes(q)
      const a = actionFilter === "all" || log.action === actionFilter
      const mod = moduleFilter === "all" || log.module === moduleFilter
      let d = true
      if (dateFrom) d = d && log.timestampMs >= new Date(dateFrom).getTime()
      if (dateTo) d = d && log.timestampMs <= (new Date(dateTo).getTime() + 86400000 - 1)
      return m && a && mod && d
    })
    list = list.sort((a, b) => sortDir === "desc" ? b.timestampMs - a.timestampMs : a.timestampMs - b.timestampMs)
    return list
  }, [searchQuery, actionFilter, moduleFilter, dateFrom, dateTo, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const today = new Date().toDateString()
  const todayCount = allLogs.filter((l) => new Date(l.timestampMs).toDateString() === today).length
  const criticalCount = allLogs.filter((l) => l.action === "deleted").length
  const uniqueUsers = new Set(allLogs.map((l) => l.user.name)).size

  const handleExport = (format: string) => {
    toast.success(`Exporting ${filtered.length} logs as ${format.toUpperCase()}...`)
  }

  return (
    <>
      <DashboardHeader title="Audit Logs" description="Complete system activity log for security and compliance" />
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Activity} label="Total Logs" value={allLogs.length} color="bg-primary/10 text-primary" />
          <StatCard icon={Calendar} label="Today" value={todayCount} color="bg-success/10 text-success" />
          <StatCard icon={AlertTriangle} label="Delete Actions" value={criticalCount} color="bg-destructive/10 text-destructive" />
          <StatCard icon={Users} label="Active Users" value={uniqueUsers} color="bg-warning/10 text-warning" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs by user or description..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                className="w-full sm:w-64 pl-8"
              />
            </div>

            {/* Action filter */}
            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Actions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="downloaded">Downloaded</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>

            {/* Module filter */}
            <Select value={moduleFilter} onValueChange={(v) => { setModuleFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Modules" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Patients">Patients</SelectItem>
                <SelectItem value="Visits">Visits</SelectItem>
                <SelectItem value="Documents">Documents</SelectItem>
                <SelectItem value="Studies">Studies</SelectItem>
                <SelectItem value="Users">Users</SelectItem>
                <SelectItem value="Roles">Roles</SelectItem>
                <SelectItem value="Email Center">Email Center</SelectItem>
              </SelectContent>
            </Select>

            {/* Date range */}
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="w-full sm:w-36 text-sm" placeholder="From" />
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="w-full sm:w-36 text-sm" placeholder="To" />

            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); setPage(1) }}>
                Clear dates
              </Button>
            )}
          </div>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" />Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="mr-2 size-4" />Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileText className="mr-2 size-4" />Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 size-4" />Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead
                    className="cursor-pointer select-none whitespace-nowrap"
                    onClick={() => { setSortDir((d) => d === "desc" ? "asc" : "desc"); setPage(1) }}
                  >
                    <span className="flex items-center gap-1">
                      Timestamp <ArrowUpDown className="size-3.5" />
                    </span>
                  </TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No logs match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{log.user.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm whitespace-nowrap">{log.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={actionColors[log.action] ?? "bg-muted text-muted-foreground border-0"}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{log.module}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-[320px]">{log.description}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{log.ip}</code>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} logs
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="w-8"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

      </div>
    </>
  )
}
