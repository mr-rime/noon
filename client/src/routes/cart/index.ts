import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '../../components/cart-page'

export const Route = createFileRoute('/cart/')({
  component: CartPage,
})
