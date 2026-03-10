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
    Eye
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
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

const statusStyles = {
    active: "bg-success/10 text-success border-0",
    recruiting: "bg-primary/10 text-primary border-0",
    completed: "bg-muted text-muted-foreground border-0",
    paused: "bg-warning/10 text-warning border-0",
}

const patientStatusStyles = {
    active: "bg-success/10 text-success border-0",
    screening: "bg-primary/10 text-primary border-0",
    completed: "bg-muted text-muted-foreground border-0",
    withdrawn: "bg-destructive/10 text-destructive border-0",
}

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

    return (
        <>
            <div className="flex items-center gap-4 border-b bg-background/95 p-4 backdrop-blur sticky top-0 z-10">
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
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{study.id}</span>
                        <span>•</span>
                        <span>{study.sponsor}</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit2 className="mr-2 size-4" />
                        Edit
                    </Button>
                    <Button size="sm">
                        <FileText className="mr-2 size-4" />
                        Download Protocol
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Study Overview */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle>Study Overview</CardTitle>
                            <CardDescription>Comprehensive details about clinical trial</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {study.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Phase</h4>
                                    <p className="text-sm font-medium">{study.phase}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Sponsor</h4>
                                    <p className="text-sm font-medium">{study.sponsor}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h4>
                                    <p className="text-sm font-medium">{study.startDate}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Estimated End Date</h4>
                                    <p className="text-sm font-medium">{study.endDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enrollment Progress */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Enrollment Progress</CardTitle>
                            <CardDescription>Target vs actual enrollment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-bold">{progress}%</div>
                                <div className="text-sm text-muted-foreground">
                                    {study.enrolled} / {study.target} Patients
                                </div>
                            </div>
                            <Progress value={progress} className="h-3 shadow-inner" />

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-primary" />
                                        <span className="text-sm text-muted-foreground">Enrolled</span>
                                    </div>
                                    <span className="text-sm font-medium">{study.enrolled}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-muted" />
                                        <span className="text-sm text-muted-foreground">Remaining</span>
                                    </div>
                                    <span className="text-sm font-medium">{study.target - study.enrolled}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                                    <p className="text-2xl font-bold">{study.enrolled}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-info/10 text-info">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Visits</p>
                                    <p className="text-2xl font-bold">{study.visits}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-success/10 text-success">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Sites</p>
                                    <p className="text-2xl font-bold">{study.sites}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                                    <Clock className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending Action</p>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Enrolled Patients Section */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Enrolled Patients</CardTitle>
                            <CardDescription>Patients specifically enrolled in this study</CardDescription>
                        </div>
                        <Button size="sm" asChild>
                            <Link href={`/patients?study=${study.name}`}>
                                View All
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Patient</TableHead>
                                    <TableHead>Enrolled</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Next Visit</TableHead>
                                    <TableHead>Compliance</TableHead>
                                    <TableHead className="w-[50px] pr-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studyPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No patients enrolled in this study
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    studyPatients.map((patient) => (
                                        <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="pl-6">
                                                <Link href={`/patients/${patient.id}`} className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                                            {patient.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-medium hover:text-primary transition-colors">
                                                            {patient.name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {patient.id} • {patient.age}y
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{patient.enrolledDate}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${patientStatusStyles[patient.status]} text-[10px] px-1.5 h-5`}>
                                                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{patient.nextVisit || "—"}</span>
                                            </TableCell>
                                            <TableCell>
                                                {patient.compliance !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`size-1.5 rounded-full ${patient.compliance >= 90
                                                                    ? "bg-success"
                                                                    : patient.compliance >= 75
                                                                        ? "bg-warning"
                                                                        : "bg-destructive"
                                                                }`}
                                                        />
                                                        <span className="text-sm font-medium">{patient.compliance}%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/patients/${patient.id}`}>
                                                                <Eye className="mr-2 size-4" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 size-4" />
                                                            Email Patient
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Phone className="mr-2 size-4" />
                                                            Call Patient
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
        </>
    )
}
