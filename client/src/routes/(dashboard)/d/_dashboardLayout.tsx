import { DashboardLayout } from '@/pages/dashboard'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout')({
  beforeLoad: ({ context }) => {
    const { subdomain } = context

    if (!subdomain) {
      throw redirect({ to: '/' })
    }
  },
  component: DashboardLayout,
})
