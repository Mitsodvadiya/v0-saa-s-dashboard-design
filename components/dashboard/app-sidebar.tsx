"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  FolderOpen,
  LayoutDashboard,
  Settings,
  ClipboardList,
  Users,
  UserCog,
  Stethoscope,
  BookLock,
  Check,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useStudy } from "@/lib/study-context"
import { STUDIES } from "@/lib/study-access-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Sponsors", icon: Building2, href: "/sponsors" },
  { title: "Studies", icon: Stethoscope, href: "/studies" },
  { title: "Patients", icon: Users, href: "/patients" },
  { title: "Visits", icon: ClipboardList, href: "/visits" },
  { title: "Calendar", icon: Calendar, href: "/calendar" },
  { title: "Analytics", icon: BarChart3, href: "/analytics" },
]

const studyNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Documents", icon: FolderOpen, href: "/documents" },
  { title: "Analytics", icon: BarChart3, href: "/analytics" },
]



const adminItems = [
  {
    title: "Users",
    icon: UserCog,
    href: "/users",
  },
  {
    title: "Study Access",
    icon: BookLock,
    href: "/study-access",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { selectedStudy, setSelectedStudy } = useStudy()

  const navItems = selectedStudy ? studyNavItems : mainNavItems

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 px-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
              <span className="font-semibold truncate">CTMS</span>
              <span className="text-xs text-muted-foreground truncate">Clinical Trials</span>
            </div>
          </Link>

          <div className="space-y-1.5">
            <p className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-wider">Select Study Context</p>
            
            <Select
              value={selectedStudy?.id || "none"}
              onValueChange={(val) => {
                const s = STUDIES.find((s) => s.id === val) || null
                setSelectedStudy(s)
                
                // Redirect to dashboard if on a study-only page and switching to "All Studies"
                if (val === "none" && pathname === "/documents") {
                  router.push("/")
                }
              }}
            >
              <SelectTrigger className="h-9 w-full bg-background/50 border-sidebar-border">
                <SelectValue placeholder="All Studies (Default)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Studies (Default)</SelectItem>
                {STUDIES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{selectedStudy ? `Study: ${selectedStudy.shortName}` : "Main Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">DR</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Dr. Sarah Chen</span>
                <span className="text-xs text-muted-foreground">Principal Investigator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
