import { useQuery } from '@apollo/client'
import { CartItems } from '@/features/cart/components/cart-items'
import { OrderSummary } from '@/features/cart/components/order-summary'
import type { CartResponseType } from './types'
import { GET_CART_ITEMS } from '@/features/cart/api/cart'
import { CartLoadingSkeleton } from '@/features/cart/components/cart-loading-skeleton'
import { Link } from '@tanstack/react-router'
import { EmptyCart } from '@/features/cart/components/empty-cart'

export function CartPage() {
  const { data, loading } = useQuery<CartResponseType>(GET_CART_ITEMS)

  if (loading) return <CartLoadingSkeleton />

  const cartItems = data?.getCartItems.cartItems || []

  return (
    <main className="min-h-screen bg-[#f7f7fa]">
      <div className="site-container mx-auto w-full max-w-6xl px-3 pb-32 pt-4 sm:px-6 lg:px-8 lg:pt-10">
        {cartItems.length <= 0 ? (
          <section className="mt-5 flex w-full items-center justify-center">
            <Link to="/">
              <EmptyCart />
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="flex flex-wrap items-baseline gap-2 text-2xl font-semibold text-[#20232a]">
                Cart
                <span className="text-sm font-normal text-[#7e859b]">({cartItems.length} items)</span>
              </h1>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              <section className="flex-1 lg:flex-[2]">
                <CartItems cartItems={cartItems} />
              </section>

              <aside className="w-full lg:flex-[1] lg:max-w-sm">
                <div className="hidden lg:block lg:sticky lg:top-28">
                  <OrderSummary cartItems={cartItems} />
                </div>

                <div className="lg:hidden">
                  <OrderSummary cartItems={cartItems} />
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
