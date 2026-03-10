"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Edit2,
    Globe,
    Users,
    Briefcase,
    FileText,
    MoreHorizontal,
    Eye,
    ExternalLink,
    ChevronRight
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

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
    website: string
    address: string
}

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
}

const sponsors: Sponsor[] = [
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
        website: "www.pfizer.com",
        address: "235 East 42nd Street, New York, NY 10017"
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
        website: "www.novartis.com",
        address: "Lichtstrasse 35, 4056 Basel, Switzerland"
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
        website: "www.jnj.com",
        address: "One Johnson & Johnson Plaza, New Brunswick, NJ 08933"
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
        website: "www.roche.com",
        address: "Grenzacherstrasse 124, 4058 Basel, Switzerland"
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
        website: "www.merck.com",
        address: "2000 Galloping Hill Road, Kenilworth, NJ 07033"
    },
]

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
    },
    {
        id: "STD-010",
        name: "PFIZER-ONC-01",
        sponsor: "Pfizer Inc.",
        phase: "Phase II",
        status: "recruiting",
        enrolled: 45,
        target: 100,
        startDate: "Mar 10, 2024",
        endDate: "Dec 15, 2025",
    },
    {
        id: "STD-011",
        name: "PFIZER-VAX-05",
        sponsor: "Pfizer Inc.",
        phase: "Phase III",
        status: "completed",
        enrolled: 500,
        target: 500,
        startDate: "Jun 1, 2023",
        endDate: "Feb 28, 2024",
    }
]

const statusStyles = {
    active: "bg-success/10 text-success border-0",
    pending: "bg-warning/10 text-warning border-0",
    inactive: "bg-muted text-muted-foreground border-0",
}

const studyStatusStyles = {
    active: "bg-success/10 text-success border-0",
    recruiting: "bg-primary/10 text-primary border-0",
    completed: "bg-muted text-muted-foreground border-0",
    paused: "bg-warning/10 text-warning border-0",
}

export default function SponsorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const sponsor = sponsors.find(s => s.id === id)

    if (!sponsor) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                <h2 className="text-2xl font-bold">Sponsor not found</h2>
                <p className="mt-2 text-muted-foreground">The sponsor organization you are looking for does not exist.</p>
                <Button asChild className="mt-6">
                    <Link href="/sponsors">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Sponsors
                    </Link>
                </Button>
            </div>
        )
    }

    const sponsorStudies = studies.filter(s => s.sponsor === sponsor.name)

    return (
        <>
            <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur sticky top-0 z-10">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/sponsors">
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold">{sponsor.name}</h1>
                        <Badge className={statusStyles[sponsor.status]}>
                            {sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{sponsor.id}</span>
                        <span>•</span>
                        <span>Since {sponsor.createdAt}</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit2 className="mr-2 size-4" />
                        Edit Profile
                    </Button>
                    <Button size="sm">
                        <Mail className="mr-2 size-4" />
                        Contact
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Sponsor Overview */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                            <CardDescription>Sponsor profile and contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Primary Contact</h4>
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Users className="size-4 text-primary" />
                                            {sponsor.contact}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email</h4>
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="size-4 text-primary" />
                                            {sponsor.email}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phone</h4>
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Phone className="size-4 text-primary" />
                                            {sponsor.phone}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Website</h4>
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Globe className="size-4 text-primary" />
                                            <a href={`https://${sponsor.website}`} target="_blank" className="hover:underline text-primary flex items-center gap-1">
                                                {sponsor.website}
                                                <ExternalLink className="size-3" />
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Address</h4>
                                        <p className="text-sm font-medium leading-relaxed">
                                            {sponsor.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Briefcase className="size-5" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold">TOTAL PORTFOLIO</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold">{sponsor.activeStudies}</p>
                                    <p className="text-sm text-muted-foreground">Active Clinical Studies</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                                        <Users className="size-5" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold">TOTAL REACH</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold">{sponsor.totalPatients.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Enrolled Patients Globally</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Portfolio Studies Section */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Clinical Portfolio</CardTitle>
                            <CardDescription>Studies sponsored by {sponsor.name}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/studies?search=${sponsor.name}`}>
                                View in Studies List
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Study Name</TableHead>
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Enrollment</TableHead>
                                    <TableHead>Launch Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sponsorStudies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No studies found for this sponsor
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sponsorStudies.map((study) => {
                                        const progress = Math.round((study.enrolled / study.target) * 100)
                                        return (
                                            <TableRow key={study.id} className="group cursor-pointer hover:bg-muted/50">
                                                <TableCell>
                                                    <Link href={`/studies/${study.id}`} className="block">
                                                        <div className="font-medium group-hover:text-primary transition-colors">{study.name}</div>
                                                        <div className="text-[10px] text-muted-foreground tracking-tight">{study.id}</div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">{study.phase}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${studyStatusStyles[study.status]} text-[10px] h-5 px-1.5`}>
                                                        {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-full max-w-[120px] space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-medium">
                                                            <span>{progress}%</span>
                                                            <span className="text-muted-foreground">{study.enrolled}/{study.target}</span>
                                                        </div>
                                                        <Progress value={progress} className="h-1.5" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">{study.startDate}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
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
                                                                    View Study Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FileText className="mr-2 size-4" />
                                                                Study Protocol
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Edit2 className="mr-2 size-4" />
                                                                Edit Study
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
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
