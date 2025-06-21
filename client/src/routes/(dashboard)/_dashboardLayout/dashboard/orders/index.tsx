import OrdersSection from '@/components/dashboard/components/orders-section'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_dashboardLayout/dashboard/orders/',
)({
  component: OrdersSection,
})
