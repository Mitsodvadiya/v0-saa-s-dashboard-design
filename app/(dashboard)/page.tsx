import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodaysVisitsTable } from "@/components/dashboard/todays-visits-table"
import { UpcomingVisitsTable } from "@/components/dashboard/upcoming-visits-table"
import { VisitAlerts } from "@/components/dashboard/visit-alerts"
import { StudyProgressOverview } from "@/components/dashboard/study-progress-chart"
import { RecruitmentChart } from "@/components/dashboard/recruitment-chart"
import { CalendarSnapshot } from "@/components/dashboard/calendar-widget"
import { NotificationsPanel } from "@/components/dashboard/notifications-panel"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Welcome back, Dr. Chen"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 1. Top Summary Cards */}
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* 2. Today's Visits Table */}
            <TodaysVisitsTable />

            {/* 3. Upcoming Visits Table */}
            <UpcomingVisitsTable />

            <div className="gap-6 flex flex-row" >
              <div className="flex-1">
                <NotificationsPanel />
              </div>
              <div className="flex-1">
                <RecentActivity />
              </div>

              {/* 7. Quick Actions */}
            </div>
            {/* 4. Study Progress + Recruitment Charts (Stacked for height balance) */}
            {/* <StudyProgressOverview /> */}
            {/* <RecruitmentChart /> */}
          </div>

          <div className="space-y-6">
            {/* 4. Visit Confirmation Alerts (High Priority) */}
            <VisitAlerts />

            {/* 5. Calendar Snapshot + Notifications */}
            <CalendarSnapshot />
            <QuickActions />

          </div>
        </div>
      </div>
    </>
  )
}
