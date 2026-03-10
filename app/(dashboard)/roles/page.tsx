"use client"

import { useState } from "react"
import { Shield, Edit2, Check, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access",
    users: 2,
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: "supervisor",
    name: "Supervisor",
    description: "Manage studies and patients",
    users: 3,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "coordinator",
    name: "Coordinator",
    description: "Manage documents and visits",
    users: 8,
    color: "bg-success/10 text-success",
  },
  {
    id: "investigator",
    name: "Investigator",
    description: "View patient progress and studies",
    users: 12,
    color: "bg-warning/10 text-warning",
  },
  {
    id: "cra",
    name: "CRA",
    description: "Sponsor representative access",
    users: 5,
    color: "bg-muted text-muted-foreground",
  },
]

const modules = [
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
  "Roles",
  "Audit Logs",
  "Settings",
]

const defaultPermissions: Record<string, Record<string, boolean[]>> = {
  admin: {
    Dashboard: [true, true, true, true],
    Sponsors: [true, true, true, true],
    Studies: [true, true, true, true],
    Patients: [true, true, true, true],
    Visits: [true, true, true, true],
    Calendar: [true, true, true, true],
    Documents: [true, true, true, true],
    Analytics: [true, true, true, true],
    "Email Center": [true, true, true, true],
    Chat: [true, true, true, true],
    Users: [true, true, true, true],
    Roles: [true, true, true, true],
    "Audit Logs": [true, true, true, true],
    Settings: [true, true, true, true],
  },
  supervisor: {
    Dashboard: [true, true, false, false],
    Sponsors: [false, true, false, false],
    Studies: [true, true, true, false],
    Patients: [true, true, true, false],
    Visits: [true, true, true, true],
    Calendar: [true, true, true, false],
    Documents: [true, true, true, true],
    Analytics: [false, true, false, false],
    "Email Center": [true, true, true, false],
    Chat: [true, true, true, false],
    Users: [false, true, false, false],
    Roles: [false, false, false, false],
    "Audit Logs": [false, true, false, false],
    Settings: [false, true, true, false],
  },
  coordinator: {
    Dashboard: [false, true, false, false],
    Sponsors: [false, true, false, false],
    Studies: [false, true, false, false],
    Patients: [true, true, true, false],
    Visits: [true, true, true, true],
    Calendar: [true, true, true, false],
    Documents: [true, true, true, true],
    Analytics: [false, true, false, false],
    "Email Center": [true, true, true, false],
    Chat: [true, true, true, false],
    Users: [false, false, false, false],
    Roles: [false, false, false, false],
    "Audit Logs": [false, false, false, false],
    Settings: [false, true, true, false],
  },
  investigator: {
    Dashboard: [false, true, false, false],
    Sponsors: [false, true, false, false],
    Studies: [false, true, false, false],
    Patients: [false, true, false, false],
    Visits: [false, true, true, false],
    Calendar: [false, true, false, false],
    Documents: [false, true, false, false],
    Analytics: [false, true, false, false],
    "Email Center": [false, true, false, false],
    Chat: [true, true, true, false],
    Users: [false, false, false, false],
    Roles: [false, false, false, false],
    "Audit Logs": [false, false, false, false],
    Settings: [false, true, true, false],
  },
  cra: {
    Dashboard: [false, true, false, false],
    Sponsors: [false, true, false, false],
    Studies: [false, true, false, false],
    Patients: [false, true, false, false],
    Visits: [false, true, false, false],
    Calendar: [false, true, false, false],
    Documents: [false, true, false, false],
    Analytics: [false, true, false, false],
    "Email Center": [false, true, false, false],
    Chat: [true, true, true, false],
    Users: [false, false, false, false],
    Roles: [false, false, false, false],
    "Audit Logs": [false, false, false, false],
    Settings: [false, true, true, false],
  },
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState(defaultPermissions)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handlePermissionChange = (
    roleId: string,
    module: string,
    permIndex: number,
    checked: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: prev[roleId][module].map((p, i) => (i === permIndex ? checked : p)),
      },
    }))
  }

  return (
    <>
      <DashboardHeader title="Roles & Permissions" description="Configure user access levels" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-5">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`shadow-sm cursor-pointer transition-all ${
                selectedRole === role.id ? "ring-2 ring-primary" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${role.color}`}>
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-xs text-muted-foreground">{role.users} users</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {roles.find((r) => r.id === selectedRole)?.name} Permissions
                </CardTitle>
                <CardDescription>Configure module access for this role</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                <Edit2 className="mr-2 size-4" />
                Edit Role
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Module</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module}>
                      <TableCell className="font-medium">{module}</TableCell>
                      {[0, 1, 2, 3].map((permIndex) => (
                        <TableCell key={permIndex} className="text-center">
                          <Checkbox
                            checked={permissions[selectedRole]?.[module]?.[permIndex] ?? false}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                selectedRole,
                                module,
                                permIndex,
                                checked as boolean
                              )
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Modify role details and permissions.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>Role Name</FieldLabel>
                <Input
                  defaultValue={roles.find((r) => r.id === selectedRole)?.name}
                />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  defaultValue={roles.find((r) => r.id === selectedRole)?.description}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
