"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    FileText,
    Users,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Mail,
    Phone,
    Edit2,
    Eye,
    Download,
    Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface Patient {
    id: string
    name: string
    initials: string
    age: number
    gender: string
    email: string
    phone: string
    study: string
    enrolledDate: string
    status: "active" | "screening" | "completed" | "withdrawn"
    nextVisit: string | null
    visitStatus: "confirmed" | "pending" | "rescheduled" | null
    compliance: number | null
}

const studies: Study[] = [
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

const patients: Patient[] = [
    {
        id: "PT-1001",
        name: "John Smith",
        initials: "JS",
        age: 54,
        gender: "Male",
        email: "john.smith@email.com",
        phone: "+1 (555) 111-2222",
        study: "BEACON-2024",
        enrolledDate: "Jan 20, 2024",
        status: "active",
        nextVisit: "Mar 15, 2024",
        visitStatus: "confirmed",
        compliance: 95,
    },
    {
        id: "PT-1002",
        name: "Emily Johnson",
        initials: "EJ",
        age: 42,
        gender: "Female",
        email: "emily.johnson@email.com",
        phone: "+1 (555) 222-3333",
        study: "AURORA-Phase2",
        enrolledDate: "Feb 12, 2024",
        status: "active",
        nextVisit: "Mar 12, 2024",
        visitStatus: "pending",
        compliance: 88,
    },
    {
        id: "PT-1003",
        name: "Michael Chen",
        initials: "MC",
        age: 61,
        gender: "Male",
        email: "michael.chen@email.com",
        phone: "+1 (555) 333-4444",
        study: "BEACON-2024",
        enrolledDate: "Jan 18, 2024",
        status: "active",
        nextVisit: "Mar 18, 2024",
        visitStatus: "confirmed",
        compliance: 100,
    },
    {
        id: "PT-1004",
        name: "Sarah Williams",
        initials: "SW",
        age: 37,
        gender: "Female",
        email: "sarah.williams@email.com",
        phone: "+1 (555) 444-5555",
        study: "NOVA-Trial",
        enrolledDate: "Dec 5, 2023",
        status: "active",
        nextVisit: "Mar 13, 2024",
        visitStatus: "rescheduled",
        compliance: 92,
    },
    {
        id: "PT-1005",
        name: "David Brown",
        initials: "DB",
        age: 48,
        gender: "Male",
        email: "david.brown@email.com",
        phone: "+1 (555) 555-6666",
        study: "AURORA-Phase2",
        enrolledDate: "Feb 20, 2024",
        status: "screening",
        nextVisit: "Mar 14, 2024",
        visitStatus: "pending",
        compliance: null,
    },
    {
        id: "PT-1008",
        name: "Jennifer Taylor",
        initials: "JT",
        age: 44,
        gender: "Female",
        email: "jennifer.taylor@email.com",
        phone: "+1 (555) 888-9999",
        study: "BEACON-2024",
        enrolledDate: "Jan 25, 2024",
        status: "withdrawn",
        nextVisit: null,
        visitStatus: null,
        compliance: 75,
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

const patientStatusStyles: Record<string, string> = {
    active: "bg-success/10 text-success border-0",
    screening: "bg-primary/10 text-primary border-0",
    completed: "bg-muted text-muted-foreground border-0",
    withdrawn: "bg-destructive/10 text-destructive border-0",
}

const TAB_TRIGGER_CLASS = "rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"

export default function StudyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const study = studies.find(s => s.id === id)

    if (!study) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                <h2 className="text-2xl font-bold">Study not found</h2>
                <p className="mt-2 text-muted-foreground">The study you are looking for does not exist or has been archived.</p>
                <Button asChild className="mt-6">
                    <Link href="/studies">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Studies
                    </Link>
                </Button>
            </div>
        )
    }

    const studyPatients = patients.filter(p => p.study === study.name)
    const progress = Math.round((study.enrolled / study.target) * 100)

    const visitSchedule = [
        { visit: "Screening", window: "Day -14 to -1", completed: study.enrolled, total: study.target, type: "Screening" },
        { visit: "Baseline (V1)", window: "Day 1", completed: Math.round(study.enrolled * 0.98), total: study.enrolled, type: "On-Site" },
        { visit: "Week 4 (V2)", window: "Day 28 ± 3", completed: Math.round(study.enrolled * 0.88), total: study.enrolled, type: "On-Site" },
        { visit: "Week 12 (V3)", window: "Day 84 ± 7", completed: Math.round(study.enrolled * 0.74), total: study.enrolled, type: "Remote" },
        { visit: "Week 24 (V4)", window: "Day 168 ± 7", completed: Math.round(study.enrolled * 0.61), total: study.enrolled, type: "On-Site" },
        { visit: "End of Study", window: "Day 365 ± 14", completed: Math.round(study.enrolled * 0.42), total: study.enrolled, type: "On-Site" },
    ]

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ── Sticky Header ── */}
            <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur sticky top-0 z-10 shrink-0">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/studies">
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold">{study.name}</h1>
                        <Badge className={statusStyles[study.status]}>
                            {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-medium">
                            {study.phase}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{study.id}</span>
                        <span>•</span>
                        <span>{study.protocolNumber}</span>
                        <span>•</span>
                        <span>{study.sponsor}</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit2 className="mr-2 size-4" />
                        Edit Study
                    </Button>
                    <Button size="sm">
                        <Download className="mr-2 size-4" />
                        Protocol
                    </Button>
                </div>
            </div>

            {/* ── Tabs ── */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b shrink-0">
                    <TabsList className="bg-transparent h-auto p-0 py-2 gap-2 flex-wrap">
                        <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>Overview</TabsTrigger>
                        <TabsTrigger value="patients" className={TAB_TRIGGER_CLASS}>Patients ({studyPatients.length})</TabsTrigger>
                        <TabsTrigger value="visits" className={TAB_TRIGGER_CLASS}>Visits</TabsTrigger>
                        <TabsTrigger value="analytics" className={TAB_TRIGGER_CLASS}>Analytics</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6">

                        {/* ── OVERVIEW ── */}
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">

                                {/* Left: main info card */}
                                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Study Information</CardTitle>
                                        <CardDescription>Protocol and investigator details</CardDescription>
                                    </CardHeader>
                                    <div className="space-y-8 p-6 pt-0">

                                        {/* Study Profile */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Study Profile</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Protocol Number</p>
                                                    <p className="text-sm font-semibold">{study.protocolNumber}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Study Type</p>
                                                    <Badge variant="outline" className="text-xs font-semibold">{study.type}</Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phase</p>
                                                    <p className="text-sm font-semibold">{study.phase}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</p>
                                                    <Badge className={statusStyles[study.status] + " text-xs"}>
                                                        {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Description</p>
                                                    <p className="text-sm font-semibold leading-relaxed">{study.description}</p>
                                                </div>
                                                {study.tags && study.tags.length > 0 && (
                                                    <div className="space-y-1 col-span-2">
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Therapeutic Areas</p>
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            {study.tags.map(tag => (
                                                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Principal Investigator */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Principal Investigator</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Full Name</p>
                                                    <p className="text-sm font-semibold">{study.piName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Role</p>
                                                    <p className="text-sm font-semibold">Lead Investigator</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                                                    <a href={`mailto:${study.piEmail}`} className="text-sm font-semibold text-primary hover:underline">
                                                        {study.piEmail}
                                                    </a>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                                                    <p className="text-sm font-semibold">{study.piPhone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Study Timeline</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Start Date</p>
                                                    <p className="text-sm font-semibold">{study.startDate}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">End Date</p>
                                                    <p className="text-sm font-semibold">{study.endDate}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Planned Duration</p>
                                                    <p className="text-sm font-semibold">{study.enrollmentDuration}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Created Date</p>
                                                    <p className="text-sm font-semibold">{study.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Card>

                                {/* Right: stat cards */}
                                <div className="space-y-6">
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Users className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">ENROLLMENT</Badge>
                                            </div>
                                            <div className="space-y-1 mb-4">
                                                <p className="text-3xl font-bold">{study.enrolled} / {study.target}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Enrolled / Target Patients</p>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                            <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                                                    <CheckCircle2 className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">SITES</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">{study.sites}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Active Clinical Sites</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                                                    <Clock className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">VISITS</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">{study.visits}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Protocol Visit Types</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ── PATIENTS ── */}
                        <TabsContent value="patients" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-primary">Enrolled Patients</CardTitle>
                                        <CardDescription>{studyPatients.length} patient{studyPatients.length !== 1 ? "s" : ""} enrolled in {study.name}</CardDescription>
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/patients?study=${study.name}`}>
                                            <Plus className="mr-2 size-4" />
                                            Add Patient
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Patient</TableHead>
                                                <TableHead>Enrolled</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Next Visit</TableHead>
                                                <TableHead>Compliance</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {studyPatients.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                        No patients enrolled in this study.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                studyPatients.map((patient) => (
                                                    <TableRow key={patient.id}>
                                                        <TableCell>
                                                            <Link href={`/patients/${patient.id}`} className="flex items-center gap-3">
                                                                <Avatar className="size-8">
                                                                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{patient.initials}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium hover:text-primary transition-colors">{patient.name}</div>
                                                                    <div className="text-[10px] text-muted-foreground">{patient.id} • {patient.age}y {patient.gender}</div>
                                                                </div>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{patient.enrolledDate}</TableCell>
                                                        <TableCell>
                                                            <Badge className={patientStatusStyles[patient.status] + " text-[10px]"}>
                                                                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm">{patient.nextVisit || "—"}</TableCell>
                                                        <TableCell>
                                                            {patient.compliance !== null ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`size-1.5 rounded-full ${patient.compliance >= 90 ? "bg-success" : patient.compliance >= 75 ? "bg-warning" : "bg-destructive"}`} />
                                                                    <span className="text-sm font-medium">{patient.compliance}%</span>
                                                                </div>
                                                            ) : <span className="text-sm text-muted-foreground">—</span>}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="size-8">
                                                                        <MoreHorizontal className="size-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/patients/${patient.id}`}><Eye className="mr-2 size-4" />View Profile</Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem><Mail className="mr-2 size-4" />Email Patient</DropdownMenuItem>
                                                                    <DropdownMenuItem><Phone className="mr-2 size-4" />Call Patient</DropdownMenuItem>
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
                        </TabsContent>

                        {/* ── VISITS ── */}
                        <TabsContent value="visits" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-primary">Visit Schedule</CardTitle>
                                        <CardDescription>Protocol-defined visits and completion status</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Visit Name</TableHead>
                                                <TableHead>Window</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Completed</TableHead>
                                                <TableHead>Progress</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visitSchedule.map((v) => {
                                                const pct = Math.round((v.completed / v.total) * 100)
                                                return (
                                                    <TableRow key={v.visit}>
                                                        <TableCell className="font-medium">{v.visit}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{v.window}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={`text-[10px] ${v.type === "Remote" ? "border-primary/50 text-primary" : ""}`}>
                                                                {v.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm">{v.completed} / {v.total}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3 w-36">
                                                                <Progress value={pct} className="h-1.5 flex-1" />
                                                                <span className="text-xs font-medium w-8 text-right">{pct}%</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── ANALYTICS ── */}
                        <TabsContent value="analytics" className="mt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Performance Metrics</CardTitle>
                                        <CardDescription>Key study performance indicators</CardDescription>
                                    </CardHeader>
                                    <div className="space-y-8 p-6 pt-0">
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Enrollment</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                {[
                                                    { label: "Total Sites", value: study.sites },
                                                    { label: "Enrolled Patients", value: study.enrolled },
                                                    { label: "Target Enrollment", value: study.target },
                                                    { label: "Enrollment Gap", value: Math.max(0, study.target - study.enrolled) },
                                                    { label: "Completion", value: `${progress}%` },
                                                    { label: "Avg. Per Site", value: `${Math.round(study.enrolled / study.sites)} patients` },
                                                ].map(item => (
                                                    <div key={item.label} className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                                                        <p className="text-sm font-semibold">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Quality Indicators</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                {[
                                                    { label: "Protocol Deviation Rate", value: "3.2%" },
                                                    { label: "Avg. Patient Compliance", value: "91%" },
                                                    { label: "Screen Failure Rate", value: "8.4%" },
                                                    { label: "Dropout Rate", value: "2.1%" },
                                                ].map(item => (
                                                    <div key={item.label} className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                                                        <p className="text-sm font-semibold">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Users className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">RATE</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">+12%</p>
                                                <p className="text-sm text-muted-foreground font-medium">Enrollment Rate vs. Last Month</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                                                    <CheckCircle2 className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">COMPLIANCE</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">91%</p>
                                                <p className="text-sm text-muted-foreground font-medium">Overall Patient Compliance</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}
