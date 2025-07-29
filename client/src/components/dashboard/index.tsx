import { Outlet } from '@tanstack/react-router'
import { DashboardSidebar } from './components/sidebar'

export function DashboardPage() {
  return (
    <main className="flex w-full items-start bg-[#F7F7FA]">
      <div className="hidden md:block">
        <div className="w-[315px]" />
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  )
}
