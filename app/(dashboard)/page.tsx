import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecruitmentChart } from "@/components/dashboard/recruitment-chart"
import { VisitStatusChart } from "@/components/dashboard/visit-status-chart"
import { UpcomingVisitsTable } from "@/components/dashboard/upcoming-visits-table"
import { StudyProgress } from "@/components/dashboard/study-progress"
import { TodoList } from "@/components/dashboard/todo-list"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Welcome back, Dr. Chen"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <RecruitmentChart />
          <VisitStatusChart />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingVisitsTable />
          </div>
          <div className="space-y-6">
            <StudyProgress />
            <TodoList />
          </div>
        </div>
      </div>
    </>
  )
}
