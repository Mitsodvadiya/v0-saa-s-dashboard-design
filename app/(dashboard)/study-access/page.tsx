"use client"

import { useState, useMemo } from "react"
import {
    BookLock,
    Users,
    Plus,
    X,
    Search,
    Shield,
    Check,
    Beaker,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { STUDIES, USER_STUDY_ASSIGNMENTS, ROLE_STUDY_POLICY, type Study } from "@/lib/study-access-data"

// ── Mock users (must match users/page.tsx for consistency) ──────────────────
const ALL_USERS = [
    { id: "USR-001", name: "Dr. Sarah Chen", initials: "SC", role: "Admin", email: "sarah.chen@hospital.org" },
    { id: "USR-002", name: "Dr. James Wilson", initials: "JW", role: "Supervisor", email: "james.wilson@hospital.org" },
    { id: "USR-003", name: "Emily Roberts", initials: "ER", role: "Coordinator", email: "emily.roberts@hospital.org" },
    { id: "USR-004", name: "Dr. Michael Park", initials: "MP", role: "Investigator", email: "michael.park@hospital.org" },
    { id: "USR-005", name: "Lisa Thompson", initials: "LT", role: "Coordinator", email: "lisa.thompson@hospital.org" },
    { id: "USR-006", name: "Robert Martinez", initials: "RM", role: "CRA", email: "robert.martinez@pfizer.com" },
    { id: "USR-007", name: "Dr. Nancy White", initials: "NW", role: "Investigator", email: "nancy.white@hospital.org" },
    { id: "USR-008", name: "Priya Sharma", initials: "PS", role: "Coordinator", email: "priya.sharma@hospital.org" },
    { id: "USR-009", name: "David Kim", initials: "DK", role: "CRA", email: "david.kim@novartis.com" },
    { id: "USR-010", name: "Angela Foster", initials: "AF", role: "Supervisor", email: "angela.foster@hospital.org" },
]

const roleColors: Record<string, string> = {
    Admin: "bg-destructive/10 text-destructive border-0",
    Supervisor: "bg-primary/10 text-primary border-0",
    Coordinator: "bg-success/10 text-success border-0",
    Investigator: "bg-warning/10 text-warning border-0",
    CRA: "bg-muted text-muted-foreground border-0",
}

const statusColor: Record<string, string> = {
    "Active": "bg-success/10 text-success border-0",
    "Recruiting": "bg-primary/10 text-primary border-0",
    "On Hold": "bg-warning/10 text-warning border-0",
    "Completed": "bg-muted text-muted-foreground border-0",
}

// ── Manage Users Dialog ───────────────────────────────────────────────────────
function ManageUsersDialog({
    study,
    assignments,
    open,
    onClose,
    onSave,
}: {
    study: Study | null
    assignments: Record<string, string[]>
    open: boolean
    onClose: () => void
    onSave: (studyId: string, userIds: string[]) => void
}) {
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<string[]>([])

    useMemo(() => {
        if (study) setSelected(assignments[study.id] ?? [])
    }, [study, open, assignments])

    if (!study) return null

    const toggle = (uid: string) =>
        setSelected((prev) => prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid])

    const filteredUsers = ALL_USERS.filter(
        (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Access — {study.shortName}</DialogTitle>
                    <DialogDescription>
                        {study.name} · {study.sponsor} · {study.phase}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Info banner */}
                    <div className="rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
                        Admins always have access to all studies. Changes here apply to non-admin users only.
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <div className="rounded-md border divide-y max-h-64 overflow-y-auto">
                        {filteredUsers.map((user) => {
                            const isAdmin = user.role === "Admin"
                            const checked = isAdmin || selected.includes(user.id)
                            return (
                                <label
                                    key={user.id}
                                    className={`flex items-center gap-3 p-2.5 transition-colors ${isAdmin ? "opacity-60 cursor-default" : "cursor-pointer hover:bg-muted/50"}`}
                                >
                                    <Checkbox
                                        checked={checked}
                                        disabled={isAdmin}
                                        onCheckedChange={() => !isAdmin && toggle(user.id)}
                                    />
                                    <Avatar className="size-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{user.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Badge className={`${roleColors[user.role]} text-xs shrink-0`}>{user.role}</Badge>
                                </label>
                            )
                        })}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {selected.filter(id => ALL_USERS.find(u => u.id === id)?.role !== "Admin").length} non-admin users selected
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { onSave(study.id, selected); onClose() }}>
                        <Check className="mr-2 size-4" />Save Access
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ── Study Access Card ─────────────────────────────────────────────────────────
function StudyCard({
    study,
    assignedIds,
    onManage,
}: {
    study: Study
    assignedIds: string[]
    onManage: () => void
}) {
    const assignedUsers = ALL_USERS.filter((u) => assignedIds.includes(u.id))
    const nonAdmins = assignedUsers.filter((u) => u.role !== "Admin")
    const admins = assignedUsers.filter((u) => u.role === "Admin")

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${study.color}`}>
                            <Beaker className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-semibold">{study.shortName}</CardTitle>
                            <CardDescription className="text-xs mt-0.5 line-clamp-1">{study.sponsor} · {study.phase}</CardDescription>
                        </div>
                    </div>
                    <Badge className={`${statusColor[study.status] ?? "bg-muted border-0"} shrink-0 text-xs`}>{study.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <Separator />
                {/* Assigned users */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">Assigned Users ({assignedUsers.length})</p>
                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={onManage}>
                            <Users className="mr-1 size-3" />Manage
                        </Button>
                    </div>
                    {assignedUsers.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No users assigned</p>
                    ) : (
                        <div className="space-y-1">
                            {/* Admin row */}
                            {admins.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <div className="flex -space-x-1">
                                        {admins.slice(0, 2).map((u) => (
                                            <Avatar key={u.id} className="size-6 border border-background">
                                                <AvatarFallback className="bg-destructive/10 text-destructive text-[10px]">{u.initials}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Admin (full access)</span>
                                </div>
                            )}
                            {/* Non-admin avatars */}
                            {nonAdmins.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <div className="flex -space-x-1">
                                        {nonAdmins.slice(0, 5).map((u) => (
                                            <Avatar key={u.id} className="size-6 border border-background" title={u.name}>
                                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{u.initials}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    {nonAdmins.length > 5 && (
                                        <span className="text-xs text-muted-foreground">+{nonAdmins.length - 5} more</span>
                                    )}
                                </div>
                            )}
                            {/* Name list for small counts */}
                            {nonAdmins.length > 0 && nonAdmins.length <= 4 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {nonAdmins.map((u) => (
                                        <Badge key={u.id} variant="secondary" className="text-xs">{u.name.split(" ").slice(-1)[0]}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

// ── Full assignment table view ────────────────────────────────────────────────
function AssignmentTable({ assignments }: { assignments: Record<string, string[]> }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Study ↔ User Assignment Matrix</CardTitle>
                <CardDescription className="text-xs">Overview of which users can access each study</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[160px]">User</TableHead>
                                {STUDIES.map((s) => (
                                    <TableHead key={s.id} className="text-center text-xs min-w-[90px]">{s.shortName}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ALL_USERS.map((user) => {
                                const isAdmin = user.role === "Admin"
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-7">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{user.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-medium leading-tight">{user.name}</p>
                                                    <Badge className={`${roleColors[user.role]} text-[10px] px-1 py-0`}>{user.role}</Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        {STUDIES.map((study) => {
                                            const hasAccess = isAdmin || (assignments[study.id] ?? []).includes(user.id)
                                            return (
                                                <TableCell key={study.id} className="text-center">
                                                    {hasAccess ? (
                                                        <Check className={`size-4 mx-auto ${isAdmin ? "text-destructive" : "text-success"}`} />
                                                    ) : (
                                                        <X className="size-4 mx-auto text-muted-foreground/30" />
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudyAccessPage() {
    // Build initial: study.id → [userIds]
    const buildInitialAssignments = () => {
        const map: Record<string, string[]> = {}
        STUDIES.forEach((s) => {
            map[s.id] = ALL_USERS
                .filter((u) => (USER_STUDY_ASSIGNMENTS[u.id] ?? []).includes(s.id) && u.role !== "Admin")
                .map((u) => u.id)
        })
        return map
    }

    const [assignments, setAssignments] = useState<Record<string, string[]>>(buildInitialAssignments)
    const [selectedStudy, setSelectedStudy] = useState<Study | null>(null)
    const [manageOpen, setManageOpen] = useState(false)
    const [view, setView] = useState<"cards" | "matrix">("cards")

    const handleSave = (studyId: string, userIds: string[]) => {
        setAssignments((prev) => ({ ...prev, [studyId]: userIds }))
        toast.success("Study access updated")
    }

    const totalAssignedUsers = useMemo(() => {
        const ids = new Set<string>()
        Object.values(assignments).forEach((uids) => uids.forEach((id) => ids.add(id)))
        // add admins
        ALL_USERS.filter((u) => u.role === "Admin").forEach((u) => ids.add(u.id))
        return ids.size
    }, [assignments])

    return (
        <>
            <DashboardHeader
                title="Study Access"
                description="Control which employees can access each clinical study"
            />
            <div className="flex-1 overflow-auto p-6 space-y-6">

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Beaker className="size-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{STUDIES.length}</p>
                                <p className="text-xs text-muted-foreground">Total Studies</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                                <Users className="size-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalAssignedUsers}</p>
                                <p className="text-xs text-muted-foreground">Users with Access</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                <Shield className="size-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{ALL_USERS.filter(u => u.role === "Admin").length}</p>
                                <p className="text-xs text-muted-foreground">Admins (All Studies)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Role Policy Reference */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Study Access Policies by Role</CardTitle>
                        <CardDescription className="text-xs">Layer 2 access control — who can see which studies</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(ROLE_STUDY_POLICY).map(([role, policy]) => (
                                <div key={role} className="flex items-center gap-2 rounded-md border px-3 py-2">
                                    <Badge className={`${roleColors[role]} text-xs`}>{role}</Badge>
                                    <span className="text-xs text-muted-foreground">→</span>
                                    <Badge className={`${policy.color} border-0 text-xs`}>{policy.label}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* View toggle + header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                        {STUDIES.filter(s => s.status === "Active" || s.status === "Recruiting").length} active / recruiting studies
                    </p>
                    <div className="flex gap-2">
                        <Button variant={view === "cards" ? "default" : "outline"} size="sm" onClick={() => setView("cards")}>
                            Study Cards
                        </Button>
                        <Button variant={view === "matrix" ? "default" : "outline"} size="sm" onClick={() => setView("matrix")}>
                            Access Matrix
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {view === "cards" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {STUDIES.map((study) => {
                            const adminIds = ALL_USERS.filter(u => u.role === "Admin").map(u => u.id)
                            const allIds = [...new Set([...adminIds, ...(assignments[study.id] ?? [])])]
                            return (
                                <StudyCard
                                    key={study.id}
                                    study={study}
                                    assignedIds={allIds}
                                    onManage={() => { setSelectedStudy(study); setManageOpen(true) }}
                                />
                            )
                        })}
                    </div>
                ) : (
                    <AssignmentTable assignments={assignments} />
                )}
            </div>

            <ManageUsersDialog
                study={selectedStudy}
                assignments={assignments}
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                onSave={handleSave}
            />
        </>
    )
}
