"use client"

import React, { useState, useEffect } from "react"
import { 
  Folder, 
  FileText, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  Search,
  Upload,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStudy } from "@/lib/study-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// ─── Default Folders ─────────────────────────────────────────────────────────
const DEFAULT_FOLDERS = [
  "Protocol",
  "Informed Consent",
  "Regulatory",
  "Case Report Forms",
  "Lab Reports",
  "Imaging",
  "Safety Reports",
  "Pharmacy",
  "Monitoring",
  "Correspondence"
]

type FileItem = {
  id: string
  name: string
  type: "file"
  size: string
  updatedAt: string
}

type FolderItem = {
  id: string
  name: string
  type: "folder"
  children: (FolderItem | FileItem)[]
  updatedAt: string
}

type Item = FolderItem | FileItem

export default function DocumentsPage() {
  const { selectedStudy } = useStudy()
  const [currentPath, setCurrentPath] = useState<FolderItem[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog states
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // Initialize folders when study changes
  useEffect(() => {
    if (selectedStudy) {
      // In a real app, we'd fetch this. For now, seed with default folders.
      const initialFolders: FolderItem[] = DEFAULT_FOLDERS.map((name, i) => ({
        id: `folder-${i}`,
        name,
        type: "folder",
        children: [],
        updatedAt: new Date().toLocaleDateString()
      }))
      setItems(initialFolders)
      setCurrentPath([])
    } else {
      setItems([])
      setCurrentPath([])
    }
  }, [selectedStudy])

  const currentItems = currentPath.length > 0 
    ? (currentPath[currentPath.length - 1].children) 
    : items

  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNavigate = (folder: FolderItem) => {
    setCurrentPath([...currentPath, folder])
  }

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: "folder",
      children: [],
      updatedAt: new Date().toLocaleDateString()
    }

    if (currentPath.length > 0) {
      const lastFolder = currentPath[currentPath.length - 1]
      lastFolder.children.push(newFolder)
      setItems([...items]) // Trigger re-render
    } else {
      setItems([...items, newFolder])
    }

    setNewFolderName("")
    setIsNewFolderOpen(false)
    toast.success("Folder created")
  }

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: "file",
      size: `${(file.size / 1024).toFixed(1)} KB`,
      updatedAt: new Date().toLocaleDateString()
    }

    if (currentPath.length > 0) {
      const lastFolder = currentPath[currentPath.length - 1]
      lastFolder.children.push(newFile)
      setItems([...items])
    } else {
      setItems([...items, newFile])
    }

    toast.success("File uploaded")
  }

  if (!selectedStudy) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Documents" description="Central document repository" />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center p-8 bg-muted/30 border-dashed">
            <Folder className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Study Selected</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Please select a study from the sidebar to view or manage its documents.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader 
        title={`${selectedStudy.shortName} Documents`} 
        description={`File system for ${selectedStudy.name}`} 
      />
      
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {currentPath.length > 0 && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="size-4" />
              </Button>
            )}
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className="text-muted-foreground hover:text-primary cursor-pointer" onClick={() => setCurrentPath([])}>
                {selectedStudy.shortName}
              </span>
              {currentPath.map((folder, i) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight className="size-4 text-muted-foreground" />
                  <span 
                    className={cn(
                      "cursor-pointer hover:text-primary",
                      i === currentPath.length - 1 ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                  >
                    {folder.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsNewFolderOpen(true)}>
              <Plus className="mr-2 size-4" /> New Folder
            </Button>
            <label className="cursor-pointer">
              <Button asChild>
                <span>
                  <Upload className="mr-2 size-4" /> Upload
                </span>
              </Button>
              <input type="file" className="hidden" onChange={handleUploadFile} />
            </label>
          </div>
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={cn(
                "group relative hover:border-primary/50 transition-all cursor-pointer",
                item.type === "folder" ? "bg-muted/10" : "bg-background"
              )}
              onClick={() => item.type === "folder" && handleNavigate(item)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                {item.type === "folder" ? (
                  <Folder className="size-10 text-blue-500 mb-2 fill-blue-500/20" />
                ) : (
                  <FileText className="size-10 text-muted-foreground mb-2" />
                )}
                <p className="text-xs font-medium truncate w-full" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {item.type === "folder" ? "Folder" : item.size}
                </p>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="size-7">
                        <MoreVertical className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
