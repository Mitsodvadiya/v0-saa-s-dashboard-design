"use client"

import { useState } from "react"
import Link from "next/link"
import { Archive, Edit2, Eye, FileText, MoreHorizontal, Plus, Search, Upload, Users, Calendar } from "lucide-react"
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

interface Study {
  id: string
  name: string
  sponsor: string
  phase: string
  status: "active" | "recruiting" | "completed" | "paused"
  enrolled: number
  target: number
  startDate: string
  endDate: string
  description: string
  visits: number
  sites: number
}

const initialStudies: Study[] = [
  {
    id: "STD-001",
    name: "BEACON-2024",
    sponsor: "Pfizer Inc.",
    phase: "Phase III",
    status: "active",
    enrolled: 156,
    target: 200,
    startDate: "Jan 15, 2024",
    endDate: "Dec 31, 2025",
    description: "A randomized, double-blind study evaluating the efficacy of treatment in patients with advanced condition.",
    visits: 8,
    sites: 12,
  },
  {
    id: "STD-002",
    name: "AURORA-Phase2",
    sponsor: "Novartis AG",
    phase: "Phase II",
    status: "active",
    enrolled: 89,
    target: 120,
    startDate: "Feb 8, 2024",
    endDate: "Aug 31, 2025",
    description: "Dose-finding study to determine optimal dosing regimen for novel therapeutic agent.",
    visits: 6,
    sites: 8,
  },
  {
    id: "STD-003",
    name: "NOVA-Trial",
    sponsor: "Johnson & Johnson",
    phase: "Phase III",
    status: "active",
    enrolled: 234,
    target: 250,
    startDate: "Dec 1, 2023",
    endDate: "Jun 30, 2025",
    description: "Pivotal trial comparing new treatment against standard of care in chronic disease management.",
    visits: 10,
    sites: 15,
  },
  {
    id: "STD-004",
    name: "MERIDIAN-2024",
    sponsor: "Roche Holding AG",
    phase: "Phase I",
    status: "recruiting",
    enrolled: 45,
    target: 100,
    startDate: "Mar 1, 2024",
    endDate: "Mar 31, 2026",
    description: "First-in-human study to evaluate safety and tolerability of investigational compound.",
    visits: 4,
    sites: 5,
  },
  {
    id: "STD-005",
    name: "HORIZON-2023",
    sponsor: "Merck & Co.",
    phase: "Phase III",
    status: "completed",
    enrolled: 312,
    target: 300,
    startDate: "Jun 15, 2022",
    endDate: "Dec 15, 2023",
    description: "Confirmatory trial demonstrating long-term efficacy and safety outcomes.",
    visits: 12,
    sites: 20,
  },
]

const statusStyles = {
  active: "bg-success/10 text-success border-0",
  recruiting: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  paused: "bg-warning/10 text-warning border-0",
}

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>(initialStudies)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    sponsor: "",
    phase: "",
    target: "",
    description: "",
  })

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = selectedTab === "all" || study.status === selectedTab
    return matchesSearch && matchesTab
  })

  const resetForm = () => {
    setFormData({ name: "", sponsor: "", phase: "", target: "", description: "" })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.sponsor || !formData.phase) {
      toast.error("Please fill in required fields")
      return
    }
    const newStudy: Study = {
      id: `STD-${String(studies.length + 1).padStart(3, "0")}`,
      name: formData.name,
      sponsor: formData.sponsor,
      phase: formData.phase,
      status: "recruiting",
      enrolled: 0,
      target: parseInt(formData.target) || 100,
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      endDate: "TBD",
      description: formData.description,
      visits: 0,
      sites: 1,
    }
    setStudies([...studies, newStudy])
    setIsAddOpen(false)
    resetForm()
    toast.success("Study created successfully")
  }

  const handleEdit = () => {
    if (!selectedStudy || !formData.name) {
      toast.error("Please fill in required fields")
      return
    }
    setStudies(
      studies.map((s) =>
        s.id === selectedStudy.id
          ? {
            ...s,
            name: formData.name,
            sponsor: formData.sponsor || s.sponsor,
            phase: formData.phase || s.phase,
            target: parseInt(formData.target) || s.target,
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
      sponsor: study.sponsor,
      phase: study.phase,
      target: String(study.target),
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
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-8"
            />
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
          <TabsContent value={selectedTab} className="mt-6">
            {filteredStudies.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No studies found
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudies.map((study) => {
                  const progress = Math.round((study.enrolled / study.target) * 100)
                  return (
                    <Link key={study.id} href={`/studies/${study.id}`}>
                      <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{study.name}</CardTitle>
                              <CardDescription className="mt-1">{study.sponsor}</CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                                  <FileText className="mr-2 size-4" />
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
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {study.phase}
                            </Badge>
                            <Badge className={statusStyles[study.status]}>
                              {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {study.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Enrollment</span>
                              <span className="font-medium">
                                {study.enrolled}/{study.target} ({progress}%)
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                <FileText className="size-3" />
                                Visits
                              </div>
                              <div className="text-sm font-medium">{study.visits}</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                <Users className="size-3" />
                                Sites
                              </div>
                              <div className="text-sm font-medium">{study.sites}</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="size-3" />
                                End
                              </div>
                              <div className="text-sm font-medium">
                                {study.endDate.split(",")[0].split(" ")[0]}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Study Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Study</DialogTitle>
            <DialogDescription>
              Enter study details and upload the protocol document.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
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
              <FieldLabel htmlFor="sponsor">Sponsor *</FieldLabel>
              <Select
                value={formData.sponsor}
                onValueChange={(v) => setFormData({ ...formData, sponsor: v })}
              >
                <SelectTrigger>
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="phase">Phase *</FieldLabel>
                <Select
                  value={formData.phase}
                  onValueChange={(v) => setFormData({ ...formData, phase: v })}
                >
                  <SelectTrigger>
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
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
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
              <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50 cursor-pointer">
                <div className="text-center">
                  <Upload className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                </div>
              </div>
            </Field>
          </FieldGroup>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Study</DialogTitle>
            <DialogDescription>Update the study details.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Study Title *</FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>Sponsor</FieldLabel>
              <Select
                value={formData.sponsor}
                onValueChange={(v) => setFormData({ ...formData, sponsor: v })}
              >
                <SelectTrigger>
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Phase</FieldLabel>
                <Select
                  value={formData.phase}
                  onValueChange={(v) => setFormData({ ...formData, phase: v })}
                >
                  <SelectTrigger>
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
                <FieldLabel>Target Enrollment</FieldLabel>
                <Input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
