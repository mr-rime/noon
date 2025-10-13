import { createFileRoute } from '@tanstack/react-router'
import CategoriesOverview from '@/pages/categories-overview'

export const Route = createFileRoute('/(main)/_homeLayout/categories/')({
  component: CategoriesOverview,
})