import { createFileRoute } from '@tanstack/react-router'
import { SellerPage } from '../../../../../components/seller-page'

export const Route = createFileRoute('/(main)/_homeLayout/seller/$sellerId/')({
  component: SellerPage,
})
