import Categories from '@/features/dashboard/components/pages/categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/d/_dashboardLayout/categories/',
)({
  component: Categories,
})