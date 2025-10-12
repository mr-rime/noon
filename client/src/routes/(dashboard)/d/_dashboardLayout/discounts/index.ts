import { createFileRoute } from '@tanstack/react-router'
import { DiscountsPage } from '@/pages/dashboard/pages/discounts'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout/discounts/')({
  component: DiscountsPage,
})