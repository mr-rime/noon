import { createFileRoute } from '@tanstack/react-router'
import ProductPage from '../../../components/product-page'

export const Route = createFileRoute('/p/$productId/')({
  component: ProductPage,
})