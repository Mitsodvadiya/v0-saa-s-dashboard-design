"use client"

import * as React from "react"
import { Bell, Plus, Search, User, Folder, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients, studies..."
                  className="w-80 pl-8 bg-secondary/50 focus-visible:ring-1"
                  readOnly
                  onClick={() => setOpen(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Type to search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Patients">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <User className="mr-2 h-4 w-4" /> Sarah Johnson (P-1002)
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <User className="mr-2 h-4 w-4" /> Robert Wilson (P-1123)
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Studies">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Folder className="mr-2 h-4 w-4" /> BEACON-2024
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Folder className="mr-2 h-4 w-4" /> AURORA-Phase2
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Sponsors">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Building2 className="mr-2 h-4 w-4" /> Global Health Corp
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Building2 className="mr-2 h-4 w-4" /> BioTech Solutions
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Documents">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <FileText className="mr-2 h-4 w-4" /> Lab Report - P-1045
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <FileText className="mr-2 h-4 w-4" /> Protocol v2.1
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 font-semibold">
              <Plus className="size-4" />
              Quick Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New Patient</DropdownMenuItem>
            <DropdownMenuItem>New Study</DropdownMenuItem>
            <DropdownMenuItem>New Visit</DropdownMenuItem>
            <DropdownMenuItem>Upload Document</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
