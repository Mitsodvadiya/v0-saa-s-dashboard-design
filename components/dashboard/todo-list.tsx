"use client"

import { useState } from "react"
import { Plus, Check, Trash2, Clock, AlertCircle, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"

interface Todo {
    id: string
    text: string
    completed: boolean
    dueDate: string
    priority: "low" | "medium" | "high"
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: "1", text: "Process BEACON-2024 Lab Results", completed: false, dueDate: "2:00 PM", priority: "high" },
        { id: "2", text: "Schedule Screenings for AURORA Patients", completed: true, dueDate: "10:30 AM", priority: "medium" },
        { id: "3", text: "Upload Phase III Protocol Draft", completed: false, dueDate: "4:45 PM", priority: "medium" },
    ])
    const [newTodo, setNewTodo] = useState("")
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

    const addTodo = () => {
        if (!newTodo.trim()) return
        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            text: newTodo,
            completed: false,
            dueDate: "TBD",
            priority: priority,
        }
        setTodos([todo, ...todos])
        setNewTodo("")
        toast.success("Task added to list")
    }

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    }

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id))
        toast.info("Task removed")
    }

    const priorityStyles = {
        low: "bg-muted text-muted-foreground border-0",
        medium: "bg-info/10 text-info border-0",
        high: "bg-warning/10 text-warning border-0",
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <CheckCircleIcon className="size-4 text-primary" />
                        Quick Tasks
                    </CardTitle>
                    <CardDescription>Memorize and track your daily activities</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                    {todos.filter(t => !t.completed).length} Pending
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Add new task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        className="flex-1"
                    />
                    <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="icon" onClick={addTodo}>
                        <Plus className="size-4" />
                    </Button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
                    {todos.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm italic">
                            No tasks left. Enjoy your day!
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border group transition-all duration-200 hover:shadow-sm ${todo.completed ? 'bg-muted/30 border-dashed opacity-75' : 'bg-background'}`}
                            >
                                <Checkbox
                                    checked={todo.completed}
                                    onCheckedChange={() => toggleTodo(todo.id)}
                                    id={`todo-${todo.id}`}
                                />
                                <div className="flex-1 min-w-0">
                                    <label
                                        htmlFor={`todo-${todo.id}`}
                                        className={`text-sm font-medium leading-none cursor-pointer select-none ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                        {todo.text}
                                    </label>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="size-3" />
                                            {todo.dueDate}
                                        </span>
                                        <Badge className={`${priorityStyles[todo.priority]} text-[10px] h-4 px-1 leading-none uppercase font-bold`}>
                                            {todo.priority}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function CheckCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
