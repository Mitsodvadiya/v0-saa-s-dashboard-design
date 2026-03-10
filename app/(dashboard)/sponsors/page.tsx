"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Edit2, Mail, MoreHorizontal, Phone, Plus, Search, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  organizationName: string
  type: "Pharmaceutical" | "CRO" | "Research Organization" | "Other"
  contact: string
  email: string
  phone: string
  secondaryContact?: string
  activeStudies: number
  totalStudies: number
  totalPatients: number
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  postalCode: string
  website?: string
  createdAt: string
  updatedAt: string
  status: "active" | "pending" | "inactive"
}

const initialSponsors: Sponsor[] = [
  {
    id: "SPO-001",
    name: "Pfizer Inc.",
    organizationName: "Pfizer Pharmaceutical Group",
    type: "Pharmaceutical",
    contact: "Dr. James Wilson",
    email: "james.wilson@pfizer.com",
    phone: "+1 (555) 123-4567",
    activeStudies: 3,
    totalStudies: 12,
    totalPatients: 456,
    addressLine1: "235 East 42nd Street",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10017",
    website: "www.pfizer.com",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-05",
    status: "active",
  },
  {
    id: "SPO-002",
    name: "Novartis AG",
    organizationName: "Novartis International AG",
    type: "Pharmaceutical",
    contact: "Dr. Maria Garcia",
    email: "maria.garcia@novartis.com",
    phone: "+1 (555) 234-5678",
    activeStudies: 2,
    totalStudies: 8,
    totalPatients: 234,
    addressLine1: "Lichtstrasse 35",
    city: "Basel",
    state: "BS",
    country: "Switzerland",
    postalCode: "4056",
    website: "www.novartis.com",
    createdAt: "2024-02-08",
    updatedAt: "2024-03-01",
    status: "active",
  },
  {
    id: "SPO-003",
    name: "Johnson & Johnson",
    organizationName: "J&J Healthcare",
    type: "Pharmaceutical",
    contact: "Dr. Robert Chen",
    email: "robert.chen@jnj.com",
    phone: "+1 (555) 345-6789",
    activeStudies: 4,
    totalStudies: 15,
    totalPatients: 678,
    addressLine1: "One Johnson & Johnson Plaza",
    city: "New Brunswick",
    state: "NJ",
    country: "USA",
    postalCode: "08933",
    website: "www.jnj.com",
    createdAt: "2023-12-20",
    updatedAt: "2024-02-15",
    status: "active",
  },
  {
    id: "SPO-004",
    name: "Roche Holding AG",
    organizationName: "F. Hoffmann-La Roche Ltd",
    type: "Pharmaceutical",
    contact: "Dr. Sarah Thompson",
    email: "sarah.thompson@roche.com",
    phone: "+1 (555) 456-7890",
    activeStudies: 1,
    totalStudies: 5,
    totalPatients: 89,
    addressLine1: "Grenzacherstrasse 124",
    city: "Basel",
    state: "BS",
    country: "Switzerland",
    postalCode: "4058",
    website: "www.roche.com",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    status: "pending",
  },
  {
    id: "SPO-005",
    name: "Merck & Co.",
    organizationName: "Merck Sharp & Dohme Corp.",
    type: "Pharmaceutical",
    contact: "Dr. David Lee",
    email: "david.lee@merck.com",
    phone: "+1 (555) 567-8901",
    activeStudies: 2,
    totalStudies: 10,
    totalPatients: 312,
    addressLine1: "2000 Galloping Hill Road",
    city: "Kenilworth",
    state: "NJ",
    country: "USA",
    postalCode: "07033",
    website: "www.merck.com",
    createdAt: "2023-11-10",
    updatedAt: "2024-01-20",
    status: "active",
  },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    organizationName: "",
    type: "Pharmaceutical" as Sponsor["type"],
    contact: "",
    email: "",
    phone: "",
    secondaryContact: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    website: "",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredSponsors = sponsors
    .filter((sponsor) => {
      const matchesSearch =
        sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.contact.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || sponsor.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const resetForm = () => {
    setFormData({
      name: "",
      organizationName: "",
      type: "Pharmaceutical",
      contact: "",
      email: "",
      phone: "",
      secondaryContact: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      website: "",
    })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.organizationName) {
      toast.error("Please fill in required fields")
      return
    }
    const newSponsor: Sponsor = {
      id: `SPO-${String(sponsors.length + 1).padStart(3, "0")}`,
      name: formData.name,
      organizationName: formData.organizationName,
      type: formData.type,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      secondaryContact: formData.secondaryContact,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
      website: formData.website,
      activeStudies: 0,
      totalStudies: 0,
      totalPatients: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: "pending",
    }
    setSponsors([...sponsors, newSponsor])
    setIsAddOpen(false)
    resetForm()
    toast.success("Sponsor added successfully")
  }

  const handleEdit = () => {
    if (!selectedSponsor || !formData.name || !formData.email || !formData.organizationName) {
      toast.error("Please fill in required fields")
      return
    }
    setSponsors(
      sponsors.map((s) =>
        s.id === selectedSponsor.id
          ? {
            ...s,
            name: formData.name,
            organizationName: formData.organizationName,
            type: formData.type,
            contact: formData.contact,
            email: formData.email,
            phone: formData.phone,
            secondaryContact: formData.secondaryContact,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
            website: formData.website,
            updatedAt: new Date().toISOString().split('T')[0],
          }
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
      organizationName: sponsor.organizationName || "",
      type: sponsor.type,
      contact: sponsor.contact,
      email: sponsor.email,
      phone: sponsor.phone,
      secondaryContact: sponsor.secondaryContact || "",
      addressLine1: sponsor.addressLine1 || "",
      addressLine2: sponsor.addressLine2 || "",
      city: sponsor.city || "",
      state: sponsor.state || "",
      country: sponsor.country || "",
      postalCode: sponsor.postalCode || "",
      website: sponsor.website || "",
    })
    setIsEditOpen(true)
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
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sponsors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              <ArrowUpDown className="mr-2 size-4 text-muted-foreground" />
              Created {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Button>
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
                  <TableHead>Sponsor Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Active/Total Studies</TableHead>
                  <TableHead>Created Date</TableHead>
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
                    <TableRow key={sponsor.id} className="group cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/sponsors/${sponsor.id}`} className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Building2 className="size-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium hover:text-primary transition-colors">{sponsor.name}</div>
                            <div className="text-[10px] text-muted-foreground">{sponsor.id}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{sponsor.organizationName}</div>
                        <div className="text-xs text-muted-foreground">{sponsor.country}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{sponsor.contact}</div>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="size-3" />
                              {sponsor.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="size-3" />
                              {sponsor.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-semibold text-primary">{sponsor.activeStudies}</Badge>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-sm font-medium">{sponsor.totalStudies}</span>
                        </div>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/sponsors/${sponsor.id}`}>
                                <Eye className="mr-2 size-4" />
                                View Details
                              </Link>
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
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-xs text-muted-foreground">
                Showing 1 to {filteredSponsors.length} of {sponsors.length} sponsors
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Sponsor Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
            <DialogDescription>
              Enter the sponsor organization and contact details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Sponsor Name *</FieldLabel>
                  <Input
                    id="name"
                    placeholder="e.g., Pfizer Inc."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="org">Organization Name *</FieldLabel>
                  <Input
                    id="org"
                    placeholder="Legal Entity Name"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="type">Sponsor Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Sponsor["type"]) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                      <SelectItem value="CRO">CRO</SelectItem>
                      <SelectItem value="Research Organization">Research Organization</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="website">Website</FieldLabel>
                  <Input
                    id="website"
                    placeholder="www.example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="contact">Primary Contact Person *</FieldLabel>
                  <Input
                    id="contact"
                    placeholder="Full Name"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="secondary">Secondary Contact</FieldLabel>
                  <Input
                    id="secondary"
                    placeholder="Optional Contact Name"
                    value={formData.secondaryContact}
                    onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-2">Address Information</h4>
              <div className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="addr1">Address Line 1</FieldLabel>
                  <Input
                    id="addr1"
                    placeholder="Street Address"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="state">State / Province</FieldLabel>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input
                      id="country"
                      placeholder="e.g. USA"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                    <Input
                      id="zip"
                      placeholder="Zip Code"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update the sponsor organization and contact details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-name">Sponsor Name *</FieldLabel>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-org">Organization Name *</FieldLabel>
                  <Input
                    id="edit-org"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-type">Sponsor Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Sponsor["type"]) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                      <SelectItem value="CRO">CRO</SelectItem>
                      <SelectItem value="Research Organization">Research Organization</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-website">Website</FieldLabel>
                  <Input
                    id="edit-website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-contact">Primary Contact Person *</FieldLabel>
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-secondary">Secondary Contact</FieldLabel>
                  <Input
                    id="edit-secondary"
                    value={formData.secondaryContact}
                    onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-semibold border-b pb-2">Address Information</h4>
              <div className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-addr1">Address Line 1</FieldLabel>
                  <Input
                    id="edit-addr1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="edit-city">City</FieldLabel>
                    <Input
                      id="edit-city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-state">State / Province</FieldLabel>
                    <Input
                      id="edit-state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-country">Country</FieldLabel>
                    <Input
                      id="edit-country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-zip">Postal Code</FieldLabel>
                    <Input
                      id="edit-zip"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
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
