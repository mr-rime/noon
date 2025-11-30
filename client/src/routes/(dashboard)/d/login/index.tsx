import { PartnerPage } from '@/features/dashboard/components/components/partner/partner'
import { createFileRoute } from '@tanstack/react-router'

type PartnersSearch = {
  page?: 'login' | 'register'
  redirect?: string
}

export const Route = createFileRoute('/(dashboard)/d/login/')({
  component: PartnerPage,
  validateSearch: (search: Record<string, PartnersSearch[keyof PartnersSearch]>): PartnersSearch => {
    return {
      page: search?.page as PartnersSearch['page'],
      redirect: typeof search?.redirect === 'string' ? search.redirect : undefined,
    }
  },
})