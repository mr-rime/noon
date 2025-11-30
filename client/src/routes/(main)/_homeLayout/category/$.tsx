import { createFileRoute } from '@tanstack/react-router'
import CategoryPage from '@/features/category/category-page'

export const Route = createFileRoute('/(main)/_homeLayout/category/$')({
  component: CategoryPage
})