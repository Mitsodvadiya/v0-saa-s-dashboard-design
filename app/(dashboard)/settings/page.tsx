"use client"

import { useState } from "react"
import { Building2, Bell, Lock, User, Upload, Save } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

// ── Notification Row ──────────────────────────────────────────────────────────
function NotifRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  // Profile
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@hospital.org",
    phone: "+1 (555) 123-4567",
    title: "Principal Investigator",
    department: "research",
  })

  // Organization
  const [org, setOrg] = useState({
    name: "City General Hospital Research Center",
    address: "123 Medical Center Drive",
    city: "Boston",
    state: "Massachusetts",
    zip: "02115",
    phone: "+1 (617) 555-0100",
    email: "research@citygeneral.org",
    timezone: "est",
  })

  // Security
  const [security, setSecurity] = useState({
    twoFactor: false,
    passwordStrength: "strong",
    sessionTimeout: "30",
    loginAttempts: "5",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notifications
  const [notifs, setNotifs] = useState({
    visitReminders: true,
    visitConfirmations: true,
    missedVisits: true,
    newEnrollments: true,
    protocolUpdates: true,
    adverseEvents: true,
    documentAlerts: true,
    emailNotifications: true,
    systemNotifications: true,
    dailyDigest: false,
    weeklyReports: true,
  })

  const setNotif = (key: keyof typeof notifs) => (v: boolean) =>
    setNotifs((p) => ({ ...p, [key]: v }))

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully")
  }

  const handleSaveOrg = () => {
    toast.success("Organization settings saved")
  }

  const handleChangePassword = () => {
    if (!security.currentPassword) { toast.error("Current password is required"); return }
    if (!security.newPassword) { toast.error("New password is required"); return }
    if (security.newPassword !== security.confirmPassword) { toast.error("Passwords do not match"); return }
    if (security.newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return }
    setSecurity((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }))
    toast.success("Password changed successfully")
  }

  const handleSaveSecurity = () => {
    toast.success("Security settings saved")
  }

  const handleSaveNotifs = () => {
    toast.success("Notification preferences saved")
  }

  return (
    <>
      <DashboardHeader title="Settings" description="Manage your account, organization, and preferences" />
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile"><User className="mr-2 size-4" />Profile</TabsTrigger>
            <TabsTrigger value="organization"><Building2 className="mr-2 size-4" />Organization</TabsTrigger>
            <TabsTrigger value="security"><Lock className="mr-2 size-4" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 size-4" />Notifications</TabsTrigger>
          </TabsList>

          {/* ── Profile ───────────────────────────────────────────────────── */}
          <TabsContent value="profile">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-20">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 size-3.5" />Change Photo
                    </Button>
                    <p className="mt-1.5 text-xs text-muted-foreground">JPG, GIF or PNG · Max 2 MB</p>
                  </div>
                </div>
                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input className="mt-1" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input className="mt-1" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input className="mt-1" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input className="mt-1" type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Title / Position</label>
                  <Input className="mt-1" value={profile.title} onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Select value={profile.department} onValueChange={(v) => setProfile((p) => ({ ...p, department: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research">Clinical Research</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="data">Data Management</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}><Save className="mr-2 size-4" />Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Organization ──────────────────────────────────────────────── */}
          <TabsContent value="organization">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Organization Settings</CardTitle>
                <CardDescription>Configure your hospital or research center details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="flex size-20 items-center justify-center rounded-xl border-2 border-dashed bg-muted text-muted-foreground text-xs text-center p-2">
                    Logo
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 size-3.5" />Upload Logo
                    </Button>
                    <p className="mt-1.5 text-xs text-muted-foreground">PNG or SVG · Max 1 MB · Recommended 200×200px</p>
                  </div>
                </div>
                <Separator />

                <div>
                  <label className="text-sm font-medium">Organization / Hospital Name</label>
                  <Input className="mt-1" value={org.name} onChange={(e) => setOrg((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input className="mt-1" value={org.address} onChange={(e) => setOrg((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input className="mt-1" value={org.city} onChange={(e) => setOrg((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Input className="mt-1" value={org.state} onChange={(e) => setOrg((p) => ({ ...p, state: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">ZIP Code</label>
                    <Input className="mt-1" value={org.zip} onChange={(e) => setOrg((p) => ({ ...p, zip: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Contact Phone</label>
                    <Input className="mt-1" type="tel" value={org.phone} onChange={(e) => setOrg((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input className="mt-1" type="email" value={org.email} onChange={(e) => setOrg((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <Select value={org.timezone} onValueChange={(v) => setOrg((p) => ({ ...p, timezone: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveOrg}><Save className="mr-2 size-4" />Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Security ──────────────────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Current Password</label>
                    <Input className="mt-1" type="password" placeholder="Enter current password" value={security.currentPassword} onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input className="mt-1" type="password" placeholder="Enter new password" value={security.newPassword} onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input className="mt-1" type="password" placeholder="Confirm new password" value={security.confirmPassword} onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword}>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Policy */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Security Policy</CardTitle>
                  <CardDescription>Configure system-wide security settings (Admin only)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* 2FA */}
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium text-sm">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-muted-foreground">Require a verification code when signing in</p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(v) => setSecurity((p) => ({ ...p, twoFactor: v }))}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Password Strength</label>
                      <Select value={security.passwordStrength} onValueChange={(v) => setSecurity((p) => ({ ...p, passwordStrength: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (6+ chars)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, mixed)</SelectItem>
                          <SelectItem value="strong">Strong (10+ chars, symbol)</SelectItem>
                          <SelectItem value="very_strong">Very Strong (12+ chars, all)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Session Timeout</label>
                      <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Login Attempts</label>
                      <Select value={security.loginAttempts} onValueChange={(v) => setSecurity((p) => ({ ...p, loginAttempts: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSecurity}><Save className="mr-2 size-4" />Save Security Settings</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sessions */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
                  <CardDescription>Manage your active login sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on Linux · 192.168.1.100 · Active now</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>Current</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Mobile App</p>
                      <p className="text-xs text-muted-foreground">iOS App · 192.168.1.102 · Last active 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.success("Session revoked")}>Revoke</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Notifications ─────────────────────────────────────────────── */}
          <TabsContent value="notifications">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
                <CardDescription>Configure which alerts and notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2 pb-1">Channels</h4>
                  <NotifRow label="Email Notifications" description="Receive alerts and reports via email" checked={notifs.emailNotifications} onChange={setNotif("emailNotifications")} />
                  <NotifRow label="System Notifications" description="In-app notifications and alerts" checked={notifs.systemNotifications} onChange={setNotif("systemNotifications")} />
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-1">Visit Notifications</h4>
                  <NotifRow label="Visit Reminders" description="Get notified about upcoming patient visits" checked={notifs.visitReminders} onChange={setNotif("visitReminders")} />
                  <NotifRow label="Visit Confirmations" description="Notifications when visits are confirmed or rescheduled" checked={notifs.visitConfirmations} onChange={setNotif("visitConfirmations")} />
                  <NotifRow label="Missed Visits" description="Alert when a patient misses a scheduled visit" checked={notifs.missedVisits} onChange={setNotif("missedVisits")} />
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-1">Study Notifications</h4>
                  <NotifRow label="New Enrollments" description="Notifications for new patient enrollments" checked={notifs.newEnrollments} onChange={setNotif("newEnrollments")} />
                  <NotifRow label="Protocol Updates" description="Get notified when study protocols are updated" checked={notifs.protocolUpdates} onChange={setNotif("protocolUpdates")} />
                  <NotifRow label="Adverse Events" description="Critical alerts for reported adverse events" checked={notifs.adverseEvents} onChange={setNotif("adverseEvents")} />
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-1">Document Alerts</h4>
                  <NotifRow label="Missing Document Alerts" description="Notify when required documents are missing for patients" checked={notifs.documentAlerts} onChange={setNotif("documentAlerts")} />
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-3 pb-1">Email Reports</h4>
                  <NotifRow label="Daily Digest" description="Receive a daily summary of all activities" checked={notifs.dailyDigest} onChange={setNotif("dailyDigest")} />
                  <NotifRow label="Weekly Reports" description="Weekly summary of study progress and metrics" checked={notifs.weeklyReports} onChange={setNotif("weeklyReports")} />
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveNotifs}><Save className="mr-2 size-4" />Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
