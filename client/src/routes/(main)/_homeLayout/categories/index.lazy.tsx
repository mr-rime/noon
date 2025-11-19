import { createLazyFileRoute } from '@tanstack/react-router'
import CategoriesOverview from '@/pages/categories-overview'

export const Route = createLazyFileRoute('/(main)/_homeLayout/categories/')({
  component: CategoriesOverview,
})