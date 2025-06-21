import { createFileRoute } from '@tanstack/react-router'
import { ProductsSection } from '../../../../../components/dashboard/components/products-section'

export const Route = createFileRoute('/(dashboard)/_dashboardLayout/dashboard/products/')(
  {
    component: ProductsSection,
  },
)