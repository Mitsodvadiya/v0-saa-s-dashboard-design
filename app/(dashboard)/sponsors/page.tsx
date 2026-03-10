"use client"

import { useState } from "react"
import { Building2, Edit2, Mail, MoreHorizontal, Phone, Plus, Search, Trash2, Eye } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"

interface Sponsor {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  activeStudies: number
  totalPatients: number
  createdAt: string
  status: "active" | "pending" | "inactive"
}

const initialSponsors: Sponsor[] = [
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
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  })

  const filteredSponsors = sponsors.filter(
    (sponsor) =>
      sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sponsor.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({ name: "", contact: "", email: "", phone: "" })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in required fields")
      return
    }
    const newSponsor: Sponsor = {
      id: `SPO-${String(sponsors.length + 1).padStart(3, "0")}`,
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      activeStudies: 0,
      totalPatients: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending",
    }
    setSponsors([...sponsors, newSponsor])
    setIsAddOpen(false)
    resetForm()
    toast.success("Sponsor added successfully")
  }

  const handleEdit = () => {
    if (!selectedSponsor || !formData.name || !formData.email) {
      toast.error("Please fill in required fields")
      return
    }
    setSponsors(
      sponsors.map((s) =>
        s.id === selectedSponsor.id
          ? { ...s, name: formData.name, contact: formData.contact, email: formData.email, phone: formData.phone }
          : s
      )
    )
    setIsEditOpen(false)
    setSelectedSponsor(null)
    resetForm()
    toast.success("Sponsor updated successfully")
  }

  const handleDelete = () => {
    if (!selectedSponsor) return
    setSponsors(sponsors.filter((s) => s.id !== selectedSponsor.id))
    setIsDeleteOpen(false)
    setSelectedSponsor(null)
    toast.success("Sponsor deactivated successfully")
  }

  const openEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      contact: sponsor.contact,
      email: sponsor.email,
      phone: sponsor.phone,
    })
    setIsEditOpen(true)
  }

  const openView = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setIsViewOpen(true)
  }

  const openDelete = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setIsDeleteOpen(true)
  }

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
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus className="mr-2 size-4" />
            Add Sponsor
          </Button>
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
                {filteredSponsors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No sponsors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSponsors.map((sponsor) => (
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
                              : sponsor.status === "pending"
                              ? "bg-warning/10 text-warning border-0"
                              : "bg-muted text-muted-foreground border-0"
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
                            <DropdownMenuItem onClick={() => openView(sponsor)}>
                              <Eye className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(sponsor)}>
                              <Edit2 className="mr-2 size-4" />
                              Edit Sponsor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDelete(sponsor)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Deactivate
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

      {/* Add Sponsor Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
            <DialogDescription>
              Enter the sponsor organization details below.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Organization Name *</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Pfizer Inc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contact">Contact Person</FieldLabel>
              <Input
                id="contact"
                placeholder="e.g., Dr. James Wilson"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Sponsor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sponsor Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update the sponsor organization details.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="edit-name">Organization Name *</FieldLabel>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-contact">Contact Person</FieldLabel>
              <Input
                id="edit-contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-email">Email Address *</FieldLabel>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-phone">Phone Number</FieldLabel>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Sponsor Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sponsor Details</DialogTitle>
            <DialogDescription>{selectedSponsor?.id}</DialogDescription>
          </DialogHeader>
          {selectedSponsor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedSponsor.name}</h3>
                  <Badge
                    className={
                      selectedSponsor.status === "active"
                        ? "bg-success/10 text-success border-0"
                        : "bg-warning/10 text-warning border-0"
                    }
                  >
                    {selectedSponsor.status.charAt(0).toUpperCase() + selectedSponsor.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{selectedSponsor.contact || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{selectedSponsor.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedSponsor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedSponsor.phone || "—"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{selectedSponsor.activeStudies}</p>
                  <p className="text-sm text-muted-foreground">Active Studies</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{selectedSponsor.totalPatients}</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { setIsViewOpen(false); if (selectedSponsor) openEdit(selectedSponsor); }}>
              <Edit2 className="mr-2 size-4" />
              Edit Sponsor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Sponsor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {selectedSponsor?.name}? This action will
              mark the sponsor as inactive but preserve all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
