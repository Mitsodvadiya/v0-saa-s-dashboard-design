"use client"

import { useState, useMemo } from "react"
import {
    Users,
    Search,
    Check,
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
import { toast } from "sonner"
import { STUDIES, USER_STUDY_ASSIGNMENTS, type Study } from "@/lib/study-access-data"

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

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold">{study.shortName}</CardTitle>
                    <Button variant="outline" size="sm" className="h-8 text-xs px-2" onClick={onManage}>
                        <Users className="mr-1 size-3" />Manage Access
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                <Separator />
                <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Persons with access:</p>
                    {assignedUsers.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic px-1">No users assigned</p>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {assignedUsers.map((u) => (
                                <Badge
                                    key={u.id}
                                    variant="secondary"
                                    className={`text-[10px] py-0 h-5 ${u.role === "Admin" ? "bg-destructive/10 text-destructive border-transparent" : ""}`}
                                >
                                    {u.name} {u.role === "Admin" && "(Admin)"}
                                </Badge>
                            ))}
                        </div>
                    )}
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

    const handleSave = (studyId: string, userIds: string[]) => {
        setAssignments((prev) => ({ ...prev, [studyId]: userIds }))
        toast.success("Study access updated")
    }


    return (
        <>
            <DashboardHeader
                title="Study Access"
                description="Control which employees can access each clinical study"
            />
            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
