import { HomeLayout } from '@/layouts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/_homeLayout')({
  component: HomeLayout,
})
