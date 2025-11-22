import { createFileRoute } from '@tanstack/react-router'
import { CouponsPage } from '@/pages/dashboard/pages/coupons'

export const Route = createFileRoute(
  '/(dashboard)/d/_dashboardLayout/coupons/',
)({
  component: CouponsPage,
})

