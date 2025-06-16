import { createFileRoute } from '@tanstack/react-router'
import { SellerPage } from '../../../components/seller-page'

export const Route = createFileRoute('/seller/$sellerId/')({
  component: SellerPage,
})
