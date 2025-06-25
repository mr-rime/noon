import { createLazyFileRoute } from '@tanstack/react-router'
import { SellerPage } from '../../../../../components/seller-page'

export const Route = createLazyFileRoute('/(main)/_homeLayout/seller/$sellerId/')({
  component: SellerPage,
})
