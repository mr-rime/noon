import { Input } from '@/components/ui/input'
import type { CartItemType } from '../types'
import { Separator } from '@/components/ui/separator'
import { useMutation } from '@apollo/client'
import { CREATE_CHECKOUT_SESSION } from '@/graphql/orders'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronRight } from 'lucide-react'

export function OrderSummary({ cartItems }: { cartItems: CartItemType[] }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      const { data } = await createCheckoutSession({
        variables: {
          success_url: `${window.location.origin}/orders?payment=success`,
          cancel_url: `${window.location.origin}/cart?payment=cancelled`,
        },
      })

      if (data?.createCheckoutSession?.success && data?.createCheckoutSession?.session_url) {
        window.location.href = data.createCheckoutSession.session_url
      } else {
        toast.error(data?.createCheckoutSession?.message || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred during checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.final_price || item.price || 0
    return total + price * item.quantity
  }, 0)

  const total = subtotal

  return (
    <section className="w-full rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <h2 className="text-lg font-semibold text-[#20232a]">Order Summary</h2>
          <p className="text-xs text-[#7e859b]">Review your order costs before checkout</p>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-right">
          <p className="text-xs uppercase tracking-wide text-[#7e859b]">Cart Total</p>
          <p className="text-base font-semibold text-[#20232a]">
            EGP {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <Input
        placeholder="Coupon Code"
        className="mt-4 w-full"
        input={{ className: 'bg-white' }}
        button
        buttonDirection="right"
      />

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[#EAECF0] px-4 py-3 text-sm font-semibold text-[#404553] transition-colors hover:border-[#c3c8db]">
        <span>View Available Offers</span>
        <ChevronRight size={16} />
      </button>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between text-[#404553]">
          <span className="w-full sm:w-auto">Subtotal ({cartItems.length || 0} items)</span>
          <span className="w-full sm:w-auto font-semibold text-right sm:text-right">
            EGP {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between text-[#404553]">
          <span className="w-full sm:w-auto">Shipping</span>
          <span className="w-full sm:w-auto font-semibold uppercase text-[#38ae04] text-right sm:text-right">Free</span>
        </div>
      </div>

      <Separator className="my-5 bg-[#DFDFDF]" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <p className="text-xs uppercase text-[#7e859b]">Total (VAT included)</p>
          <p className="text-2xl font-semibold text-[#20232a]">
            EGP {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="w-full sm:w-auto text-right text-xs text-[#7e859b]">
          <p>VAT and Duties included</p>
          <p>Secure checkout</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing || cartItems.length === 0}
        className="mt-5 h-12 w-full rounded-xl bg-[#3866df] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#3e72f7] disabled:cursor-not-allowed disabled:opacity-50">
        {isProcessing ? 'Processing…' : 'Checkout'}
      </button>
    </section>
  )
}
