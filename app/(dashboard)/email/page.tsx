"use client"

import { useState } from "react"
import { Mail, Send, Sparkles, FileText, Clock, Check, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const emailHistory = [
  {
    id: "EM-001",
    subject: "Visit Reschedule Notice - PT-1004",
    recipient: "Dr. James Wilson (Pfizer)",
    sentAt: "Mar 12, 2024 10:30 AM",
    status: "delivered",
    type: "Visit Update",
  },
  {
    id: "EM-002",
    subject: "Weekly Enrollment Report - BEACON-2024",
    recipient: "Clinical Team",
    sentAt: "Mar 11, 2024 09:00 AM",
    status: "delivered",
    type: "Report",
  },
  {
    id: "EM-003",
    subject: "Patient Withdrawal Notification - PT-1008",
    recipient: "Dr. Maria Garcia (Novartis)",
    sentAt: "Mar 10, 2024 03:15 PM",
    status: "delivered",
    type: "Patient Update",
  },
  {
    id: "EM-004",
    subject: "Adverse Event Report - AURORA-Phase2",
    recipient: "Safety Committee",
    sentAt: "Mar 10, 2024 11:45 AM",
    status: "delivered",
    type: "Safety",
  },
  {
    id: "EM-005",
    subject: "Visit Reminder - PT-1001 Visit 4",
    recipient: "john.smith@email.com",
    sentAt: "Mar 9, 2024 02:00 PM",
    status: "opened",
    type: "Reminder",
  },
]

const emailTemplates = [
  { id: "1", name: "Visit Reschedule Notice", description: "Notify CRA about rescheduled visits" },
  { id: "2", name: "Patient Enrollment Confirmation", description: "Confirm new patient enrollment" },
  { id: "3", name: "Adverse Event Report", description: "Report adverse events to sponsor" },
  { id: "4", name: "Weekly Status Update", description: "Regular study progress update" },
  { id: "5", name: "Visit Reminder", description: "Remind patients of upcoming visits" },
]

export default function EmailPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedVisit, setSelectedVisit] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState({
    subject: "",
    body: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateEmail = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedEmail({
        subject: "Visit Reschedule Notice - PT-1004 (NOVA-Trial)",
        body: `Dear Dr. Wilson,

I am writing to inform you of a visit reschedule for patient PT-1004 (Sarah Williams) enrolled in the NOVA-Trial study.

Visit Details:
- Original Visit: Visit 2 - Assessment
- Original Date: March 13, 2024 at 09:30 AM
- New Date: March 18, 2024 at 10:00 AM
- Reason: Patient requested reschedule due to work conflict

The patient has been contacted and has confirmed the new appointment. All required procedures for this visit remain unchanged:
- MRI Scan
- Blood Work
- Quality of Life Survey

Please let me know if you have any questions or concerns regarding this change.

Best regards,
Dr. Sarah Chen
Principal Investigator
Clinical Trial Management System`,
      })
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <>
      <DashboardHeader title="Email Center" description="AI-powered email generation and history" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Tabs defaultValue="compose">
          <TabsList>
            <TabsTrigger value="compose">
              <Sparkles className="mr-2 size-4" />
              AI Compose
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 size-4" />
              Email History
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="mr-2 size-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    AI Email Generator
                  </CardTitle>
                  <CardDescription>
                    Select a patient and visit to generate a professional email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Select Patient</FieldLabel>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-1001">PT-1001 - John Smith (BEACON-2024)</SelectItem>
                          <SelectItem value="pt-1002">PT-1002 - Emily Johnson (AURORA-Phase2)</SelectItem>
                          <SelectItem value="pt-1003">PT-1003 - Michael Chen (BEACON-2024)</SelectItem>
                          <SelectItem value="pt-1004">PT-1004 - Sarah Williams (NOVA-Trial)</SelectItem>
                          <SelectItem value="pt-1005">PT-1005 - David Brown (AURORA-Phase2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Select Visit</FieldLabel>
                      <Select value={selectedVisit} onValueChange={setSelectedVisit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a visit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">Visit 1 - Screening</SelectItem>
                          <SelectItem value="v2">Visit 2 - Assessment</SelectItem>
                          <SelectItem value="v3">Visit 3 - Treatment</SelectItem>
                          <SelectItem value="v4">Visit 4 - Follow Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Email Type</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select email type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reschedule">Visit Reschedule Notice</SelectItem>
                          <SelectItem value="reminder">Visit Reminder</SelectItem>
                          <SelectItem value="completion">Visit Completion Report</SelectItem>
                          <SelectItem value="ae">Adverse Event Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button
                      className="w-full mt-2"
                      onClick={handleGenerateEmail}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-4" />
                          Generate Email with AI
                        </>
                      )}
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Email Preview</CardTitle>
                  <CardDescription>Review and edit before sending</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>To</FieldLabel>
                      <Input placeholder="Recipient email" value="james.wilson@pfizer.com" readOnly />
                    </Field>
                    <Field>
                      <FieldLabel>Subject</FieldLabel>
                      <Input
                        placeholder="Email subject will appear here"
                        value={generatedEmail.subject}
                        onChange={(e) =>
                          setGeneratedEmail({ ...generatedEmail, subject: e.target.value })
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Body</FieldLabel>
                      <Textarea
                        placeholder="AI-generated email content will appear here..."
                        rows={12}
                        value={generatedEmail.body}
                        onChange={(e) =>
                          setGeneratedEmail({ ...generatedEmail, body: e.target.value })
                        }
                      />
                    </Field>
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" disabled={!generatedEmail.body}>
                        <Send className="mr-2 size-4" />
                        Send Email
                      </Button>
                      <Button variant="outline">Save as Template</Button>
                    </div>
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Email History</CardTitle>
                  <CardDescription>Recent emails sent from the system</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailHistory.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                              <Mail className="size-4 text-primary" />
                            </div>
                            <span className="font-medium">{email.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{email.recipient}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{email.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{email.sentAt}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              email.status === "opened"
                                ? "bg-success/10 text-success border-0"
                                : "bg-primary/10 text-primary border-0"
                            }
                          >
                            <Check className="mr-1 size-3" />
                            {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="size-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
