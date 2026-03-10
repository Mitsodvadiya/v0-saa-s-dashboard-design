"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Search, Shield, UserPlus, Mail, Power } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const users = [
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
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

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
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 size-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel htmlFor="inviteEmail">Email Address</FieldLabel>
                  <Input id="inviteEmail" type="email" placeholder="user@hospital.org" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="inviteName">Full Name</FieldLabel>
                  <Input id="inviteName" placeholder="Dr. John Doe" />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                      <SelectItem value="investigator">Investigator</SelectItem>
                      <SelectItem value="cra">CRA</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Department</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsInviteOpen(false)}>
                  <Mail className="mr-2 size-4" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                {filteredUsers.map((user) => (
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
                      <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role}
                      </Badge>
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 size-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Power className="mr-2 size-4" />
                            Deactivate User
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
      </div>
    </>
  )
}
