import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../../components/dashboard'

export const Route = createFileRoute('/(dashboard)/_dashboardLayout')({
  component: DashboardPage,
})

