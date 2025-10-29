import { DashboardLayout } from '@/pages/dashboard'
import { client } from '@/config/apollo'
import { CHECK_STORE_AUTH } from '@/graphql/store'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/d/_dashboardLayout')({
  beforeLoad: async ({ context, location }) => {
    const { subdomain } = context

    if (!subdomain) {
      throw redirect({ to: '/' })
    }

    try {
      const { errors } = await client.query({
        query: CHECK_STORE_AUTH,
        fetchPolicy: 'network-only',
      })

      const hasUnauthorizedError = Array.isArray(errors)
        ? errors.some((e) => /unauthorized/i.test(e.message))
        : false

      if (hasUnauthorizedError) {
        throw redirect({ to: '/d/login', search: { redirect: location.href } })
      }
    } catch {
      throw redirect({ to: '/d/login', search: { redirect: location.href } })
    }
  },
  component: DashboardLayout,
})
