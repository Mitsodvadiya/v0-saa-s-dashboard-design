"use client"

import { useState } from "react"
import {
    Plus,
    Search,
    Filter,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Circle,
    MoreHorizontal,
    Flag,
    Tag,
    AlertCircle
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    DialogTitle
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"

interface Task {
    id: string
    title: string
    description: string
    category: "Study" | "Patient" | "General" | "Urgent"
    priority: "Low" | "Medium" | "High"
    status: "Pending" | "In Progress" | "Completed"
    dueDate: string
    dueTime: string
}

const initialTasks: Task[] = [
    {
        id: "TSK-001",
        title: "Review Lab Results for BEACON-2024",
        description: "Analyze the blood work results for patients enrolled in Phase III.",
        category: "Study",
        priority: "High",
        status: "Pending",
        dueDate: "Mar 11, 2024",
        dueTime: "10:00 AM"
    },
    {
        id: "TSK-002",
        title: "Follow up with John Smith",
        description: "Confirm the screening visit for next week.",
        category: "Patient",
        priority: "Medium",
        status: "In Progress",
        dueDate: "Mar 11, 2024",
        dueTime: "11:30 AM"
    },
    {
        id: "TSK-003",
        title: "Submit IRB Documentation",
        description: "Finalize and send the required documents to the Ethics Committee.",
        category: "Urgent",
        priority: "High",
        status: "Pending",
        dueDate: "Mar 10, 2024",
        dueTime: "04:00 PM"
    },
    {
        id: "TSK-004",
        title: "Team Meeting",
        description: "Weekly sync with the research team.",
        category: "General",
        priority: "Low",
        status: "Completed",
        dueDate: "Mar 09, 2024",
        dueTime: "09:00 AM"
    }
]

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTab, setSelectedTab] = useState("all")
    const [isAddOpen, setIsAddOpen] = useState(false)

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab = selectedTab === "all" || task.status.toLowerCase().replace(" ", "-") === selectedTab
        return matchesSearch && matchesTab
    })

    const toggleStatus = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === "Pending" ? "In Progress" : t.status === "In Progress" ? "Completed" : "Pending"
                if (nextStatus === "Completed") toast.success("Task completed!")
                return { ...t, status: nextStatus as any }
            }
            return t
        }))
    }

    const priorityStyles = {
        Low: "bg-muted text-muted-foreground",
        Medium: "bg-info/10 text-info",
        High: "bg-warning/10 text-warning border-warning/20",
    }

    const categoryStyles = {
        Study: "bg-primary/10 text-primary border-primary/20",
        Patient: "bg-success/10 text-success border-success/20",
        Urgent: "bg-destructive/10 text-destructive border-destructive/20 font-bold animate-pulse",
        General: "bg-muted text-muted-foreground",
    }

    return (
        <>
            <DashboardHeader
                title="Tasks & Reminders"
                description="Stay organized and never miss a clinical deadline"
            />

            <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Find a task..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-80 pl-8"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="size-4" />
                        </Button>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        New Task
                    </Button>
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="all">All Tasks</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value={selectedTab} className="mt-6">
                        <div className="grid gap-6">
                            {filteredTasks.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="py-12 text-center text-muted-foreground italic font-medium">
                                        No tasks found. Take a break!
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredTasks.map((task) => (
                                    <Card key={task.id} className={`group hover:shadow-md transition-all duration-300 border-l-4 ${task.priority === 'High' ? 'border-l-warning' :
                                        task.priority === 'Medium' ? 'border-l-info' : 'border-l-muted'
                                        }`}>
                                        <CardContent className="p-6 flex items-start gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`mt-0.5 size-6 rounded-full ${task.status === 'Completed' ? 'text-success bg-success/10' : 'text-muted-foreground hover:text-primary transition-colors'}`}
                                                onClick={() => toggleStatus(task.id)}
                                            >
                                                {task.status === 'Completed' ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                                            </Button>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-semibold truncate ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                                                        {task.title}
                                                    </h3>
                                                    <Badge variant="outline" className={`${categoryStyles[task.category]} text-[10px] h-5 px-1.5 uppercase`}>
                                                        {task.category}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {task.description}
                                                </p>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <CalendarIcon className="size-3.5" />
                                                        {task.dueDate}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded-full">
                                                        <Clock className="size-3.5" />
                                                        {task.dueTime}
                                                    </div>
                                                    <Badge variant="outline" className={`${priorityStyles[task.priority]} text-[10px] h-5 px-1.5 ml-auto border-0`}>
                                                        {task.priority} Priority
                                                    </Badge>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Flag className="mr-2 size-4" />
                                                        Change Priority
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Tag className="mr-2 size-4" />
                                                        Change Category
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <AlertCircle className="mr-2 size-4" />
                                                        Delete Task
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription>
                            Add a new clinical or administrative task to your list.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-4">
                        <Field>
                            <FieldLabel>Task Title *</FieldLabel>
                            <Input placeholder="e.g., Update site records" />
                        </Field>
                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Input placeholder="Brief details about the task" />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Category</FieldLabel>
                                <Select defaultValue="General">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Study">Study</SelectItem>
                                        <SelectItem value="Patient">Patient</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                        <SelectItem value="General">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>Priority</FieldLabel>
                                <Select defaultValue="Medium">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Due Date</FieldLabel>
                                <Input type="date" />
                            </Field>
                            <Field>
                                <FieldLabel>Due Time</FieldLabel>
                                <Input type="time" />
                            </Field>
                        </div>
                    </FieldGroup>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => { setIsAddOpen(false); toast.success("Task created and scheduled!"); }}>
                            Create & Notify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
