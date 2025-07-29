import { createLazyFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../../components/dashboard'

export const Route = createLazyFileRoute('/(dashboard)/_dashboardLayout')({
  component: DashboardPage,
})
