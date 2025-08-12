import { HomeLayout } from '@/layouts'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/_homeLayout')({
  beforeLoad: ({ context, location }) => {
    const { subdomain } = context

    if (subdomain === 'dashboard') {
      if (location.pathname === '/' || location.pathname === '') {
        throw redirect({ to: '/d/overview' })
      }
    }
  },

  component: HomeLayout,
})
