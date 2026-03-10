"use client"

import { useState } from "react"
import Link from "next/link"
import { Archive, Edit2, Eye, FileText, MoreHorizontal, Plus, Search, Upload, Users, Calendar, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Filter, SortAsc, Download } from "lucide-react"

interface Study {
  id: string
  name: string
  protocolNumber: string
  sponsor: string
  phase: string
  type: "Interventional" | "Observational" | "Other"
  status: "active" | "recruiting" | "completed" | "paused" | "suspended" | "closed"
  enrolled: number
  target: number
  startDate: string
  endDate: string
  piName: string
  piEmail: string
  piPhone: string
  enrollmentDuration: string
  description: string
  visits: number
  sites: number
  tags?: string[]
  createdAt: string
}

const initialStudies: Study[] = [
  {
    id: "STD-001",
    name: "BEACON-2024",
    protocolNumber: "PZ-2024-001",
    sponsor: "Pfizer Inc.",
    phase: "Phase III",
    type: "Interventional",
    status: "active",
    enrolled: 156,
    target: 200,
    startDate: "2024-01-15",
    endDate: "2025-12-31",
    piName: "Dr. Elizabeth Blackwell",
    piEmail: "e.blackwell@university.edu",
    piPhone: "+1 (555) 123-4567",
    enrollmentDuration: "12 months",
    description: "A randomized, double-blind study evaluating the efficacy of treatment in patients with advanced condition.",
    visits: 8,
    sites: 12,
    tags: ["Oncology", "Immuno-therapy"],
    createdAt: "2024-01-10",
  },
  {
    id: "STD-002",
    name: "AURORA-Phase2",
    protocolNumber: "NV-AUR-002",
    sponsor: "Novartis AG",
    phase: "Phase II",
    type: "Interventional",
    status: "active",
    enrolled: 89,
    target: 120,
    startDate: "2024-02-08",
    endDate: "2025-08-31",
    piName: "Dr. Gregory House",
    piEmail: "g.house@ppth.edu",
    piPhone: "+1 (555) 987-6543",
    enrollmentDuration: "18 months",
    description: "Dose-finding study to determine optimal dosing regimen for novel therapeutic agent.",
    visits: 6,
    sites: 8,
    tags: ["Neurology", "Rare Disease"],
    createdAt: "2024-02-01",
  },
  {
    id: "STD-003",
    name: "NOVA-Trial",
    protocolNumber: "JJ-NOV-999",
    sponsor: "Johnson & Johnson",
    phase: "Phase III",
    type: "Interventional",
    status: "active",
    enrolled: 234,
    target: 250,
    startDate: "2023-12-01",
    endDate: "2025-06-30",
    piName: "Dr. Meredith Grey",
    piEmail: "m.grey@gsm.edu",
    piPhone: "+1 (555) 000-1111",
    enrollmentDuration: "24 months",
    description: "Pivotal trial comparing new treatment against standard of care in chronic disease management.",
    visits: 10,
    sites: 15,
    tags: ["Cardiology", "Pivotal"],
    createdAt: "2023-11-20",
  },
  {
    id: "STD-004",
    name: "MERIDIAN-2024",
    protocolNumber: "RH-MER-04",
    sponsor: "Roche Holding AG",
    phase: "Phase I",
    type: "Observational",
    status: "recruiting",
    enrolled: 45,
    target: 100,
    startDate: "2024-03-01",
    endDate: "2026-03-31",
    piName: "Dr. Robert Chase",
    piEmail: "r.chase@ppth.edu",
    piPhone: "+1 (555) 222-3333",
    enrollmentDuration: "24 months",
    description: "First-in-human study to evaluate safety and tolerability of investigational compound.",
    visits: 4,
    sites: 5,
    tags: ["Safety", "PK/PD"],
    createdAt: "2024-02-25",
  },
  {
    id: "STD-005",
    name: "HORIZON-2023",
    protocolNumber: "MK-HOR-05",
    sponsor: "Merck & Co.",
    phase: "Phase III",
    type: "Interventional",
    status: "completed",
    enrolled: 312,
    target: 300,
    startDate: "2022-06-15",
    endDate: "2023-12-15",
    piName: "Dr. Allison Cameron",
    piEmail: "a.cameron@ppth.edu",
    piPhone: "+1 (555) 444-5555",
    enrollmentDuration: "18 months",
    description: "Confirmatory trial demonstrating long-term efficacy and safety outcomes.",
    visits: 12,
    sites: 20,
    tags: ["Respiratory"],
    createdAt: "2022-06-01",
  },
]

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-0",
  recruiting: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  paused: "bg-warning/10 text-warning border-0",
  suspended: "bg-destructive/10 text-destructive border-0",
  closed: "bg-muted text-muted-foreground border-0",
}

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>(initialStudies)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all") // Keeping for existing tabs if any
  const [statusFilter, setStatusFilter] = useState("all")
  const [sponsorFilter, setSponsorFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    protocolNumber: "",
    sponsor: "",
    phase: "Phase I",
    type: "Interventional",
    status: "active",
    target: "",
    description: "",
    piName: "",
    piEmail: "",
    piPhone: "",
    enrollmentDuration: "",
    startDate: "",
    endDate: "",
  })

  const filteredStudies = studies
    .filter((study) => {
      const matchesSearch =
        study.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.protocolNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.piName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || study.status === statusFilter
      const matchesSponsor = sponsorFilter === "all" || study.sponsor === sponsorFilter
      return matchesSearch && matchesStatus && matchesSponsor
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const resetForm = () => {
    setFormData({
      name: "",
      protocolNumber: "",
      sponsor: "",
      phase: "Phase I",
      type: "Interventional",
      status: "active",
      target: "",
      description: "",
      piName: "",
      piEmail: "",
      piPhone: "",
      enrollmentDuration: "",
      startDate: "",
      endDate: "",
    })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.protocolNumber || !formData.sponsor) {
      toast.error("Please fill in required fields")
      return
    }
    const newStudy: Study = {
      id: `STD-${String(studies.length + 1).padStart(3, "0")}`,
      name: formData.name,
      protocolNumber: formData.protocolNumber,
      sponsor: formData.sponsor,
      phase: formData.phase,
      type: formData.type as Study["type"],
      status: formData.status as Study["status"],
      enrolled: 0,
      target: parseInt(formData.target) || 100,
      startDate: formData.startDate || new Date().toISOString().split("T")[0],
      endDate: formData.endDate || "TBD",
      piName: formData.piName,
      piEmail: formData.piEmail,
      piPhone: formData.piPhone,
      enrollmentDuration: formData.enrollmentDuration || "12 months",
      description: formData.description,
      visits: 0,
      sites: 1,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setStudies([...studies, newStudy])
    setIsAddOpen(false)
    resetForm()
    toast.success("Study created successfully")
  }

  const handleEdit = () => {
    if (!selectedStudy || !formData.name || !formData.protocolNumber) {
      toast.error("Please fill in required fields")
      return
    }
    setStudies(
      studies.map((s) =>
        s.id === selectedStudy.id
          ? {
            ...s,
            name: formData.name,
            protocolNumber: formData.protocolNumber,
            sponsor: formData.sponsor || s.sponsor,
            phase: formData.phase || s.phase,
            type: formData.type as Study["type"],
            status: formData.status as Study["status"],
            target: parseInt(formData.target) || s.target,
            piName: formData.piName,
            piEmail: formData.piEmail,
            piPhone: formData.piPhone,
            enrollmentDuration: formData.enrollmentDuration,
            startDate: formData.startDate,
            endDate: formData.endDate,
            description: formData.description || s.description,
          }
          : s
      )
    )
    setIsEditOpen(false)
    setSelectedStudy(null)
    resetForm()
    toast.success("Study updated successfully")
  }

  const handleArchive = () => {
    if (!selectedStudy) return
    setStudies(studies.filter((s) => s.id !== selectedStudy.id))
    setIsArchiveOpen(false)
    setSelectedStudy(null)
    toast.success("Study archived successfully")
  }

  const openEdit = (study: Study) => {
    setSelectedStudy(study)
    setFormData({
      name: study.name,
      protocolNumber: study.protocolNumber,
      sponsor: study.sponsor,
      phase: study.phase,
      type: study.type,
      status: study.status,
      target: String(study.target),
      piName: study.piName,
      piEmail: study.piEmail,
      piPhone: study.piPhone,
      enrollmentDuration: study.enrollmentDuration,
      startDate: study.startDate,
      endDate: study.endDate,
      description: study.description,
    })
    setIsEditOpen(true)
  }


  const openArchive = (study: Study) => {
    setSelectedStudy(study)
    setIsArchiveOpen(true)
  }

  return (
    <>
      <DashboardHeader title="Studies" description="Manage clinical trials and research studies" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 sm:max-w-80">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="recruiting">Recruiting</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="shrink-0"
              title={`Sort by Created: ${sortOrder === "asc" ? "Oldest" : "Newest"}`}
            >
              <SortAsc className={`size-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
            </Button>
          </div>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus className="mr-2 size-4" />
            Create Study
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All Studies</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={selectedTab} className="mt-0">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Study Name / Protocol</TableHead>
                    <TableHead>Sponsor / PI</TableHead>
                    <TableHead>Phase / Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        No studies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudies.map((study) => {
                      const progress = Math.round((study.enrolled / study.target) * 100)
                      return (
                        <TableRow key={study.id} className="group cursor-pointer">
                          <TableCell className="relative font-medium">
                            <Link href={`/studies/${study.id}`} className="absolute inset-0 z-0" />
                            <div className="relative z-10 pointer-events-none">
                              <div className="font-semibold text-primary">
                                {study.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                                {study.id} • {study.protocolNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{study.sponsor}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 text-nowrap">
                                <Users className="size-3" /> {study.piName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant="outline" className="w-fit text-[10px] h-5 px-1.5 uppercase font-medium">
                                {study.phase}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground ml-1">
                                {study.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusStyles[study.status]} text-[10px] h-5 px-2 uppercase font-bold`}>
                              {study.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-[120px] space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] font-medium">
                                <span>{study.enrolled} / {study.target}</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-[11px] space-y-0.5">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="size-3" />
                                <span>S: {study.startDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="size-3" />
                                <span>E: {study.endDate}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 relative z-20">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="z-30">
                                <DropdownMenuItem asChild>
                                  <Link href={`/studies/${study.id}`}>
                                    <Eye className="mr-2 size-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(study)}>
                                  <Edit2 className="mr-2 size-4" />
                                  Edit Study
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/patients?study=${study.name}`}>
                                    <Users className="mr-2 size-4" />
                                    View Patients
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 size-4" />
                                  Download Protocol
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => openArchive(study)}
                                >
                                  <Archive className="mr-2 size-4" />
                                  Archive Study
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Study Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Study</DialogTitle>
            <DialogDescription>
              Enter study details and upload the protocol document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="studyName">Study Title *</FieldLabel>
                  <Input
                    id="studyName"
                    placeholder="e.g., BEACON-2024"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="protocolNumber">Protocol Number *</FieldLabel>
                  <Input
                    id="protocolNumber"
                    placeholder="e.g., PZ-2024-001"
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="sponsor">Sponsor *</FieldLabel>
                  <Select
                    value={formData.sponsor}
                    onValueChange={(v) => setFormData({ ...formData, sponsor: v })}
                  >
                    <SelectTrigger id="sponsor">
                      <SelectValue placeholder="Select sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pfizer Inc.">Pfizer Inc.</SelectItem>
                      <SelectItem value="Novartis AG">Novartis AG</SelectItem>
                      <SelectItem value="Johnson & Johnson">Johnson & Johnson</SelectItem>
                      <SelectItem value="Roche Holding AG">Roche Holding AG</SelectItem>
                      <SelectItem value="Merck & Co.">Merck & Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="type">Study Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interventional">Interventional</SelectItem>
                      <SelectItem value="Observational">Observational</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="phase">Study Phase *</FieldLabel>
                  <Select
                    value={formData.phase}
                    onValueChange={(v) => setFormData({ ...formData, phase: v })}
                  >
                    <SelectTrigger id="phase">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phase I">Phase I</SelectItem>
                      <SelectItem value="Phase II">Phase II</SelectItem>
                      <SelectItem value="Phase III">Phase III</SelectItem>
                      <SelectItem value="Phase IV">Phase IV</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="status">Current Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="recruiting">Recruiting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Investigator Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="piName">Principal Investigator Name</FieldLabel>
                  <Input
                    id="piName"
                    placeholder="Dr. Name"
                    value={formData.piName}
                    onChange={(e) => setFormData({ ...formData, piName: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="piEmail">PI Email</FieldLabel>
                  <Input
                    id="piEmail"
                    placeholder="email@example.com"
                    value={formData.piEmail}
                    onChange={(e) => setFormData({ ...formData, piEmail: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="piPhone">PI Phone</FieldLabel>
                  <Input
                    id="piPhone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.piPhone}
                    onChange={(e) => setFormData({ ...formData, piPhone: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Timeline & Enrollment</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endDate">Expected End Date</FieldLabel>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="enrollmentDuration">Expected Duration</FieldLabel>
                  <Input
                    id="enrollmentDuration"
                    placeholder="e.g., 18 months"
                    value={formData.enrollmentDuration}
                    onChange={(e) => setFormData({ ...formData, enrollmentDuration: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="target">Target Enrollment</FieldLabel>
                  <Input
                    id="target"
                    type="number"
                    placeholder="200"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Study Description & Protocol</h4>
              <Field>
                <FieldLabel htmlFor="description">Study Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Brief study description..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Protocol Document</FieldLabel>
                <div className="mt-1 flex items-center justify-center rounded-md border border-dashed p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto size-6 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Study</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Study Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Study</DialogTitle>
            <DialogDescription>Update the study details and configuration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-studyName">Study Title *</FieldLabel>
                  <Input
                    id="edit-studyName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-protocolNumber">Protocol Number *</FieldLabel>
                  <Input
                    id="edit-protocolNumber"
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-sponsor">Sponsor *</FieldLabel>
                  <Select
                    value={formData.sponsor}
                    onValueChange={(v) => setFormData({ ...formData, sponsor: v })}
                  >
                    <SelectTrigger id="edit-sponsor">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pfizer Inc.">Pfizer Inc.</SelectItem>
                      <SelectItem value="Novartis AG">Novartis AG</SelectItem>
                      <SelectItem value="Johnson & Johnson">Johnson & Johnson</SelectItem>
                      <SelectItem value="Roche Holding AG">Roche Holding AG</SelectItem>
                      <SelectItem value="Merck & Co.">Merck & Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-type">Study Type</FieldLabel>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interventional">Interventional</SelectItem>
                      <SelectItem value="Observational">Observational</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-phase">Study Phase *</FieldLabel>
                  <Select
                    value={formData.phase}
                    onValueChange={(v) => setFormData({ ...formData, phase: v })}
                  >
                    <SelectTrigger id="edit-phase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phase I">Phase I</SelectItem>
                      <SelectItem value="Phase II">Phase II</SelectItem>
                      <SelectItem value="Phase III">Phase III</SelectItem>
                      <SelectItem value="Phase IV">Phase IV</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-status">Current Status</FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="recruiting">Recruiting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Investigator Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-piName">Principal Investigator Name</FieldLabel>
                  <Input
                    id="edit-piName"
                    value={formData.piName}
                    onChange={(e) => setFormData({ ...formData, piName: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-piEmail">PI Email</FieldLabel>
                  <Input
                    id="edit-piEmail"
                    value={formData.piEmail}
                    onChange={(e) => setFormData({ ...formData, piEmail: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-piPhone">PI Phone</FieldLabel>
                  <Input
                    id="edit-piPhone"
                    value={formData.piPhone}
                    onChange={(e) => setFormData({ ...formData, piPhone: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Timeline & Enrollment</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="edit-startDate">Start Date</FieldLabel>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-endDate">Expected End Date</FieldLabel>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-enrollmentDuration">Expected Duration</FieldLabel>
                  <Input
                    id="edit-enrollmentDuration"
                    value={formData.enrollmentDuration}
                    onChange={(e) => setFormData({ ...formData, enrollmentDuration: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-target">Target Enrollment</FieldLabel>
                  <Input
                    id="edit-target"
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Study Description</h4>
              <Field>
                <FieldLabel htmlFor="edit-description">Study Description</FieldLabel>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Field>
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


      {/* Archive Confirmation */}
      <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Study</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive {selectedStudy?.name}? This action will move the
              study to the archive and it will no longer appear in active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
