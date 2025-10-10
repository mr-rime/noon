import Brands from '@/pages/dashboard/pages/brands'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/d/_dashboardLayout/brands/',
)({
  component: Brands,
})
