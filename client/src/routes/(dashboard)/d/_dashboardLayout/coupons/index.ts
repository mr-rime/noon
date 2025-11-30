import { createFileRoute } from '@tanstack/react-router'
import { CouponsPage } from '@/features/dashboard/components/pages/coupons'

export const Route = createFileRoute(
  '/(dashboard)/d/_dashboardLayout/coupons/',
)({
  component: CouponsPage,
})

