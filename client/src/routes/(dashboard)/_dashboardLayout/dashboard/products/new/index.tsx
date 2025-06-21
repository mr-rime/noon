import { NewProduct } from '@/components/dashboard/components/products-section/components/new-product'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_dashboardLayout/dashboard/products/new/',
)({
  component: NewProduct,
})
