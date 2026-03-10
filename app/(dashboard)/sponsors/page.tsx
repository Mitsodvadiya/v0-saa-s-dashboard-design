"use client"

import { useState } from "react"
import { Building2, Mail, MoreHorizontal, Phone, Plus, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const sponsors = [
  {
    id: "SPO-001",
    name: "Pfizer Inc.",
    contact: "Dr. James Wilson",
    email: "james.wilson@pfizer.com",
    phone: "+1 (555) 123-4567",
    activeStudies: 3,
    totalPatients: 456,
    createdAt: "Jan 15, 2024",
    status: "active",
  },
  {
    id: "SPO-002",
    name: "Novartis AG",
    contact: "Dr. Maria Garcia",
    email: "maria.garcia@novartis.com",
    phone: "+1 (555) 234-5678",
    activeStudies: 2,
    totalPatients: 234,
    createdAt: "Feb 8, 2024",
    status: "active",
  },
  {
    id: "SPO-003",
    name: "Johnson & Johnson",
    contact: "Dr. Robert Chen",
    email: "robert.chen@jnj.com",
    phone: "+1 (555) 345-6789",
    activeStudies: 4,
    totalPatients: 678,
    createdAt: "Dec 20, 2023",
    status: "active",
  },
  {
    id: "SPO-004",
    name: "Roche Holding AG",
    contact: "Dr. Sarah Thompson",
    email: "sarah.thompson@roche.com",
    phone: "+1 (555) 456-7890",
    activeStudies: 1,
    totalPatients: 89,
    createdAt: "Mar 1, 2024",
    status: "pending",
  },
  {
    id: "SPO-005",
    name: "Merck & Co.",
    contact: "Dr. David Lee",
    email: "david.lee@merck.com",
    phone: "+1 (555) 567-8901",
    activeStudies: 2,
    totalPatients: 312,
    createdAt: "Nov 10, 2023",
    status: "active",
  },
]

export default function SponsorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredSponsors = sponsors.filter(
    (sponsor) =>
      sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <DashboardHeader title="Sponsors" description="Manage pharmaceutical sponsors" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-8"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Sponsor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Sponsor</DialogTitle>
                <DialogDescription>
                  Enter the sponsor organization details below.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel htmlFor="name">Organization Name</FieldLabel>
                  <Input id="name" placeholder="e.g., Pfizer Inc." />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact">Contact Person</FieldLabel>
                  <Input id="contact" placeholder="e.g., Dr. James Wilson" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input id="email" type="email" placeholder="contact@company.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Add Sponsor
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
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Active Studies</TableHead>
                  <TableHead>Total Patients</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="size-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          <div className="text-xs text-muted-foreground">{sponsor.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{sponsor.contact}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="size-3" />
                          {sponsor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{sponsor.activeStudies}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{sponsor.totalPatients.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{sponsor.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          sponsor.status === "active"
                            ? "bg-success/10 text-success border-0"
                            : "bg-warning/10 text-warning border-0"
                        }
                      >
                        {sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}
                      </Badge>
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Sponsor</DropdownMenuItem>
                          <DropdownMenuItem>View Studies</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Deactivate
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
