import { DashboardPage } from '@/pages/dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(dashboard)/_dashboardLayout')({
  component: DashboardPage,
})
