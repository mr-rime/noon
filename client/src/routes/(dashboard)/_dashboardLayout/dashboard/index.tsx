import { createFileRoute } from '@tanstack/react-router'
import { DashboardSection } from '../../../../components/dashboard/components/dashboard-section'

export const Route = createFileRoute('/(dashboard)/_dashboardLayout/dashboard/')({
  component: DashboardSection,
})