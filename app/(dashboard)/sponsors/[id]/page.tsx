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
    ChevronRight,
    Plus
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    website: string
    createdAt: string
    updatedAt: string
    status: "active" | "pending" | "inactive"
}

interface Document {
    id: string
    name: string
    type: string
    size: string
    status: string
    uploadedBy: string
    uploadedAt: string
}

interface Note {
    id: string
    content: string
    author: string
    timestamp: string
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
        organizationName: "Pfizer Pharmaceutical Group",
        type: "Pharmaceutical",
        contact: "Dr. James Wilson",
        email: "james.wilson@pfizer.com",
        phone: "+1 (555) 123-4567",
        secondaryContact: "Sarah Millers",
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

const mockDocuments: Document[] = [
    { id: "DOC-001", name: "Master Service Agreement", type: "Legal", size: "2.4 MB", status: "Verified", uploadedBy: "Dr. Sarah Chen", uploadedAt: "2024-01-20" },
    { id: "DOC-002", name: "Quality Assurance Certificate", type: "Compliance", size: "1.1 MB", status: "Verified", uploadedBy: "Admin", uploadedAt: "2024-02-15" },
    { id: "DOC-003", name: "Sponsor Billing Details", type: "Finance", size: "0.5 MB", status: "Pending", uploadedBy: "Michael Chen", uploadedAt: "2024-03-05" },
]

const mockNotes: Note[] = [
    { id: "N-001", content: "Initial agreement signed. Onboarding set for next week.", author: "Dr. Sarah Chen", timestamp: "Jan 16, 2024, 10:30 AM" },
    { id: "N-002", content: "Requested update on study BEACON-2024 recruitment benchmarks.", author: "James Wilson", timestamp: "Feb 10, 2024, 02:15 PM" },
    { id: "N-003", content: "Follow-up meeting scheduled for Q2 portfolio review.", author: "Dr. Robert Chen", timestamp: "Mar 01, 2024, 09:00 AM" },
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SponsorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [formData, setFormData] = useState<Sponsor>({
        id: "",
        name: "",
        organizationName: "",
        type: "Other",
        contact: "",
        email: "",
        phone: "",
        activeStudies: 0,
        totalStudies: 0,
        totalPatients: 0,
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        website: "",
        createdAt: "",
        updatedAt: "",
        status: "active",
    })

    const sponsor = sponsors.find(s => s.id === id)

    const openEdit = () => {
        if (sponsor) {
            setFormData({ ...sponsor })
            setIsEditDialogOpen(true)
        }
    }

    const handleEdit = () => {
        if (!formData.name || !formData.email || !formData.organizationName) {
            toast.error("Please fill in required fields")
            return
        }
        // In a real app, this would be an API call
        toast.success("Sponsor profile updated successfully")
        setIsEditDialogOpen(false)
    }

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
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur sticky top-0 z-10 shrink-0">
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
                        <span>Created: {sponsor.createdAt}</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={openEdit}>
                        <Edit2 className="mr-2 size-4" />
                        Edit Profile
                    </Button>
                    <Button size="sm">
                        <Mail className="mr-2 size-4" />
                        Contact
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b shrink-0">
                    <TabsList className="bg-transparent h-auto p-0 py-2 gap-2 flex-wrap">
                        <TabsTrigger
                            value="overview"
                            className="rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="studies"
                            className="rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"
                        >
                            Studies ({sponsor.activeStudies})
                        </TabsTrigger>
                        <TabsTrigger
                            value="documents"
                            className="rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"
                        >
                            Documents ({mockDocuments.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="notes"
                            className="rounded-md border-0 hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none px-4 py-2 text-sm transition-all"
                        >
                            Notes & Logs
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="md:col-span-2 shadow-sm bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-base">Organization Information</CardTitle>
                                        <CardDescription>Legal and operational details of the sponsor</CardDescription>
                                    </CardHeader>
                                    <div className="space-y-8 p-6 pt-0">
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Organization Profile</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Legal Entity Name</p>
                                                    <p className="text-sm font-semibold">{sponsor.organizationName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sponsor Type</p>
                                                    <Badge variant="outline" className="text-xs font-semibold">
                                                        {sponsor.type}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Website</p>
                                                    <Link href={`https://${sponsor.website}`} target="_blank" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                                                        {sponsor.website} <ExternalLink className="size-3" />
                                                    </Link>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Created Date</p>
                                                    <p className="text-sm font-semibold">{sponsor.createdAt}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Contact Information</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Primary Contact</p>
                                                    <p className="text-sm font-semibold">{sponsor.contact}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Secondary Contact</p>
                                                    <p className="text-sm font-semibold">{sponsor.secondaryContact || "Not Assigned"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Official Email</p>
                                                    <p className="text-sm font-semibold">{sponsor.email}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Contact Phone</p>
                                                    <p className="text-sm font-semibold">{sponsor.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">Registered Address</h4>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Street Address</p>
                                                    <p className="text-sm font-semibold">{sponsor.addressLine1} {sponsor.addressLine2 && `, ${sponsor.addressLine2}`}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">City</p>
                                                    <p className="text-sm font-semibold">{sponsor.city}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">State / Province</p>
                                                    <p className="text-sm font-semibold">{sponsor.state}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Country</p>
                                                    <p className="text-sm font-semibold">{sponsor.country}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Postal Code</p>
                                                    <p className="text-sm font-semibold">{sponsor.postalCode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Briefcase className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">PORTFOLIO SIZE</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">{sponsor.activeStudies} / {sponsor.totalStudies}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Active / Total Studies</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                                                    <Users className="size-5" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold tracking-tight">GLOBAL REACH</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold">{sponsor.totalPatients.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground font-medium">Total Enrolled Patients</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="studies" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-primary">Associated Studies</CardTitle>
                                        <CardDescription>Clinical trials funded by {sponsor.name}</CardDescription>
                                    </div>
                                    <Button size="sm">
                                        <Plus className="mr-2 size-4" />
                                        Initiate New Study
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Study Name & ID</TableHead>
                                                <TableHead>Phase</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Patients</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sponsorStudies.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                        No studies found for this sponsor.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sponsorStudies.map((study) => (
                                                    <TableRow key={study.id}>
                                                        <TableCell>
                                                            <Link href={`/studies/${study.id}`} className="block">
                                                                <div className="font-medium hover:text-primary transition-colors">{study.name}</div>
                                                                <div className="text-[10px] text-muted-foreground">{study.id}</div>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="text-[10px]">{study.phase}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={studyStatusStyles[study.status] + " text-[10px]"}>
                                                                {study.status.toUpperCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm font-medium">{study.enrolled} / {study.target}</div>
                                                            <Progress value={(study.enrolled / study.target) * 100} className="h-1 mt-1.5 w-24" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-xs text-muted-foreground">{study.startDate} —</div>
                                                            <div className="text-xs text-muted-foreground">{study.endDate}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="size-8">
                                                                        <MoreHorizontal className="size-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/studies/${study.id}`}>
                                                                            <Eye className="mr-2 size-4" /> View Details
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Edit2 className="mr-2 size-4" /> Edit Study
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
                        </TabsContent>

                        <TabsContent value="documents" className="mt-0">
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base text-primary">Sponsor Documents</CardTitle>
                                        <CardDescription>Legal agreements, MSAs, and compliance files</CardDescription>
                                    </div>
                                    <Button size="sm">
                                        <FileText className="mr-2 size-4" />
                                        Upload Document
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Document Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Uploaded By</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockDocuments.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-8 rounded bg-muted flex items-center justify-center">
                                                                <FileText className="size-4 text-muted-foreground" />
                                                            </div>
                                                            <div className="font-medium text-sm">{doc.name}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><span className="text-xs">{doc.type}</span></TableCell>
                                                    <TableCell><span className="text-xs">{doc.uploadedBy}</span></TableCell>
                                                    <TableCell><span className="text-xs">{doc.uploadedAt}</span></TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[10px]">{doc.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0">
                            <Card className="shadow-sm border-0 bg-transparent shadow-none">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold">Communication History</h3>
                                    <Button size="sm">
                                        <Plus className="mr-2 size-4" />
                                        Add Note
                                    </Button>
                                </div>
                                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-muted ml-1 p-2">
                                    {mockNotes.map((note) => (
                                        <div key={note.id} className="relative pl-10">
                                            <div className="absolute left-[-2px] top-1.5 size-3 rounded-full bg-primary ring-4 ring-background z-10" />
                                            <div className="bg-muted/40 p-4 rounded-xl border border-border/50 shadow-sm transition-all hover:bg-muted/60">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="size-6">
                                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                                {note.author.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-xs font-bold">{note.author}</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-medium">{note.timestamp}</span>
                                                </div>
                                                <p className="text-sm leading-relaxed text-foreground/80">{note.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Sponsor Profile</DialogTitle>
                        <DialogDescription>
                            Update the profile information for {formData.name}.
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
                                <Field>
                                    <FieldLabel htmlFor="edit-status">Status</FieldLabel>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: Sponsor["status"]) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger id="edit-status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold border-b pb-2">Contact Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="edit-contact">Primary Contact Name *</FieldLabel>
                                    <Input
                                        id="edit-contact"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="edit-sec-contact">Secondary Contact Name</FieldLabel>
                                    <Input
                                        id="edit-sec-contact"
                                        value={formData.secondaryContact || ""}
                                        onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
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
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold border-b pb-2">Address Information</h4>
                            <Field>
                                <FieldLabel htmlFor="edit-addr1">Address Line 1</FieldLabel>
                                <Input
                                    id="edit-addr1"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-addr2">Address Line 2</FieldLabel>
                                <Input
                                    id="edit-addr2"
                                    value={formData.addressLine2 || ""}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
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
                                    <FieldLabel htmlFor="edit-postal">Postal Code</FieldLabel>
                                    <Input
                                        id="edit-postal"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
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
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
