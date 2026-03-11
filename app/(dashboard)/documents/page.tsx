"use client"

import { useState, useCallback, useRef } from "react"
import {
  AlertCircle, AlertTriangle, Archive, Building2, Calendar, Check,
  ChevronRight, Clock, Download, Edit2, Eye, File, FileImage,
  FileText, Filter, Folder, FolderOpen, HardDrive, MoreHorizontal,
  Search, Shield, Stethoscope, Tag, Trash2, Upload, User, X, Plus,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────

type DocType = "Protocol" | "Consent Form" | "Lab Report" | "Patient Record" |
  "Visit Report" | "Regulatory Document" | "Other"

type Role = "Admin" | "Coordinator" | "Doctor" | "CRA"

interface DocVersion {
  version: number
  uploadedBy: string
  uploadedAt: string
  size: string
}

interface ActivityEntry {
  action: string
  user: string
  timestamp: string
}

interface Document {
  id: string
  name: string
  docType: DocType
  relatedEntity: string
  folder: string
  uploadedBy: string
  uploadedAt: string
  size: string
  version: number
  tags: string[]
  description: string
  versions: DocVersion[]
  activityLog: ActivityEntry[]
}

interface FolderNode {
  id: string
  name: string
  type: "sponsor" | "study" | "patient" | "visit"
  icon: typeof Building2
  children?: FolderNode[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const folderTree: FolderNode[] = [
  {
    id: "pfizer", name: "Pfizer Inc.", type: "sponsor", icon: Building2,
    children: [{
      id: "beacon-2024", name: "BEACON-2024", type: "study", icon: Stethoscope,
      children: [
        {
          id: "pt-1001", name: "PT-1001 · John Smith", type: "patient", icon: User,
          children: [
            { id: "v1-js", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
            { id: "v2-js", name: "Visit 2 – Baseline", type: "visit", icon: Calendar },
            { id: "v3-js", name: "Visit 3 – Follow Up", type: "visit", icon: Calendar },
          ],
        },
        {
          id: "pt-1003", name: "PT-1003 · Michael Chen", type: "patient", icon: User,
          children: [
            { id: "v1-mc", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
            { id: "v2-mc", name: "Visit 2 – Baseline", type: "visit", icon: Calendar },
          ],
        },
        {
          id: "pt-1008", name: "PT-1008 · Jennifer Taylor", type: "patient", icon: User,
          children: [
            { id: "v1-jt", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
          ],
        },
      ],
    }],
  },
  {
    id: "novartis", name: "Novartis AG", type: "sponsor", icon: Building2,
    children: [{
      id: "aurora-phase2", name: "AURORA-Phase2", type: "study", icon: Stethoscope,
      children: [
        {
          id: "pt-1002", name: "PT-1002 · Emily Johnson", type: "patient", icon: User,
          children: [
            { id: "v1-ej", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
            { id: "v2-ej", name: "Visit 2 – Baseline", type: "visit", icon: Calendar },
          ],
        },
        {
          id: "pt-1005", name: "PT-1005 · David Brown", type: "patient", icon: User,
          children: [
            { id: "v1-db", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
          ],
        },
      ],
    }],
  },
  {
    id: "jnj", name: "Johnson & Johnson", type: "sponsor", icon: Building2,
    children: [{
      id: "nova-trial", name: "NOVA-Trial", type: "study", icon: Stethoscope,
      children: [
        {
          id: "pt-1004", name: "PT-1004 · Sarah Williams", type: "patient", icon: User,
          children: [
            { id: "v1-sw", name: "Visit 1 – Screening", type: "visit", icon: Calendar },
            { id: "v2-sw", name: "Visit 2 – Baseline", type: "visit", icon: Calendar },
          ],
        },
      ],
    }],
  },
]

const initialDocuments: Document[] = [
  {
    id: "DOC-001", name: "Informed_Consent_v2.pdf", docType: "Consent Form",
    relatedEntity: "PT-1001 · BEACON-2024", folder: "v1-js",
    uploadedBy: "Dr. Sarah Chen", uploadedAt: "Mar 10, 2024",
    size: "2.4 MB", version: 2, tags: ["Consent", "Regulatory"],
    description: "Informed consent form version 2 signed by patient PT-1001.",
    versions: [
      { version: 1, uploadedBy: "Dr. Sarah Chen", uploadedAt: "Jan 22, 2024", size: "2.1 MB" },
      { version: 2, uploadedBy: "Dr. Sarah Chen", uploadedAt: "Mar 10, 2024", size: "2.4 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Dr. Sarah Chen", timestamp: "Jan 22, 2024 09:14" },
      { action: "Uploaded v2", user: "Dr. Sarah Chen", timestamp: "Mar 10, 2024 11:32" },
      { action: "Downloaded", user: "CRA Reviewer", timestamp: "Mar 11, 2024 08:05" },
    ],
  },
  {
    id: "DOC-002", name: "Lab_Results_CBC.pdf", docType: "Lab Report",
    relatedEntity: "PT-1001 · BEACON-2024", folder: "v2-js",
    uploadedBy: "Lab Technician", uploadedAt: "Mar 8, 2024",
    size: "1.1 MB", version: 1, tags: ["Lab", "CBC"],
    description: "Complete blood count lab results from Visit 2 baseline.",
    versions: [
      { version: 1, uploadedBy: "Lab Technician", uploadedAt: "Mar 8, 2024", size: "1.1 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Lab Technician", timestamp: "Mar 8, 2024 14:20" },
    ],
  },
  {
    id: "DOC-003", name: "ECG_Report_Baseline.pdf", docType: "Visit Report",
    relatedEntity: "PT-1001 · BEACON-2024", folder: "v2-js",
    uploadedBy: "Cardiology Dept", uploadedAt: "Mar 8, 2024",
    size: "856 KB", version: 1, tags: ["Visit Report", "ECG"],
    description: "12-lead ECG report from baseline visit.",
    versions: [
      { version: 1, uploadedBy: "Cardiology Dept", uploadedAt: "Mar 8, 2024", size: "856 KB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Cardiology Dept", timestamp: "Mar 8, 2024 15:00" },
    ],
  },
  {
    id: "DOC-004", name: "Medical_History_Form.pdf", docType: "Patient Record",
    relatedEntity: "PT-1001 · BEACON-2024", folder: "v1-js",
    uploadedBy: "Dr. Sarah Chen", uploadedAt: "Mar 5, 2024",
    size: "1.8 MB", version: 1, tags: ["Patient Record"],
    description: "Patient medical history and baseline assessment form.",
    versions: [
      { version: 1, uploadedBy: "Dr. Sarah Chen", uploadedAt: "Mar 5, 2024", size: "1.8 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Dr. Sarah Chen", timestamp: "Mar 5, 2024 10:00" },
    ],
  },
  {
    id: "DOC-005", name: "AE_Report_001.pdf", docType: "Visit Report",
    relatedEntity: "PT-1001 · BEACON-2024", folder: "v3-js",
    uploadedBy: "Study Coordinator", uploadedAt: "Mar 12, 2024",
    size: "456 KB", version: 1, tags: ["Visit Report", "Adverse Event"],
    description: "Adverse event report from Follow-Up Visit.",
    versions: [
      { version: 1, uploadedBy: "Study Coordinator", uploadedAt: "Mar 12, 2024", size: "456 KB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Study Coordinator", timestamp: "Mar 12, 2024 09:45" },
    ],
  },
  {
    id: "DOC-006", name: "Protocol_Amendment_v3.pdf", docType: "Protocol",
    relatedEntity: "BEACON-2024 · Pfizer Inc.", folder: "beacon-2024",
    uploadedBy: "Sponsor", uploadedAt: "Feb 28, 2024",
    size: "3.2 MB", version: 3, tags: ["Protocol", "Regulatory"],
    description: "Study protocol amendment version 3 approved by sponsor.",
    versions: [
      { version: 1, uploadedBy: "Sponsor", uploadedAt: "Dec 1, 2023", size: "2.8 MB" },
      { version: 2, uploadedBy: "Sponsor", uploadedAt: "Jan 15, 2024", size: "3.0 MB" },
      { version: 3, uploadedBy: "Sponsor", uploadedAt: "Feb 28, 2024", size: "3.2 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Sponsor", timestamp: "Dec 1, 2023 10:00" },
      { action: "Uploaded v2", user: "Sponsor", timestamp: "Jan 15, 2024 11:00" },
      { action: "Uploaded v3", user: "Sponsor", timestamp: "Feb 28, 2024 14:30" },
      { action: "Downloaded", user: "Dr. Sarah Chen", timestamp: "Mar 1, 2024 09:00" },
    ],
  },
  {
    id: "DOC-007", name: "Regulatory_Approval_FDA.pdf", docType: "Regulatory Document",
    relatedEntity: "BEACON-2024 · Pfizer Inc.", folder: "beacon-2024",
    uploadedBy: "Regulatory Affairs", uploadedAt: "Nov 10, 2023",
    size: "5.6 MB", version: 1, tags: ["Regulatory", "FDA"],
    description: "FDA IND approval letter for BEACON-2024 trial.",
    versions: [
      { version: 1, uploadedBy: "Regulatory Affairs", uploadedAt: "Nov 10, 2023", size: "5.6 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Regulatory Affairs", timestamp: "Nov 10, 2023 08:30" },
    ],
  },
  {
    id: "DOC-008", name: "Consent_Form_Emily.pdf", docType: "Consent Form",
    relatedEntity: "PT-1002 · AURORA-Phase2", folder: "v1-ej",
    uploadedBy: "Study Coordinator", uploadedAt: "Feb 14, 2024",
    size: "2.1 MB", version: 1, tags: ["Consent"],
    description: "Consent form for PT-1002 Emily Johnson.",
    versions: [
      { version: 1, uploadedBy: "Study Coordinator", uploadedAt: "Feb 14, 2024", size: "2.1 MB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Study Coordinator", timestamp: "Feb 14, 2024 13:00" },
    ],
  },
  {
    id: "DOC-009", name: "Lab_Screening_Michael.pdf", docType: "Lab Report",
    relatedEntity: "PT-1003 · BEACON-2024", folder: "v1-mc",
    uploadedBy: "Lab Technician", uploadedAt: "Jan 20, 2024",
    size: "980 KB", version: 1, tags: ["Lab"],
    description: "Screening lab panel for Michael Chen.",
    versions: [
      { version: 1, uploadedBy: "Lab Technician", uploadedAt: "Jan 20, 2024", size: "980 KB" },
    ],
    activityLog: [
      { action: "Uploaded v1", user: "Lab Technician", timestamp: "Jan 20, 2024 11:15" },
    ],
  },
]

const missingAlerts = [
  { patient: "PT-1002 · Emily Johnson", study: "AURORA-Phase2", missing: ["Lab Report"] },
  { patient: "PT-1003 · Michael Chen", study: "BEACON-2024", missing: ["Consent Form (v2)"] },
  { patient: "PT-1004 · Sarah Williams", study: "NOVA-Trial", missing: ["Consent Form", "Lab Report"] },
  { patient: "PT-1005 · David Brown", study: "AURORA-Phase2", missing: ["Medical History"] },
]

const STUDIES = ["BEACON-2024", "AURORA-Phase2", "NOVA-Trial"]
const DOC_TYPES: DocType[] = ["Protocol", "Consent Form", "Lab Report", "Patient Record", "Visit Report", "Regulatory Document", "Other"]
const ALL_TAGS = ["Protocol", "Lab", "Consent", "Visit Report", "Regulatory", "Patient Record", "Adverse Event", "FDA", "CBC", "ECG"]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDocTypeColor(type: DocType) {
  const map: Record<DocType, string> = {
    "Protocol": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Consent Form": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Lab Report": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Patient Record": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Visit Report": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Regulatory Document": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Other": "bg-muted text-muted-foreground",
  }
  return map[type]
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return FileImage
  return FileText
}

// Flatten the folder tree to get all folder IDs and names
function flattenFolderIds(nodes: FolderNode[], acc: string[] = []) {
  for (const n of nodes) {
    acc.push(n.id)
    if (n.children) flattenFolderIds(n.children, acc)
  }
  return acc
}

// Build breadcrumb path for a selected folder id
function buildBreadcrumb(nodes: FolderNode[], targetId: string, path: string[] = []): string[] | null {
  for (const n of nodes) {
    const newPath = [...path, n.name]
    if (n.id === targetId) return newPath
    if (n.children) {
      const found = buildBreadcrumb(n.children, targetId, newPath)
      if (found) return found
    }
  }
  return null
}

// Get all folder IDs under a given node (including itself)
function getFolderSubtree(nodes: FolderNode[], targetId: string): string[] {
  for (const n of nodes) {
    if (n.id === targetId) return flattenFolderIds([n])
    if (n.children) {
      const found = getFolderSubtree(n.children, targetId)
      if (found.length) return found
    }
  }
  return []
}

// ─── FolderItem Component ────────────────────────────────────────────────────

function FolderItem({
  node, level = 0, expandedFolders, toggleFolder, selectedFolder, setSelectedFolder,
}: {
  node: FolderNode; level?: number
  expandedFolders: Set<string>; toggleFolder: (id: string) => void
  selectedFolder: string | null; setSelectedFolder: (id: string) => void
}) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolder === node.id
  const hasChildren = (node.children?.length ?? 0) > 0

  const typeColors: Record<FolderNode["type"], string> = {
    sponsor: "text-violet-500", study: "text-blue-500",
    patient: "text-emerald-500", visit: "text-orange-400",
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm",
          isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
        )}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
        onClick={() => { setSelectedFolder(node.id); if (hasChildren) toggleFolder(node.id) }}
      >
        {hasChildren ? (
          <ChevronRight className={cn("size-3.5 shrink-0 transition-transform text-muted-foreground", isExpanded && "rotate-90")} />
        ) : (
          <span className="size-3.5" />
        )}
        {isExpanded && hasChildren
          ? <FolderOpen className="size-4 shrink-0 text-primary" />
          : <node.icon className={cn("size-4 shrink-0", isSelected ? "text-primary" : typeColors[node.type])} />
        }
        <span className="truncate">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FolderItem key={child.id} node={child} level={level + 1}
              expandedFolders={expandedFolders} toggleFolder={toggleFolder}
              selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Upload Modal ────────────────────────────────────────────────────────────

function UploadModal({
  open, onClose, onUpload, currentRole,
}: {
  open: boolean; onClose: () => void
  onUpload: (doc: Document) => void; currentRole: Role
}) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const [form, setForm] = useState({
    name: "", docType: "" as DocType | "", sponsor: "", study: "", patient: "", visit: "",
    description: "", tags: "", version: "1",
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const ALLOWED = ["pdf", "docx", "doc", "jpg", "jpeg", "png"]
  const MAX_MB = 10

  const validateFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase() || ""
    if (!ALLOWED.includes(ext)) { setFileError("Unsupported format. Use PDF, DOCX, JPG, PNG."); return false }
    if (f.size > MAX_MB * 1024 * 1024) { setFileError(`File too large. Max ${MAX_MB} MB.`); return false }
    setFileError(""); return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && validateFile(dropped)) { setFile(dropped); setForm(p => ({ ...p, name: p.name || dropped.name })) }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f && validateFile(f)) { setFile(f); setForm(p => ({ ...p, name: p.name || f.name })) }
  }

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Document name is required"); return }
    if (!form.docType) { toast.error("Document type is required"); return }
    if (!form.sponsor && !form.study && !form.patient && !form.visit) {
      toast.error("Select at least one association"); return
    }
    const entity = [form.patient, form.study, form.sponsor].filter(Boolean).join(" · ")
    const vNum = parseInt(form.version) || 1
    const newDoc: Document = {
      id: `DOC-${String(Math.floor(Math.random() * 900 + 100))}`,
      name: form.name, docType: form.docType as DocType,
      relatedEntity: entity || "General",
      folder: form.visit || form.patient || form.study || form.sponsor || "pfizer",
      uploadedBy: currentRole === "Admin" ? "Dr. Sarah Chen" : currentRole,
      uploadedAt: "Mar 11, 2024",
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "—",
      version: vNum,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      description: form.description,
      versions: [{ version: vNum, uploadedBy: "Dr. Sarah Chen", uploadedAt: "Mar 11, 2024", size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "—" }],
      activityLog: [{ action: `Uploaded v${vNum}`, user: "Dr. Sarah Chen", timestamp: "Mar 11, 2024 10:45" }],
    }
    onUpload(newDoc)
    toast.success("Document uploaded successfully")
    setForm({ name: "", docType: "", sponsor: "", study: "", patient: "", visit: "", description: "", tags: "", version: "1" })
    setFile(null); onClose()
  }

  const f = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Add a document to the clinical trial repository.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* File Drop Zone */}
          <div
            className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50")}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" onChange={handleFileInput} />
            <Upload className="size-8 text-muted-foreground mb-2" />
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium text-primary">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">Drop file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPG, PNG · max 10 MB</p>
              </div>
            )}
          </div>
          {fileError && <p className="text-xs text-destructive -mt-3">{fileError}</p>}

          {/* Document Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b">Document Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Document Name *</label>
                <Input placeholder="e.g. Informed_Consent_v2.pdf" value={form.name} onChange={e => f("name", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Document Type *</label>
                <Select value={form.docType} onValueChange={v => f("docType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Version Number</label>
                <Input type="number" min="1" value={form.version} onChange={e => f("version", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Association */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b">Document Association</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Sponsor</label>
                <Select value={form.sponsor} onValueChange={v => f("sponsor", v)}>
                  <SelectTrigger><SelectValue placeholder="Select sponsor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pfizer Inc.">Pfizer Inc.</SelectItem>
                    <SelectItem value="Novartis AG">Novartis AG</SelectItem>
                    <SelectItem value="Johnson & Johnson">Johnson & Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Study</label>
                <Select value={form.study} onValueChange={v => f("study", v)}>
                  <SelectTrigger><SelectValue placeholder="Select study" /></SelectTrigger>
                  <SelectContent>
                    {STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Patient</label>
                <Input placeholder="e.g. PT-1001" value={form.patient} onChange={e => f("patient", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Visit</label>
                <Input placeholder="e.g. Visit 2 – Baseline" value={form.visit} onChange={e => f("visit", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Additional */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b">Additional Metadata</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Brief description of this document..." value={form.description} onChange={e => f("description", e.target.value)} className="resize-none h-20" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
                <Input placeholder="e.g. Protocol, Lab, Consent" value={form.tags} onChange={e => f("tags", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}><Upload className="mr-2 size-4" />Upload Document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Preview Sheet ───────────────────────────────────────────────────────────

function PreviewSheet({ doc, open, onClose }: { doc: Document | null; open: boolean; onClose: () => void }) {
  if (!doc) return null
  const FileIcon = getFileIcon(doc.name)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">Document Preview</SheetTitle>
        </SheetHeader>

        {/* Preview area */}
        <div className="flex items-center justify-center rounded-lg bg-muted/50 border h-48 mb-4">
          <div className="text-center text-muted-foreground">
            <FileIcon className="size-12 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm font-medium">{doc.name}</p>
            <p className="text-xs mt-1">Preview not available in demo mode</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Details</h4>
            <div className="space-y-2 text-sm">
              {[
                ["Name", doc.name],
                ["Type", doc.docType],
                ["Related To", doc.relatedEntity],
                ["Uploaded By", doc.uploadedBy],
                ["Upload Date", doc.uploadedAt],
                ["File Size", doc.size],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {doc.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </div>
          )}

          {doc.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map(t => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Version history */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Version History</h4>
            <div className="space-y-2">
              {[...doc.versions].reverse().map(v => (
                <div key={v.version} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                  <div>
                    <span className={cn("text-xs font-semibold", v.version === doc.version ? "text-primary" : "text-muted-foreground")}>
                      v{v.version}{v.version === doc.version ? " (current)" : ""}
                    </span>
                    <p className="text-xs text-muted-foreground">{v.uploadedBy} · {v.uploadedAt} · {v.size}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-7">
                    <Download className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Activity Log */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Activity Log</h4>
            <div className="space-y-2">
              {doc.activityLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Clock className="size-3 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-medium">{entry.action}</span>
                    <span className="text-muted-foreground"> by {entry.user}</span>
                    <p className="text-muted-foreground">{entry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["pfizer", "beacon-2024", "pt-1001"])
  )
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set())
  const [currentRole, setCurrentRole] = useState<Role>("Admin")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ study: "all", docType: "all", uploadedBy: "" })

  const canUpload = currentRole !== "Doctor"
  const canDelete = currentRole === "Admin"
  const canEdit = currentRole === "Admin" || currentRole === "Coordinator"

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  // Filter documents by selected folder (subtree) + search + filters
  const visibleDocs = documents.filter(doc => {
    if (selectedFolder) {
      const subtree = getFolderSubtree(folderTree, selectedFolder)
      if (!subtree.includes(doc.folder)) return false
    }
    const q = searchQuery.toLowerCase()
    if (q && !doc.name.toLowerCase().includes(q) && !doc.relatedEntity.toLowerCase().includes(q)
      && !doc.docType.toLowerCase().includes(q) && !doc.uploadedBy.toLowerCase().includes(q)) return false
    if (filters.study !== "all" && !doc.relatedEntity.includes(filters.study)) return false
    if (filters.docType !== "all" && doc.docType !== filters.docType) return false
    if (filters.uploadedBy && !doc.uploadedBy.toLowerCase().includes(filters.uploadedBy.toLowerCase())) return false
    return true
  })

  const breadcrumb = selectedFolder ? buildBreadcrumb(folderTree, selectedFolder) : null

  const toggleSelectDoc = (id: string) => {
    setSelectedDocs(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }
  const selectAll = () => setSelectedDocs(new Set(visibleDocs.map(d => d.id)))
  const clearAll = () => setSelectedDocs(new Set())
  const allSelected = visibleDocs.length > 0 && visibleDocs.every(d => selectedDocs.has(d.id))

  const handleBulkDelete = () => {
    setDocuments(prev => prev.filter(d => !selectedDocs.has(d.id)))
    toast.success(`${selectedDocs.size} document(s) deleted`)
    clearAll()
  }

  const handleBulkDownload = () => {
    toast.success(`Downloading ${selectedDocs.size} document(s)`)
    clearAll()
  }

  const handleDelete = (doc: Document) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id))
    toast.success("Document deleted")
  }

  // Storage stats
  const totalStorageGB = 10
  const usedStorageMB = documents.reduce((acc, d) => {
    const n = parseFloat(d.size)
    const unit = d.size.toLowerCase().includes("mb") ? 1 : d.size.toLowerCase().includes("kb") ? 0.001 : 1000
    return acc + (isNaN(n) ? 0 : n * unit)
  }, 0)
  const usedStorageGB = usedStorageMB / 1024
  const storagePercent = Math.min((usedStorageGB / totalStorageGB) * 100, 100)

  const activeAlerts = missingAlerts.filter((_, i) => !dismissedAlerts.has(i))

  return (
    <>
      <DashboardHeader title="Documents" description="Manage clinical trial documents and records" />
      <div className="flex-1 overflow-hidden p-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Total Documents", value: documents.length, icon: FileText, color: "text-blue-500" },
            { label: "Sponsors", value: folderTree.length, icon: Building2, color: "text-violet-500" },
            { label: "Studies", value: folderTree.flatMap(s => s.children || []).length, icon: Stethoscope, color: "text-emerald-500" },
            { label: "Storage Used", value: `${usedStorageGB.toFixed(1)} GB`, icon: HardDrive, color: "text-orange-500" },
          ].map(s => (
            <Card key={s.label} className="shadow-sm">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted", s.color)}>
                  <s.icon className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold leading-tight">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Storage bar */}
        <Card className="shadow-sm mb-4">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HardDrive className="size-4 text-muted-foreground" />
                Storage Usage
              </div>
              <span className="text-sm text-muted-foreground">
                {usedStorageGB.toFixed(1)} GB / {totalStorageGB} GB used
              </span>
            </div>
            <Progress value={storagePercent} className="h-2" />
          </CardContent>
        </Card>

        {/* Missing document alerts */}
        {activeAlerts.length > 0 && (
          <Card className="shadow-sm mb-4 border-warning/30 bg-warning/5">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="size-4 text-warning" />
                Missing Documents Alert
                <Badge className="bg-warning/20 text-warning border-0 text-xs">{activeAlerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 space-y-2">
              {missingAlerts.map((alert, i) => !dismissedAlerts.has(i) && (
                <div key={i} className="flex items-start justify-between gap-3 bg-background/60 rounded-md px-3 py-2">
                  <div className="text-xs">
                    <span className="font-semibold">{alert.patient}</span>
                    <span className="text-muted-foreground"> ({alert.study}) is missing: </span>
                    {alert.missing.map(m => (
                      <Badge key={m} variant="outline" className="text-[10px] mx-0.5 border-destructive/40 text-destructive">{m}</Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="size-6 shrink-0"
                    onClick={() => setDismissedAlerts(prev => new Set([...prev, i]))}>
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid h-[calc(100vh-430px)] gap-4 lg:grid-cols-4">
          {/* Left – Folder Panel */}
          <Card className="shadow-sm lg:col-span-1 flex flex-col">
            <CardHeader className="pb-2 pt-3 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Folder Structure</CardTitle>
                <Button variant="ghost" size="icon" className="size-6"
                  onClick={() => setSelectedFolder(null)}
                  title="Show all documents">
                  <Folder className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-0.5">
                  {folderTree.map(node => (
                    <FolderItem key={node.id} node={node}
                      expandedFolders={expandedFolders} toggleFolder={toggleFolder}
                      selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right – Document Table */}
          <div className="lg:col-span-3 space-y-3 flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {breadcrumb ? breadcrumb.map((seg, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3" />}
                    <span className={cn(i === breadcrumb.length - 1 && "text-foreground font-medium")}>{seg}</span>
                  </span>
                )) : (
                  <span className="flex items-center gap-1.5">
                    <Folder className="size-3.5" /><span className="text-foreground font-medium">All Documents</span>
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search documents..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)} className="w-52 pl-8 h-9" />
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(f => !f)}>
                  <Filter className="mr-1.5 size-3.5" />Filters
                  {(filters.study !== "all" || filters.docType !== "all" || filters.uploadedBy) && (
                    <Badge className="ml-1.5 bg-primary/20 text-primary border-0 text-[10px] px-1">!</Badge>
                  )}
                </Button>
                {/* Role selector */}
                <Select value={currentRole} onValueChange={v => setCurrentRole(v as Role)}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <Shield className="size-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Admin", "Coordinator", "Doctor", "CRA"] as Role[]).map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {canUpload && (
                  <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                    <Upload className="mr-1.5 size-3.5" />Upload
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Bar */}
            {showFilters && (
              <Card className="shadow-sm">
                <CardContent className="py-3 px-4">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Study</label>
                      <Select value={filters.study} onValueChange={v => setFilters(p => ({ ...p, study: v }))}>
                        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Studies</SelectItem>
                          {STUDIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Doc Type</label>
                      <Select value={filters.docType} onValueChange={v => setFilters(p => ({ ...p, docType: v }))}>
                        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Uploaded By</label>
                      <Input className="h-8 w-40 text-xs" placeholder="Filter by uploader"
                        value={filters.uploadedBy} onChange={e => setFilters(p => ({ ...p, uploadedBy: e.target.value }))} />
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs"
                      onClick={() => setFilters({ study: "all", docType: "all", uploadedBy: "" })}>
                      <X className="size-3 mr-1" />Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bulk action bar */}
            {selectedDocs.size > 0 && (
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
                <Badge className="bg-primary text-primary-foreground">{selectedDocs.size} selected</Badge>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleBulkDownload}>
                  <Download className="size-3 mr-1" />Download
                </Button>
                {canDelete && (
                  <Button variant="outline" size="sm" className="h-7 text-xs text-destructive border-destructive/40" onClick={handleBulkDelete}>
                    <Trash2 className="size-3 mr-1" />Delete
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={clearAll}>
                  <X className="size-3 mr-1" />Clear
                </Button>
              </div>
            )}

            {/* Table */}
            <Card className="shadow-sm flex-1 overflow-hidden">
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0">
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox checked={allSelected} onCheckedChange={v => v ? selectAll() : clearAll()} />
                        </TableHead>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Related Entity</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleDocs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                            <File className="size-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No documents found</p>
                          </TableCell>
                        </TableRow>
                      ) : visibleDocs.map(doc => {
                        const FileIcon = getFileIcon(doc.name)
                        return (
                          <TableRow key={doc.id} className={cn("hover:bg-muted/40", selectedDocs.has(doc.id) && "bg-primary/5")}>
                            <TableCell>
                              <Checkbox checked={selectedDocs.has(doc.id)} onCheckedChange={() => toggleSelectDoc(doc.id)} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                                  <FileIcon className="size-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm leading-tight">{doc.name}</p>
                                  {doc.tags.length > 0 && (
                                    <div className="flex gap-1 mt-0.5 flex-wrap">
                                      {doc.tags.slice(0, 3).map(t => (
                                        <Badge key={t} variant="secondary" className="text-[10px] px-1 py-0">{t}</Badge>
                                      ))}
                                      {doc.tags.length > 3 && (
                                        <Badge variant="secondary" className="text-[10px] px-1 py-0">+{doc.tags.length - 3}</Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={cn("text-xs border-0", getDocTypeColor(doc.docType))}>{doc.docType}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{doc.relatedEntity}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{doc.uploadedBy}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{doc.uploadedAt}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{doc.size}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setPreviewDoc(doc)}>
                                    <Eye className="mr-2 size-4" />Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.success("Downloading…")}>
                                    <Download className="mr-2 size-4" />Download
                                  </DropdownMenuItem>
                                  {canEdit && (
                                    <DropdownMenuItem onClick={() => toast.info("Edit metadata coming soon")}>
                                      <Edit2 className="mr-2 size-4" />Edit Metadata
                                    </DropdownMenuItem>
                                  )}
                                  {canDelete && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc)}>
                                        <Trash2 className="mr-2 size-4" />Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <UploadModal
        open={isUploadOpen} onClose={() => setIsUploadOpen(false)}
        onUpload={doc => setDocuments(prev => [doc, ...prev])}
        currentRole={currentRole}
      />
      <PreviewSheet doc={previewDoc} open={!!previewDoc} onClose={() => setPreviewDoc(null)} />
    </>
  )
}
