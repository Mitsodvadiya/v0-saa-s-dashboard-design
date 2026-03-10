"use client"

import { useState } from "react"
import { Hash, Plus, Search, Send, Smile, Paperclip, Users, Circle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const channels = [
  { id: "general", name: "General", unread: 3 },
  { id: "beacon-2024", name: "BEACON-2024", unread: 0 },
  { id: "aurora-phase2", name: "AURORA-Phase2", unread: 1 },
  { id: "announcements", name: "Announcements", unread: 0 },
]

const directMessages = [
  { id: "1", name: "Dr. James Wilson", initials: "JW", online: true, unread: 2 },
  { id: "2", name: "Emily Roberts", initials: "ER", online: true, unread: 0 },
  { id: "3", name: "Dr. Michael Park", initials: "MP", online: false, unread: 0 },
  { id: "4", name: "Lisa Thompson", initials: "LT", online: true, unread: 0 },
]

const messages = [
  {
    id: "1",
    user: { name: "Dr. James Wilson", initials: "JW" },
    content: "Good morning team! Just wanted to share that PT-1001 confirmed their visit for tomorrow.",
    time: "9:15 AM",
    isOwn: false,
  },
  {
    id: "2",
    user: { name: "Emily Roberts", initials: "ER" },
    content: "Great news! I'll make sure the lab results are ready for review.",
    time: "9:18 AM",
    isOwn: false,
  },
  {
    id: "3",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    content: "Perfect, thanks Emily. Also, we need to discuss the protocol amendment for BEACON-2024. Can we schedule a meeting for this afternoon?",
    time: "9:22 AM",
    isOwn: true,
  },
  {
    id: "4",
    user: { name: "Dr. James Wilson", initials: "JW" },
    content: "I'm available after 2 PM. @Emily are you free as well?",
    time: "9:25 AM",
    isOwn: false,
  },
  {
    id: "5",
    user: { name: "Emily Roberts", initials: "ER" },
    content: "Yes, 2 PM works for me. Should I send out calendar invites?",
    time: "9:28 AM",
    isOwn: false,
  },
  {
    id: "6",
    user: { name: "Dr. Sarah Chen", initials: "SC" },
    content: "Yes please! Include Dr. Park as well since he's the co-investigator on BEACON.",
    time: "9:30 AM",
    isOwn: true,
  },
]

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState("general")
  const [messageInput, setMessageInput] = useState("")

  return (
    <>
      <DashboardHeader title="Chat" description="Team communication" />
      <div className="flex-1 overflow-hidden p-6">
        <Card className="shadow-sm h-[calc(100vh-180px)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Channels
                      </span>
                      <Button variant="ghost" size="icon" className="size-6">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <div className="space-y-0.5">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel.id)}
                          className={cn(
                            "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                            selectedChannel === channel.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted text-muted-foreground"
                          )}
                        >
                          <Hash className="size-4" />
                          <span className="truncate">{channel.name}</span>
                          {channel.unread > 0 && (
                            <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                              {channel.unread}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Direct Messages
                      </span>
                      <Button variant="ghost" size="icon" className="size-6">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <div className="space-y-0.5">
                      {directMessages.map((dm) => (
                        <button
                          key={dm.id}
                          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors hover:bg-muted"
                        >
                          <div className="relative">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {dm.initials}
                              </AvatarFallback>
                            </Avatar>
                            <Circle
                              className={cn(
                                "absolute -bottom-0.5 -right-0.5 size-2.5 fill-current",
                                dm.online ? "text-success" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <span className="truncate text-muted-foreground">{dm.name}</span>
                          {dm.unread > 0 && (
                            <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                              {dm.unread}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Hash className="size-5 text-muted-foreground" />
                  <span className="font-semibold">General</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Users className="size-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.isOwn && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {message.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("max-w-[70%]", message.isOwn && "items-end")}>
                        <div
                          className={cn(
                            "flex items-center gap-2 mb-1",
                            message.isOwn && "flex-row-reverse"
                          )}
                        >
                          <span className="text-sm font-medium">{message.user.name}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="size-4" />
                  </Button>
                  <Button size="icon">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
