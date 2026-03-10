"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const studies = [
  {
    id: "STD-001",
    name: "BEACON-2024",
    sponsor: "Pfizer",
    enrolled: 156,
    target: 200,
    status: "active",
    phase: "Phase III",
  },
  {
    id: "STD-002",
    name: "AURORA-Phase2",
    sponsor: "Novartis",
    enrolled: 89,
    target: 120,
    status: "active",
    phase: "Phase II",
  },
  {
    id: "STD-003",
    name: "NOVA-Trial",
    sponsor: "Johnson & Johnson",
    enrolled: 234,
    target: 250,
    status: "active",
    phase: "Phase III",
  },
  {
    id: "STD-004",
    name: "MERIDIAN-2024",
    sponsor: "Roche",
    enrolled: 45,
    target: 100,
    status: "recruiting",
    phase: "Phase I",
  },
]

const statusStyles = {
  active: "bg-success/10 text-success border-0",
  recruiting: "bg-primary/10 text-primary border-0",
  completed: "bg-muted text-muted-foreground border-0",
  paused: "bg-warning/10 text-warning border-0",
}

export function StudyProgress() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Study Progress</CardTitle>
        <CardDescription>Enrollment status across active studies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {studies.map((study) => {
          const progress = Math.round((study.enrolled / study.target) * 100)
          return (
            <div key={study.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{study.name}</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {study.phase}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{study.sponsor}</span>
                </div>
                <Badge className={statusStyles[study.status as keyof typeof statusStyles]}>
                  {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-sm font-medium text-muted-foreground w-24 text-right">
                  {study.enrolled}/{study.target} ({progress}%)
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
