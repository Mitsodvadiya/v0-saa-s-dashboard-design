"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

const auditLogs = [
  {
    id: "LOG-001",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    action: "created",
    resource: "Patient",
    details: "Created patient PT-1006 (Lisa Anderson)",
    timestamp: "Mar 12, 2024 10:30:15 AM",
    ip: "192.168.1.100",
  },
  {
    id: "LOG-002",
    user: { name: "Emily Roberts", initials: "ER" },
    action: "updated",
    resource: "Visit",
    details: "Rescheduled Visit V-2024-004 for PT-1004",
    timestamp: "Mar 12, 2024 10:15:42 AM",
    ip: "192.168.1.105",
  },
  {
    id: "LOG-003",
    user: { name: "Dr. James Wilson", initials: "JW" },
    action: "uploaded",
    resource: "Document",
    details: "Uploaded Lab_Results_CBC.pdf for PT-1003",
    timestamp: "Mar 12, 2024 09:45:20 AM",
    ip: "192.168.1.110",
  },
  {
    id: "LOG-004",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    action: "updated",
    resource: "Study",
    details: "Updated protocol for BEACON-2024 to v3.0",
    timestamp: "Mar 12, 2024 09:20:05 AM",
    ip: "192.168.1.100",
  },
  {
    id: "LOG-005",
    user: { name: "System", initials: "SY" },
    action: "sent",
    resource: "Email",
    details: "AI generated email sent to james.wilson@pfizer.com",
    timestamp: "Mar 12, 2024 08:55:30 AM",
    ip: "127.0.0.1",
  },
  {
    id: "LOG-006",
    user: { name: "Dr. Michael Park", initials: "MP" },
    action: "confirmed",
    resource: "Visit",
    details: "Confirmed Visit V-2024-001 for PT-1001",
    timestamp: "Mar 12, 2024 08:30:12 AM",
    ip: "192.168.1.115",
  },
  {
    id: "LOG-007",
    user: { name: "Lisa Thompson", initials: "LT" },
    action: "deleted",
    resource: "Document",
    details: "Deleted outdated consent form for PT-1002",
    timestamp: "Mar 11, 2024 04:45:00 PM",
    ip: "192.168.1.120",
  },
  {
    id: "LOG-008",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    action: "created",
    resource: "User",
    details: "Invited robert.martinez@pfizer.com as CRA",
    timestamp: "Mar 11, 2024 03:20:45 PM",
    ip: "192.168.1.100",
  },
  {
    id: "LOG-009",
    user: { name: "System", initials: "SY" },
    action: "called",
    resource: "AI Voice",
    details: "AI voice call completed to PT-1001 - Visit confirmed",
    timestamp: "Mar 11, 2024 02:00:00 PM",
    ip: "127.0.0.1",
  },
  {
    id: "LOG-010",
    user: { name: "Dr. Nancy White", initials: "NW" },
    action: "enrolled",
    resource: "Patient",
    details: "Enrolled PT-1005 in AURORA-Phase2",
    timestamp: "Mar 11, 2024 11:30:22 AM",
    ip: "192.168.1.125",
  },
]

const actionColors = {
  created: "bg-success/10 text-success border-0",
  updated: "bg-primary/10 text-primary border-0",
  deleted: "bg-destructive/10 text-destructive border-0",
  uploaded: "bg-warning/10 text-warning border-0",
  sent: "bg-muted text-muted-foreground border-0",
  confirmed: "bg-success/10 text-success border-0",
  enrolled: "bg-success/10 text-success border-0",
  called: "bg-primary/10 text-primary border-0",
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesResource = resourceFilter === "all" || log.resource === resourceFilter
    return matchesSearch && matchesAction && matchesResource
  })

  return (
    <>
      <DashboardHeader title="Audit Logs" description="System activity and change history" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-8"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Visit">Visit</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 size-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {log.user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{log.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action as keyof typeof actionColors]}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.resource}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                        {log.details}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{log.ip}</code>
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
