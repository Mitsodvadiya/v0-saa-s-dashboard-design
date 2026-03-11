"use client"

import { useState, useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Key,
  MoreHorizontal,
  Power,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Lock,
  Upload,
  BookOpen,
  X,
  Check,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { STUDIES, USER_STUDY_ASSIGNMENTS, ROLE_STUDY_POLICY } from "@/lib/study-access-data"

// ── Types ────────────────────────────────────────────────────────────────────
type Role = "Admin" | "Supervisor" | "Coordinator" | "Investigator" | "CRA"
type Status = "active" | "inactive"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  department: string
  status: Status
  lastLogin: string
  createdDate: string
  notes: string
  initials: string
  forcePasswordReset: boolean
  assignedStudies: string[]  // array of Study IDs
}

// ── Mock data ────────────────────────────────────────────────────────────────
const initialUsers: User[] = [
  { id: "USR-001", name: "Dr. Sarah Chen", email: "sarah.chen@hospital.org", phone: "+1 (555) 101-0001", role: "Admin", department: "Clinical Research", status: "active", lastLogin: "Mar 11, 2024 10:30 AM", createdDate: "Jan 15, 2023", notes: "Principal Investigator and system administrator.", initials: "SC", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-001"] },
  { id: "USR-002", name: "Dr. James Wilson", email: "james.wilson@hospital.org", phone: "+1 (555) 101-0002", role: "Supervisor", department: "Oncology", status: "active", lastLogin: "Mar 11, 2024 09:15 AM", createdDate: "Feb 03, 2023", notes: "Lead oncology supervisor for BEACON-2024.", initials: "JW", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-002"] },
  { id: "USR-003", name: "Emily Roberts", email: "emily.roberts@hospital.org", phone: "+1 (555) 101-0003", role: "Coordinator", department: "Clinical Research", status: "active", lastLogin: "Mar 10, 2024 03:45 PM", createdDate: "Mar 12, 2023", notes: "Manages patient scheduling and documentation.", initials: "ER", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-003"] },
  { id: "USR-004", name: "Dr. Michael Park", email: "michael.park@hospital.org", phone: "+1 (555) 101-0004", role: "Investigator", department: "Cardiology", status: "active", lastLogin: "Mar 09, 2024 11:00 AM", createdDate: "Apr 20, 2023", notes: "Sub-investigator for cardiology studies.", initials: "MP", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-004"] },
  { id: "USR-005", name: "Lisa Thompson", email: "lisa.thompson@hospital.org", phone: "+1 (555) 101-0005", role: "Coordinator", department: "Data Management", status: "inactive", lastLogin: "Feb 28, 2024 02:00 PM", createdDate: "Jun 01, 2023", notes: "On extended leave. Account deactivated.", initials: "LT", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-005"] },
  { id: "USR-006", name: "Robert Martinez", email: "robert.martinez@pfizer.com", phone: "+1 (555) 202-0001", role: "CRA", department: "Administration", status: "active", lastLogin: "Mar 11, 2024 08:00 AM", createdDate: "Jul 15, 2023", notes: "Pfizer CRA — monitor for BEACON-2024.", initials: "RM", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-006"] },
  { id: "USR-007", name: "Dr. Nancy White", email: "nancy.white@hospital.org", phone: "+1 (555) 101-0007", role: "Investigator", department: "Neurology", status: "active", lastLogin: "Mar 10, 2024 04:30 PM", createdDate: "Aug 10, 2023", notes: "Neurology sub-investigator for NOVA-Trial.", initials: "NW", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-007"] },
  { id: "USR-008", name: "Priya Sharma", email: "priya.sharma@hospital.org", phone: "+1 (555) 101-0008", role: "Coordinator", department: "Clinical Research", status: "active", lastLogin: "Mar 11, 2024 07:45 AM", createdDate: "Sep 05, 2023", notes: "", initials: "PS", forcePasswordReset: true, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-008"] },
  { id: "USR-009", name: "David Kim", email: "david.kim@novartis.com", phone: "+1 (555) 303-0001", role: "CRA", department: "Administration", status: "active", lastLogin: "Mar 08, 2024 01:00 PM", createdDate: "Oct 20, 2023", notes: "Novartis CRA for AURORA-Phase2.", initials: "DK", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-009"] },
  { id: "USR-010", name: "Angela Foster", email: "angela.foster@hospital.org", phone: "+1 (555) 101-0010", role: "Supervisor", department: "Data Management", status: "inactive", lastLogin: "Jan 15, 2024 10:00 AM", createdDate: "Nov 01, 2023", notes: "Data management supervisor. Account under review.", initials: "AF", forcePasswordReset: false, assignedStudies: USER_STUDY_ASSIGNMENTS["USR-010"] },
]

const roleColors: Record<Role, string> = {
  Admin: "bg-destructive/10 text-destructive border-0",
  Supervisor: "bg-primary/10 text-primary border-0",
  Coordinator: "bg-success/10 text-success border-0",
  Investigator: "bg-warning/10 text-warning border-0",
  CRA: "bg-muted text-muted-foreground border-0",
}

const departments = ["Clinical Research", "Data Management", "Administration", "Oncology", "Cardiology", "Neurology"]
const PAGE_SIZE = 7

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function makeInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

// ── Study multi-select ────────────────────────────────────────────────────────
function StudyMultiSelect({
  selected,
  onChange,
  isAdmin,
}: {
  selected: string[]
  onChange: (ids: string[]) => void
  isAdmin: boolean
}) {
  const toggle = (id: string) => {
    if (isAdmin) return // admin always gets all
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  if (isAdmin) {
    return (
      <div className="rounded-md border bg-muted/50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Shield className="size-4 text-destructive" />
          <span className="text-destructive font-semibold">Admin — Full Access to All Studies</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6">Admins automatically have unrestricted access to all current and future studies.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((id) => {
            const study = STUDIES.find((s) => s.id === id)
            if (!study) return null
            return (
              <span key={id} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">
                {study.shortName}
                <button onClick={() => toggle(id)} className="hover:text-destructive transition-colors ml-0.5">
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Study checkboxes */}
      <div className="rounded-md border divide-y max-h-48 overflow-y-auto">
        {STUDIES.map((study) => {
          const checked = selected.includes(study.id)
          return (
            <label key={study.id} className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggle(study.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{study.shortName}</p>
                <p className="text-xs text-muted-foreground">{study.sponsor} · {study.phase}</p>
              </div>
              <Badge variant="outline" className={`text-xs shrink-0 ${study.color} border-0`}>
                {study.status}
              </Badge>
            </label>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-destructive">Select at least one study to grant data access.</p>
      )}
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ── View User Dialog ──────────────────────────────────────────────────────────
function ViewUserDialog({ user, open, onClose }: { user: User | null; open: boolean; onClose: () => void }) {
  if (!user) return null
  const policy = ROLE_STUDY_POLICY[user.role]
  const assignedStudyObjects = STUDIES.filter((s) => user.assignedStudies.includes(s.id))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Full profile details for {user.name}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-2">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-1">
              <Badge className={roleColors[user.role]}>{user.role}</Badge>
              {policy && (
                <Badge className={`${policy.color} border-0 text-xs`}>{policy.label}</Badge>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">User ID</p><p className="font-medium">{user.id}</p></div>
          <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{user.phone || "—"}</p></div>
          <div><p className="text-muted-foreground text-xs">Department</p><p className="font-medium">{user.department}</p></div>
          <div>
            <p className="text-muted-foreground text-xs">Status</p>
            <span className={`font-medium capitalize ${user.status === "active" ? "text-green-600" : "text-muted-foreground"}`}>● {user.status}</span>
          </div>
          <div><p className="text-muted-foreground text-xs">Last Login</p><p className="font-medium">{user.lastLogin}</p></div>
          <div><p className="text-muted-foreground text-xs">Created</p><p className="font-medium">{user.createdDate}</p></div>
          {user.forcePasswordReset && (
            <div className="col-span-2">
              <Badge className="bg-warning/10 text-warning border-0 text-xs">Force password reset on next login</Badge>
            </div>
          )}
          {user.notes && (
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Notes</p>
              <p className="font-medium">{user.notes}</p>
            </div>
          )}
        </div>

        {/* Assigned Studies */}
        <Separator />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-4 text-primary" />
            <p className="text-sm font-semibold">Assigned Studies</p>
            {user.role === "Admin" && (
              <Badge className="bg-destructive/10 text-destructive border-0 text-xs ml-auto">All Studies (Admin)</Badge>
            )}
          </div>
          {assignedStudyObjects.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No studies assigned</p>
          ) : (
            <div className="space-y-2">
              {assignedStudyObjects.map((study) => (
                <div key={study.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{study.shortName}</p>
                    <p className="text-xs text-muted-foreground">{study.sponsor} · {study.phase}</p>
                  </div>
                  <Badge className={`${study.color} border-0 text-xs`}>{study.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Add / Edit User Dialog ────────────────────────────────────────────────────
interface UserFormProps {
  open: boolean
  mode: "add" | "edit"
  initial: Partial<User>
  onClose: () => void
  onSave: (data: Partial<User>) => void
}

function UserFormDialog({ open, mode, initial, onClose, onSave }: UserFormProps) {
  const [form, setForm] = useState<Partial<User>>(initial)
  const [generatedPassword] = useState(generatePassword)

  useMemo(() => { setForm(initial) }, [initial, open])

  const set = (k: keyof User, v: unknown) => setForm((p) => ({ ...p, [k]: v }))
  const isAdmin = form.role === "Admin"

  // When role changes to Admin, auto-assign all studies
  const handleRoleChange = (v: string) => {
    set("role", v)
    if (v === "Admin") {
      set("assignedStudies", STUDIES.map((s) => s.id))
    }
  }

  const handleSave = () => {
    if (!form.name?.trim()) { toast.error("Full Name is required"); return }
    if (!form.email?.trim()) { toast.error("Email Address is required"); return }
    if (!form.role) { toast.error("Role is required"); return }
    if (!isAdmin && (!form.assignedStudies || form.assignedStudies.length === 0)) {
      toast.error("Assign at least one study"); return
    }
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Fill in the details to create a new system user." : `Editing profile for ${initial.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base bg-primary/10 text-primary">
                {form.name ? makeInitials(form.name) : "??"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" type="button">
              <Upload className="mr-2 size-3.5" />Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground">JPG or PNG · max 2 MB</p>
          </div>
          <Separator />

          {/* Basic Info */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input className="mt-1" placeholder="Dr. John Doe" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email Address *</label>
                <Input className="mt-1" type="email" placeholder="user@hospital.org" value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input className="mt-1" type="tel" placeholder="+1 (555) 000-0000" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Role Assignment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Role *</label>
                <Select value={form.role || ""} onValueChange={handleRoleChange}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Investigator">Investigator</SelectItem>
                    <SelectItem value="CRA">CRA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select value={form.department || ""} onValueChange={(v) => set("department", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ── Study Access ────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Study Access *</p>
              {!isAdmin && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {form.assignedStudies?.length ?? 0} of {STUDIES.length} selected
                </span>
              )}
            </div>
            <StudyMultiSelect
              selected={form.assignedStudies ?? []}
              onChange={(ids) => set("assignedStudies", ids)}
              isAdmin={isAdmin}
            />
          </div>

          {/* Account Settings */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Account Status</label>
                <Select value={form.status || "active"} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {mode === "add" && (
                <div>
                  <label className="text-sm font-medium">Temporary Password</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={generatedPassword} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" type="button" onClick={() => { navigator.clipboard?.writeText(generatedPassword); toast.success("Password copied!") }}>
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated. User must change on first login.</p>
                </div>
              )}
              {mode === "edit" && (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Force Password Reset</p>
                    <p className="text-xs text-muted-foreground">Require user to reset password at next login</p>
                  </div>
                  <Switch checked={!!form.forcePasswordReset} onCheckedChange={(v) => set("forcePasswordReset", v)} />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea className="mt-1 resize-none" rows={2} placeholder="Optional notes about this user..." value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {mode === "add" ? <><UserPlus className="mr-2 size-4" />Create User</> : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)

  const [viewUser, setViewUser] = useState<User | null>(null)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [formUser, setFormUser] = useState<Partial<User>>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = searchQuery.toLowerCase()
      const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = roleFilter === "all" || u.role === roleFilter
      const matchStatus = statusFilter === "all" || u.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
    list = list.sort((a, b) => {
      const da = new Date(a.createdDate).getTime()
      const db = new Date(b.createdDate).getTime()
      return sortDir === "desc" ? db - da : da - db
    })
    return list
  }, [users, searchQuery, roleFilter, statusFilter, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    admins: users.filter((u) => u.role === "Admin").length,
  }), [users])

  const openAdd = () => {
    setFormMode("add")
    setFormUser({ status: "active", forcePasswordReset: true, assignedStudies: [] })
    setIsFormOpen(true)
  }

  const openEdit = (user: User) => {
    setFormMode("edit")
    setFormUser({ ...user })
    setIsFormOpen(true)
  }

  const handleSave = (data: Partial<User>) => {
    if (formMode === "add") {
      const newUser: User = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: data.name!,
        email: data.email!,
        phone: data.phone || "",
        role: data.role as Role,
        department: data.department || "Clinical Research",
        status: (data.status as Status) || "active",
        lastLogin: "Never",
        createdDate: "Mar 11, 2024",
        notes: data.notes || "",
        initials: makeInitials(data.name!),
        forcePasswordReset: true,
        assignedStudies: data.assignedStudies ?? [],
      }
      setUsers([...users, newUser])
      toast.success("User created successfully")
    } else {
      setUsers(users.map((u) => u.id === data.id ? { ...u, ...data } as User : u))
      toast.success("User updated successfully")
    }
    setIsFormOpen(false)
    setPage(1)
  }

  const handleResetPassword = () => {
    if (!selectedUser) return
    setIsResetPasswordOpen(false)
    toast.success(`Password reset email sent to ${selectedUser.email}`)
  }

  const handleDeactivate = () => {
    if (!selectedUser) return
    const next = selectedUser.status === "active" ? "inactive" : "active"
    setUsers(users.map((u) => u.id === selectedUser.id ? { ...u, status: next } : u))
    setIsDeactivateOpen(false)
    toast.success(`User ${next === "inactive" ? "deactivated" : "activated"} successfully`)
  }

  const handleDelete = () => {
    if (!selectedUser) return
    setUsers(users.filter((u) => u.id !== selectedUser.id))
    setIsDeleteOpen(false)
    toast.success("User deleted")
  }

  return (
    <>
      <DashboardHeader title="Users" description="Manage system users and study access" />
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Users} label="Total Users" value={stats.total} color="bg-primary/10 text-primary" />
          <StatCard icon={UserCheck} label="Active" value={stats.active} color="bg-success/10 text-success" />
          <StatCard icon={UserX} label="Inactive" value={stats.inactive} color="bg-muted text-muted-foreground" />
          <StatCard icon={Lock} label="Admins" value={stats.admins} color="bg-destructive/10 text-destructive" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }} className="w-full sm:w-60 pl-8" />
            </div>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Coordinator">Coordinator</SelectItem>
                <SelectItem value="Investigator">Investigator</SelectItem>
                <SelectItem value="CRA">CRA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAdd}>
            <UserPlus className="mr-2 size-4" />Add User
          </Button>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Studies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}>
                    Created {sortDir === "desc" ? "↓" : "↑"}
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No users match your filters</TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user) => {
                    const isFullAccess = user.role === "Admin"
                    const studyCount = user.assignedStudies.length
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">{user.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={roleColors[user.role]}>{user.role}</Badge></TableCell>
                        <TableCell className="text-sm">{user.department}</TableCell>
                        {/* Studies column */}
                        <TableCell>
                          {isFullAccess ? (
                            <Badge className="bg-destructive/10 text-destructive border-0 text-xs gap-1">
                              <Shield className="size-3" />All
                            </Badge>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium hover:bg-primary/20 transition-colors"
                              onClick={() => setViewUser(user)}
                              title={user.assignedStudies.map(id => STUDIES.find(s => s.id === id)?.shortName).join(", ")}
                            >
                              <BookOpen className="size-3" />
                              {studyCount} {studyCount === 1 ? "study" : "studies"}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${user.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                            <span className="text-sm capitalize">{user.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{user.lastLogin}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.createdDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setViewUser(user)}>
                                <Eye className="mr-2 size-4" />View User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEdit(user)}>
                                <Edit2 className="mr-2 size-4" />Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsResetPasswordOpen(true) }}>
                                <Key className="mr-2 size-4" />Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className={user.status === "active" ? "text-warning" : "text-success"}
                                onClick={() => { setSelectedUser(user); setIsDeactivateOpen(true) }}
                              >
                                <Power className="mr-2 size-4" />
                                {user.status === "active" ? "Deactivate" : "Activate"} User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => { setSelectedUser(user); setIsDeleteOpen(true) }}
                              >
                                <Trash2 className="mr-2 size-4" />Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ViewUserDialog user={viewUser} open={!!viewUser} onClose={() => setViewUser(null)} />

      <UserFormDialog open={isFormOpen} mode={formMode} initial={formUser} onClose={() => setIsFormOpen(false)} onSave={handleSave} />

      <AlertDialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>Send a password reset email to <strong>{selectedUser?.email}</strong>. The user must create a new password to regain access.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedUser?.status === "active" ? "Deactivate" : "Activate"} User</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "active"
                ? `${selectedUser?.name} will no longer be able to access the system.`
                : `${selectedUser?.name} will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>{selectedUser?.status === "active" ? "Deactivate" : "Activate"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User "{selectedUser?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the user and revoke all their study access. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
