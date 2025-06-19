import { createFileRoute } from '@tanstack/react-router'
import { ProductPage } from '../../../../../components/product-page'

export const Route = createFileRoute('/(main)/_homeLayout/p/$productId/')({
  component: ProductPage,
})