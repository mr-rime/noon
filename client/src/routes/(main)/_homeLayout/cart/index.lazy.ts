import { createLazyFileRoute } from '@tanstack/react-router'
import { CartPage } from '../../../../components/cart-page'

export const Route = createLazyFileRoute('/(main)/_homeLayout/cart/')({
  component: CartPage,
})
