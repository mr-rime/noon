import { createLazyFileRoute } from '@tanstack/react-router'
import CategoriesOverview from '@/features/category/categories-overview'

export const Route = createLazyFileRoute('/(main)/_homeLayout/categories/')({
  component: CategoriesOverview,
})