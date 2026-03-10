"use client"

import { useState } from "react"
import { Bell, Calendar, Check, CheckCheck, FileText, Trash2, User, AlertTriangle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: "1",
    type: "visit",
    title: "Visit Reminder",
    message: "PT-1001 has a scheduled visit tomorrow at 09:00 AM",
    time: "5 minutes ago",
    read: false,
    icon: Calendar,
  },
  {
    id: "2",
    type: "patient",
    title: "New Patient Enrolled",
    message: "Lisa Anderson (PT-1006) has been enrolled in MERIDIAN-2024",
    time: "1 hour ago",
    read: false,
    icon: User,
  },
  {
    id: "3",
    type: "visit",
    title: "Visit Missed",
    message: "PT-1008 missed their scheduled visit for BEACON-2024",
    time: "2 hours ago",
    read: false,
    icon: AlertTriangle,
  },
  {
    id: "4",
    type: "document",
    title: "Document Uploaded",
    message: "Lab results uploaded for PT-1003 Visit 2",
    time: "3 hours ago",
    read: true,
    icon: FileText,
  },
  {
    id: "5",
    type: "visit",
    title: "Visit Confirmed",
    message: "PT-1001 confirmed Visit 4 for March 15, 2024",
    time: "5 hours ago",
    read: true,
    icon: Check,
  },
  {
    id: "6",
    type: "patient",
    title: "Patient Withdrawal",
    message: "Jennifer Taylor (PT-1008) has withdrawn from BEACON-2024",
    time: "1 day ago",
    read: true,
    icon: User,
  },
  {
    id: "7",
    type: "document",
    title: "Protocol Updated",
    message: "BEACON-2024 protocol has been updated to version 3.0",
    time: "2 days ago",
    read: true,
    icon: FileText,
  },
]

const typeColors = {
  visit: "bg-primary/10 text-primary",
  patient: "bg-success/10 text-success",
  document: "bg-warning/10 text-warning",
}

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [notificationsList, setNotificationsList] = useState(notifications)

  const filteredNotifications = notificationsList.filter((n) => {
    if (selectedTab === "all") return true
    if (selectedTab === "unread") return !n.read
    return n.type === selectedTab
  })

  const unreadCount = notificationsList.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <>
      <DashboardHeader title="Notifications" description="View system notifications and alerts" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 size-4" />
            Mark all as read
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 size-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="visit">Visits</TabsTrigger>
            <TabsTrigger value="patient">Patients</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <Card className="shadow-sm">
              <CardContent className="p-0 divide-y">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto size-10 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full",
                          typeColors[notification.type as keyof typeof typeColors]
                        )}
                      >
                        <notification.icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
