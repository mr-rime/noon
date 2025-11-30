import { createFileRoute } from '@tanstack/react-router'
import { DiscountsPage } from '@/features/dashboard/components/pages/discounts'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout/discounts/')({
  component: DiscountsPage,
})