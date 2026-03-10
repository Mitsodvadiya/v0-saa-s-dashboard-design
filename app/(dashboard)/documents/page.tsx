"use client"

import { useState } from "react"
import {
  Building2,
  ChevronRight,
  Download,
  Eye,
  File,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Search,
  Stethoscope,
  Trash2,
  Upload,
  User,
  Calendar,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { cn } from "@/lib/utils"

interface FolderNode {
  id: string
  name: string
  type: "sponsor" | "study" | "patient" | "visit"
  icon: typeof Building2
  children?: FolderNode[]
}

const folderTree: FolderNode[] = [
  {
    id: "pfizer",
    name: "Pfizer Inc.",
    type: "sponsor",
    icon: Building2,
    children: [
      {
        id: "beacon-2024",
        name: "BEACON-2024",
        type: "study",
        icon: Stethoscope,
        children: [
          {
            id: "pt-1001",
            name: "PT-1001 - John Smith",
            type: "patient",
            icon: User,
            children: [
              { id: "visit-1", name: "Visit 1 - Screening", type: "visit", icon: Calendar },
              { id: "visit-2", name: "Visit 2 - Baseline", type: "visit", icon: Calendar },
              { id: "visit-3", name: "Visit 3 - Follow Up", type: "visit", icon: Calendar },
            ],
          },
          {
            id: "pt-1003",
            name: "PT-1003 - Michael Chen",
            type: "patient",
            icon: User,
            children: [
              { id: "visit-1-mc", name: "Visit 1 - Screening", type: "visit", icon: Calendar },
              { id: "visit-2-mc", name: "Visit 2 - Baseline", type: "visit", icon: Calendar },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "novartis",
    name: "Novartis AG",
    type: "sponsor",
    icon: Building2,
    children: [
      {
        id: "aurora-phase2",
        name: "AURORA-Phase2",
        type: "study",
        icon: Stethoscope,
        children: [
          {
            id: "pt-1002",
            name: "PT-1002 - Emily Johnson",
            type: "patient",
            icon: User,
          },
        ],
      },
    ],
  },
  {
    id: "jnj",
    name: "Johnson & Johnson",
    type: "sponsor",
    icon: Building2,
    children: [
      {
        id: "nova-trial",
        name: "NOVA-Trial",
        type: "study",
        icon: Stethoscope,
      },
    ],
  },
]

const documents = [
  {
    id: "DOC-001",
    name: "Informed_Consent_v2.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Dr. Sarah Chen",
    uploadedAt: "Mar 10, 2024",
    folder: "Visit 1 - Screening",
  },
  {
    id: "DOC-002",
    name: "Lab_Results_CBC.pdf",
    type: "PDF",
    size: "1.1 MB",
    uploadedBy: "Lab Technician",
    uploadedAt: "Mar 8, 2024",
    folder: "Visit 2 - Baseline",
  },
  {
    id: "DOC-003",
    name: "ECG_Report.pdf",
    type: "PDF",
    size: "856 KB",
    uploadedBy: "Cardiology Dept",
    uploadedAt: "Mar 8, 2024",
    folder: "Visit 2 - Baseline",
  },
  {
    id: "DOC-004",
    name: "Medical_History_Form.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedBy: "Dr. Sarah Chen",
    uploadedAt: "Mar 5, 2024",
    folder: "Visit 1 - Screening",
  },
  {
    id: "DOC-005",
    name: "AE_Report_001.pdf",
    type: "PDF",
    size: "456 KB",
    uploadedBy: "Study Coordinator",
    uploadedAt: "Mar 12, 2024",
    folder: "Visit 3 - Follow Up",
  },
  {
    id: "DOC-006",
    name: "Protocol_Amendment_v3.pdf",
    type: "PDF",
    size: "3.2 MB",
    uploadedBy: "Sponsor",
    uploadedAt: "Feb 28, 2024",
    folder: "BEACON-2024",
  },
]

function FolderItem({
  node,
  level = 0,
  expandedFolders,
  toggleFolder,
  selectedFolder,
  setSelectedFolder,
}: {
  node: FolderNode
  level?: number
  expandedFolders: Set<string>
  toggleFolder: (id: string) => void
  selectedFolder: string | null
  setSelectedFolder: (id: string) => void
}) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolder === node.id
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          setSelectedFolder(node.id)
          if (hasChildren) {
            toggleFolder(node.id)
          }
        }}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "size-4 transition-transform text-muted-foreground",
              isExpanded && "rotate-90"
            )}
          />
        ) : (
          <span className="size-4" />
        )}
        {isExpanded && hasChildren ? (
          <FolderOpen className="size-4 text-primary" />
        ) : (
          <node.icon className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground")} />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FolderItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["pfizer", "beacon-2024", "pt-1001"]))
  const [selectedFolder, setSelectedFolder] = useState<string | null>("visit-3")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <DashboardHeader title="Documents" description="Manage study and patient documents" />
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid h-full gap-6 lg:grid-cols-4">
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Folder Structure</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-2 space-y-0.5">
                  {folderTree.map((node) => (
                    <FolderItem
                      key={node.id}
                      node={node}
                      expandedFolders={expandedFolders}
                      toggleFolder={toggleFolder}
                      selectedFolder={selectedFolder}
                      setSelectedFolder={setSelectedFolder}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Folder className="size-4" />
                <span>Pfizer Inc.</span>
                <ChevronRight className="size-4" />
                <span>BEACON-2024</span>
                <ChevronRight className="size-4" />
                <span>PT-1001</span>
                <ChevronRight className="size-4" />
                <span className="text-foreground font-medium">Visit 3 - Follow Up</span>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8"
                  />
                </div>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Upload className="mr-2 size-4" />
                  Upload
                </Button>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10">
                              <FileText className="size-5 text-destructive" />
                            </div>
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{doc.size}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{doc.uploadedBy}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{doc.uploadedAt}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 size-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 size-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document to the selected folder.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50">
                <div className="text-center">
                  <Upload className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">
                    Drop files here or click to upload
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsUploadOpen(false)}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
