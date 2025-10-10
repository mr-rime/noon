import Banners from '@/pages/dashboard/pages/banners'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout/banners/')({
  component: Banners
})
