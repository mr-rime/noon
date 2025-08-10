import { PartnerPage } from '@/pages/dashboard/components/partner'
import { createFileRoute } from '@tanstack/react-router'

type PartnersSearch = {
  page?: 'login' | 'register'
}

export const Route = createFileRoute('/(dashboard)/partners/')({
  component: PartnerPage,
  validateSearch: (search: Record<string, PartnersSearch['page']>): PartnersSearch => {
    return {
      page: search?.page,
    }
  },
})
