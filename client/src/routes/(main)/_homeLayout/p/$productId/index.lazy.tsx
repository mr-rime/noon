import { createLazyFileRoute } from '@tanstack/react-router'
import { ProductPage } from '../../../../../components/product-page'

export const Route = createLazyFileRoute('/(main)/_homeLayout/p/$productId/')({
  component: ProductPage,
})