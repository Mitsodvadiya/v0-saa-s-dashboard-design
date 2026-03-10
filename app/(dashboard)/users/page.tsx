"use client"

import { useState } from "react"
import { Edit2, Key, MoreHorizontal, Power, Search, Shield, UserPlus, Mail } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Supervisor" | "Coordinator" | "Investigator" | "CRA"
  department: string
  status: "active" | "inactive"
  lastActive: string
  avatar: string | null
  initials: string
}

const initialUsers: User[] = [
  {
    id: "USR-001",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@hospital.org",
    role: "Admin",
    department: "Research",
    status: "active",
    lastActive: "2 minutes ago",
    avatar: null,
    initials: "SC",
  },
  {
    id: "USR-002",
    name: "Dr. James Wilson",
    email: "james.wilson@hospital.org",
    role: "Supervisor",
    department: "Oncology",
    status: "active",
    lastActive: "15 minutes ago",
    avatar: null,
    initials: "JW",
  },
  {
    id: "USR-003",
    name: "Emily Roberts",
    email: "emily.roberts@hospital.org",
    role: "Coordinator",
    department: "Research",
    status: "active",
    lastActive: "1 hour ago",
    avatar: null,
    initials: "ER",
  },
  {
    id: "USR-004",
    name: "Dr. Michael Park",
    email: "michael.park@hospital.org",
    role: "Investigator",
    department: "Cardiology",
    status: "active",
    lastActive: "3 hours ago",
    avatar: null,
    initials: "MP",
  },
  {
    id: "USR-005",
    name: "Lisa Thompson",
    email: "lisa.thompson@hospital.org",
    role: "Coordinator",
    department: "Research",
    status: "inactive",
    lastActive: "2 days ago",
    avatar: null,
    initials: "LT",
  },
  {
    id: "USR-006",
    name: "Robert Martinez",
    email: "robert.martinez@pfizer.com",
    role: "CRA",
    department: "Pfizer",
    status: "active",
    lastActive: "30 minutes ago",
    avatar: null,
    initials: "RM",
  },
  {
    id: "USR-007",
    name: "Dr. Nancy White",
    email: "nancy.white@hospital.org",
    role: "Investigator",
    department: "Neurology",
    status: "active",
    lastActive: "45 minutes ago",
    avatar: null,
    initials: "NW",
  },
]

const roleColors = {
  Admin: "bg-destructive/10 text-destructive border-0",
  Supervisor: "bg-primary/10 text-primary border-0",
  Coordinator: "bg-success/10 text-success border-0",
  Investigator: "bg-warning/10 text-warning border-0",
  CRA: "bg-muted text-muted-foreground border-0",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "" as User["role"] | "",
    department: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const resetForm = () => {
    setFormData({ email: "", name: "", role: "", department: "" })
  }

  const handleInvite = () => {
    if (!formData.email || !formData.name || !formData.role) {
      toast.error("Please fill in required fields")
      return
    }
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as User["role"],
      department: formData.department || "General",
      status: "active",
      lastActive: "Just invited",
      avatar: null,
      initials,
    }
    setUsers([...users, newUser])
    setIsInviteOpen(false)
    resetForm()
    toast.success("Invitation sent successfully")
  }

  const handleEditRole = () => {
    if (!selectedUser || !formData.role) {
      toast.error("Please select a role")
      return
    }
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, role: formData.role as User["role"] } : u
      )
    )
    setIsEditRoleOpen(false)
    setSelectedUser(null)
    resetForm()
    toast.success("Role updated successfully")
  }

  const handleResetPassword = () => {
    if (!selectedUser) return
    setIsResetPasswordOpen(false)
    setSelectedUser(null)
    toast.success(`Password reset email sent to ${selectedUser.email}`)
  }

  const handleDeactivate = () => {
    if (!selectedUser) return
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    )
    setIsDeactivateOpen(false)
    const action = selectedUser.status === "active" ? "deactivated" : "activated"
    setSelectedUser(null)
    toast.success(`User ${action} successfully`)
  }

  const openEditRole = (user: User) => {
    setSelectedUser(user)
    setFormData({ ...formData, role: user.role })
    setIsEditRoleOpen(true)
  }

  const openResetPassword = (user: User) => {
    setSelectedUser(user)
    setIsResetPasswordOpen(true)
  }

  const openDeactivate = (user: User) => {
    setSelectedUser(user)
    setIsDeactivateOpen(true)
  }

  return (
    <>
      <DashboardHeader title="Users" description="Manage system users and access" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Coordinator">Coordinator</SelectItem>
                <SelectItem value="Investigator">Investigator</SelectItem>
                <SelectItem value="CRA">CRA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { resetForm(); setIsInviteOpen(true); }}>
            <UserPlus className="mr-2 size-4" />
            Invite User
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.department}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              user.status === "active" ? "bg-success" : "bg-muted-foreground"
                            }`}
                          />
                          <span className="text-sm capitalize">{user.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => openEditRole(user)}>
                              <Shield className="mr-2 size-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openResetPassword(user)}>
                              <Key className="mr-2 size-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className={user.status === "active" ? "text-destructive" : "text-success"}
                              onClick={() => openDeactivate(user)}
                            >
                              <Power className="mr-2 size-4" />
                              {user.status === "active" ? "Deactivate" : "Activate"} User
                            </DropdownMenuItem>
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
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="inviteEmail">Email Address *</FieldLabel>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="user@hospital.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="inviteName">Full Name *</FieldLabel>
              <Input
                id="inviteName"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>Role *</FieldLabel>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Investigator">Investigator</SelectItem>
                  <SelectItem value="CRA">CRA</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Department</FieldLabel>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData({ ...formData, department: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              <Mail className="mr-2 size-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Current Role</FieldLabel>
              <Input value={selectedUser?.role || ""} disabled />
            </Field>
            <Field>
              <FieldLabel>New Role *</FieldLabel>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Investigator">Investigator</SelectItem>
                  <SelectItem value="CRA">CRA</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation */}
      <AlertDialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset email to {selectedUser?.email}. The user will need
              to create a new password to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate/Activate Confirmation */}
      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "active"
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will be able to access the system again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className={
                selectedUser?.status === "active"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
