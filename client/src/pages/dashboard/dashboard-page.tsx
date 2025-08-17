import { Outlet } from '@tanstack/react-router'
import { DashboardSidebar } from './components'
import { DashboardHeader } from './components/dashboard-header/dashboard-header'

export function DashboardPage() {
  return (
    <main className="flex w-full items-start bg-[#F7F7FA]">
      <div className="hidden md:block">
        <div className="w-[315px]" />
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <DashboardHeader />
        <Outlet />
      </div>
    </main>
  )
}
