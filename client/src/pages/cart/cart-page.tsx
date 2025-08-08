import { useQuery } from '@apollo/client'
import { CartItems } from './components/cart-items'
import { OrderSummary } from './components/order-summary'
import type { CartResponseType } from './types'
import { GET_CART_ITEMS } from '@/graphql/cart'
import { CartLoadingSkeleton } from './components/cart-loading-skeleton'
import { Link } from '@tanstack/react-router'
import { EmptyCart } from './components/empty-cart'

export function CartPage() {
  const { data, loading } = useQuery<CartResponseType>(GET_CART_ITEMS)

  if (loading) return <CartLoadingSkeleton />

  const cartItems = data?.getCartItems.cartItems || []

  return (
    <main className="site-container mt-10 h-full w-full px-[45px] py-2">
      {cartItems.length <= 0 ? (
        <section className="mt-5 flex w-full items-center justify-center">
          <Link to="/">
            <EmptyCart />
          </Link>
        </section>
      ) : (
        <>
          <h1 className="flex items-center space-x-1">
            <strong className="text-[23px]">Cart</strong>
            <div className="text-[#7e859b] text-[14px]">({cartItems.length} items)</div>
          </h1>
          <section className="flex w-full items-start space-x-7">
            <CartItems cartItems={cartItems} />
            <OrderSummary cartItems={cartItems} />
          </section>
        </>
      )}
    </main>
  )
}
