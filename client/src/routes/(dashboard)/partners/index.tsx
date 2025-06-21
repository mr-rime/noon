import { createFileRoute } from '@tanstack/react-router'
import { PartnerPage } from '../../../components/dashboard/components/partner'

type PartnersSearch = {
  page?: "login" | "register"
}

export const Route = createFileRoute('/(dashboard)/partners/')({
  component: PartnerPage,
  validateSearch: (search: Record<string, PartnersSearch["page"]>): PartnersSearch => {
    return {
      page: search?.page
    }
  }
})