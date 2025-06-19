import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '../../../../components/cart-page'

export const Route = createFileRoute('/(main)/_homeLayout/cart/')({
  component: CartPage,
})
