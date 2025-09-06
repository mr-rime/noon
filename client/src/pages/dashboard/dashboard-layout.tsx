import { Outlet } from '@tanstack/react-router'
import { AdminLayout } from './components/admin/admin-layout'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import './styles/index.css'

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </TooltipProvider>
  )
}
