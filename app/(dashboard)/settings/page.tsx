"use client"

import { Building2, Bell, Lock, User } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" description="Manage your account and preferences" />
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization">
              <Building2 className="mr-2 size-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 size-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 size-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-20">
                    <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>
                <Separator />
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>First Name</FieldLabel>
                      <Input defaultValue="Sarah" />
                    </Field>
                    <Field>
                      <FieldLabel>Last Name</FieldLabel>
                      <Input defaultValue="Chen" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input defaultValue="sarah.chen@hospital.org" type="email" />
                  </Field>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input defaultValue="Principal Investigator" />
                  </Field>
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Select defaultValue="research">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input defaultValue="+1 (555) 123-4567" type="tel" />
                  </Field>
                </FieldGroup>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Organization Settings</CardTitle>
                <CardDescription>Configure your organization details</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Organization Name</FieldLabel>
                    <Input defaultValue="City General Hospital Research Center" />
                  </Field>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input defaultValue="123 Medical Center Drive" />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field>
                      <FieldLabel>City</FieldLabel>
                      <Input defaultValue="Boston" />
                    </Field>
                    <Field>
                      <FieldLabel>State</FieldLabel>
                      <Input defaultValue="Massachusetts" />
                    </Field>
                    <Field>
                      <FieldLabel>ZIP Code</FieldLabel>
                      <Input defaultValue="02115" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Timezone</FieldLabel>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <div className="flex justify-end mt-6">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Visit Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Visit Reminders</p>
                        <p className="text-xs text-muted-foreground">
                          Get notified about upcoming patient visits
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Visit Confirmations</p>
                        <p className="text-xs text-muted-foreground">
                          Notifications when visits are confirmed or rescheduled
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Missed Visits</p>
                        <p className="text-xs text-muted-foreground">
                          Alert when a patient misses a scheduled visit
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Study Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">New Enrollments</p>
                        <p className="text-xs text-muted-foreground">
                          Notifications for new patient enrollments
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Protocol Updates</p>
                        <p className="text-xs text-muted-foreground">
                          Get notified when study protocols are updated
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Adverse Events</p>
                        <p className="text-xs text-muted-foreground">
                          Critical alerts for reported adverse events
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Email Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Daily Digest</p>
                        <p className="text-xs text-muted-foreground">
                          Receive a daily summary of activities
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Weekly Reports</p>
                        <p className="text-xs text-muted-foreground">
                          Weekly summary of study progress
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Current Password</FieldLabel>
                      <Input type="password" placeholder="Enter current password" />
                    </Field>
                    <Field>
                      <FieldLabel>New Password</FieldLabel>
                      <Input type="password" placeholder="Enter new password" />
                    </Field>
                    <Field>
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <Input type="password" placeholder="Confirm new password" />
                    </Field>
                  </FieldGroup>
                  <div className="flex justify-end mt-6">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enable 2FA</p>
                      <p className="text-xs text-muted-foreground">
                        Require a verification code when signing in
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Sessions</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">
                          Chrome on macOS • Boston, MA • Active now
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Current
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">Mobile App</p>
                        <p className="text-xs text-muted-foreground">
                          iOS App • Boston, MA • Last active 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
