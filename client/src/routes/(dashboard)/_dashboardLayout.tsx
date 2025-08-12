import { DashboardPage } from '@/pages/dashboard'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_dashboardLayout')({
  beforeLoad: ({ context }) => {
    const { subdomain } = context

    if (!subdomain) {
      throw redirect({ to: '/' })
    }
  },
  component: DashboardPage,
})
