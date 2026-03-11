"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Shield,
  Edit2,
  Trash2,
  MoreHorizontal,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react"
import { ROLE_STUDY_POLICY } from "@/lib/study-access-data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// ── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  "Dashboard",
  "Sponsors",
  "Studies",
  "Patients",
  "Visits",
  "Calendar",
  "Documents",
  "Analytics",
  "Email Center",
  "Chat",
  "Users",
  "Settings",
]

// permissions index: [View, Create, Edit, Delete]
const PERMS = ["View", "Create", "Edit", "Delete"]

type PermMatrix = Record<string, boolean[]>

interface Role {
  id: string
  name: string
  description: string
  users: number
  color: string
  createdDate: string
  permissions: PermMatrix
}

const buildMatrix = (preset: boolean[][]): PermMatrix => {
  const m: PermMatrix = {}
  MODULES.forEach((mod, i) => { m[mod] = preset[i] ?? [false, false, false, false] })
  return m
}

// preset rows: [View, Create, Edit, Delete] for each module
const initialRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access — manages users, roles, and all modules.",
    users: 2,
    color: "bg-destructive/10 text-destructive",
    createdDate: "Jan 10, 2023",
    permissions: buildMatrix(MODULES.map(() => [true, true, true, true])),
  },
  {
    id: "supervisor",
    name: "Supervisor",
    description: "Manages studies, patients, and coordinates clinical teams.",
    users: 3,
    color: "bg-primary/10 text-primary",
    createdDate: "Jan 12, 2023",
    permissions: buildMatrix([
      [true, false, false, false],   // Dashboard
      [true, false, false, false],   // Sponsors
      [true, true, true, false],     // Studies
      [true, true, true, false],     // Patients
      [true, true, true, true],      // Visits
      [true, true, true, false],     // Calendar
      [true, true, true, true],      // Documents
      [true, false, false, false],   // Analytics
      [true, true, true, false],     // Email Center
      [true, true, true, false],     // Chat
      [true, false, false, false],   // Users
      [true, true, false, false],    // Settings
    ]),
  },
  {
    id: "coordinator",
    name: "Coordinator",
    description: "Manages patient visits, documents, and scheduling.",
    users: 8,
    color: "bg-success/10 text-success",
    createdDate: "Feb 01, 2023",
    permissions: buildMatrix([
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, true, true, false],
      [true, true, true, true],
      [true, true, true, false],
      [true, true, true, true],
      [true, false, false, false],
      [true, true, true, false],
      [true, true, true, false],
      [false, false, false, false],
      [true, true, false, false],
    ]),
  },
  {
    id: "investigator",
    name: "Investigator",
    description: "Views patient data and study progress; limited write access.",
    users: 12,
    color: "bg-warning/10 text-warning",
    createdDate: "Feb 14, 2023",
    permissions: buildMatrix([
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, true, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, true, true, false],
      [false, false, false, false],
      [true, true, false, false],
    ]),
  },
  {
    id: "cra",
    name: "CRA",
    description: "Sponsor representative with read-only monitoring access.",
    users: 5,
    color: "bg-muted text-muted-foreground",
    createdDate: "Mar 05, 2023",
    permissions: buildMatrix([
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
      [true, true, true, false],
      [false, false, false, false],
      [true, false, false, false],
    ]),
  },
]

const ASSIGNED_USERS: Record<string, string[]> = {
  admin: ["Dr. Sarah Chen", "Dr. James Wilson"],
  supervisor: ["Emily Roberts", "Dr. Michael Park", "Angela Foster"],
  coordinator: ["Lisa Thompson", "Priya Sharma", "Tom Baker", "Jane Doe", "Mark Lee", "Ann Wong", "Brett Russo", "Cleo North"],
  investigator: ["Dr. Nancy White", "Dr. Kevin Hart", "Dr. Olivia Scott"],
  cra: ["Robert Martinez", "David Kim"],
}

// ── Permission Matrix row ─────────────────────────────────────────────────────
function PermRow({
  module,
  perms,
  editable,
  onChange,
}: {
  module: string
  perms: boolean[]
  editable: boolean
  onChange?: (idx: number, val: boolean) => void
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{module}</TableCell>
      {perms.map((checked, idx) => (
        <TableCell key={idx} className="text-center">
          {editable ? (
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => onChange?.(idx, v as boolean)}
            />
          ) : (
            checked
              ? <Check className="size-4 text-success mx-auto" />
              : <span className="text-muted-foreground text-lg leading-none mx-auto block text-center">—</span>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

// ── Role Form Dialog ──────────────────────────────────────────────────────────
function RoleFormDialog({
  open,
  mode,
  role,
  onClose,
  onSave,
}: {
  open: boolean
  mode: "create" | "edit"
  role: Role | null
  onClose: () => void
  onSave: (data: { name: string; description: string; permissions: PermMatrix }) => void
}) {
  const emptyMatrix = buildMatrix(MODULES.map(() => [false, false, false, false]))
  const [name, setName] = useState(role?.name ?? "")
  const [description, setDescription] = useState(role?.description ?? "")
  const [permissions, setPermissions] = useState<PermMatrix>(role?.permissions ?? emptyMatrix)

  // sync when role changes
  useMemo(() => {
    setName(role?.name ?? "")
    setDescription(role?.description ?? "")
    setPermissions(role?.permissions ?? emptyMatrix)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, open])

  const handlePermChange = (module: string, idx: number, val: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: prev[module].map((p, i) => (i === idx ? val : p)),
    }))
  }

  const handleSave = () => {
    if (!name.trim()) { toast.error("Role Name is required"); return }
    onSave({ name, description, permissions })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Role" : "Edit Role"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Define a new role and configure module permissions." : `Update role details and permissions for ${role?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Role Name *</label>
              <Input className="mt-1" placeholder="e.g. Lab Technician" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input className="mt-1" placeholder="Brief description of this role" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* Users assigned – edit mode only */}
          {mode === "edit" && role && (
            <div>
              <p className="text-sm font-medium mb-2">Users Assigned ({ASSIGNED_USERS[role.id]?.length ?? 0})</p>
              <div className="flex flex-wrap gap-1.5">
                {(ASSIGNED_USERS[role.id] ?? []).map((u) => (
                  <Badge key={u} variant="secondary" className="text-xs">{u}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Permission Matrix */}
          <div>
            <p className="text-sm font-medium mb-1">Permission Matrix</p>
            <p className="text-xs text-muted-foreground mb-3">Configure module-level access for this role.</p>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Module</TableHead>
                    {PERMS.map((p) => <TableHead key={p} className="text-center">{p}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULES.map((mod) => (
                    <PermRow
                      key={mod}
                      module={mod}
                      perms={permissions[mod] ?? [false, false, false, false]}
                      editable={true}
                      onChange={(idx, val) => handlePermChange(mod, idx, val)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {mode === "create" ? <><Plus className="mr-2 size-4" />Create Role</> : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── View Permissions Dialog ───────────────────────────────────────────────────
function ViewPermissionsDialog({ role, open, onClose }: { role: Role | null; open: boolean; onClose: () => void }) {
  if (!role) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role.name} — Permissions</DialogTitle>
          <DialogDescription>{role.description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Module</TableHead>
                {PERMS.map((p) => <TableHead key={p} className="text-center">{p}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((mod) => (
                <PermRow key={mod} module={mod} perms={role.permissions[mod]} editable={false} />
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [viewRole, setViewRole] = useState<Role | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const openCreate = () => {
    setFormMode("create")
    setSelectedRole(null)
    setFormOpen(true)
  }

  const openEdit = (r: Role) => {
    setFormMode("edit")
    setSelectedRole(r)
    setFormOpen(true)
  }

  const openView = (r: Role) => {
    setViewRole(r)
    setViewOpen(true)
  }

  const handleSave = (data: { name: string; description: string; permissions: PermMatrix }) => {
    if (formMode === "create") {
      const newRole: Role = {
        id: data.name.toLowerCase().replace(/\s+/g, "-"),
        name: data.name,
        description: data.description,
        users: 0,
        color: "bg-muted text-muted-foreground",
        createdDate: "Mar 11, 2024",
        permissions: data.permissions,
      }
      setRoles([...roles, newRole])
      toast.success("Role created successfully")
    } else if (selectedRole) {
      setRoles(roles.map((r) =>
        r.id === selectedRole.id ? { ...r, ...data } : r
      ))
      toast.success("Role updated successfully")
    }
    setFormOpen(false)
    setSelectedRole(null)
  }

  const handleDelete = () => {
    if (!roleToDelete) return
    setRoles(roles.filter((r) => r.id !== roleToDelete.id))
    setDeleteOpen(false)
    toast.success(`Role "${roleToDelete.name}" deleted`)
    setRoleToDelete(null)
  }

  return (
    <>
      <DashboardHeader title="Roles & Permissions" description="Configure user access levels and system permissions" />
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{roles.length} roles configured</p>
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Create Role
          </Button>
        </div>

        {/* Roles Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Users Assigned</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 items-center justify-center rounded-lg ${role.color}`}>
                          <Shield className="size-4" />
                        </div>
                        <span className="font-semibold">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{role.description}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="gap-1">
                        <Users className="size-3" />{role.users}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{role.createdDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(role)}>
                            <Shield className="mr-2 size-4" />View Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(role)}>
                            <Edit2 className="mr-2 size-4" />Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={role.id === "admin"}
                            onClick={() => { setRoleToDelete(role); setDeleteOpen(true) }}
                          >
                            <Trash2 className="mr-2 size-4" />Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role Cards overview */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Quick Overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => openView(role)}
              >
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${role.color}`}>
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{role.name}</h3>
                      <p className="text-xs text-muted-foreground">{role.users} users</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
                  {/* Study access policy */}
                  {ROLE_STUDY_POLICY[role.name] && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <BookOpen className="size-3 text-muted-foreground" />
                      <Badge className={`${ROLE_STUDY_POLICY[role.name].color} border-0 text-xs`}>
                        {ROLE_STUDY_POLICY[role.name].label}
                      </Badge>
                    </div>
                  )}
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {MODULES.slice(0, 4).map((mod) =>
                      role.permissions[mod]?.[0] ? (
                        <Badge key={mod} variant="secondary" className="text-xs">{mod}</Badge>
                      ) : null
                    )}
                    {MODULES.filter((mod) => role.permissions[mod]?.[0]).length > 4 && (
                      <Badge variant="secondary" className="text-xs">+{MODULES.filter((m) => role.permissions[m]?.[0]).length - 4} more</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RoleFormDialog
        open={formOpen}
        mode={formMode}
        role={selectedRole}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ViewPermissionsDialog
        role={viewRole}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role "{roleToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the role. Users assigned to this role will lose their permissions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
