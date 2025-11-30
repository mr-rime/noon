import Banners from '@/features/dashboard/components/pages/banners'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout/banners/')({
  component: Banners
})
