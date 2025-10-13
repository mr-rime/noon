import { Input } from '@/components/ui/input'
import type { CartItemType } from '../types'
import { Separator } from '@/components/ui/separator'
import { useMutation } from '@apollo/client'
import { CREATE_CHECKOUT_SESSION } from '@/graphql/orders'
import { useState } from 'react'
import { toast } from 'sonner'

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
          cancel_url: `${window.location.origin}/cart?payment=cancelled`
        }
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
    return total + (price * item.quantity)
  }, 0)

  const total = subtotal

  return (
    <section className="sticky w-full max-w-[35%] rounded-[6px] rounded-t-none border border-[rgba(198,204,221,.5)] p-[10px_20px]">
      <h2 className="font-bold text-[19px]">Order Summary</h2>
      <Input
        placeholder="Coupon Code"
        className="mt-2"
        input={{ className: 'bg-white' }}
        button
        buttonDirection="right"
      />
      <div className="mt-5 w-full space-y-3">
        <div className="flex w-full items-center justify-between ">
          <div className="text-[#7e859b] text-[14px] ">Subtotal ({cartItems.length || 0} items)</div>
          <div className="text-[15px]">
            <span className="mr-1">EGP</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between ">
          <div className="text-[#7e859b] text-[14px]">Shipping Fee</div>
          <div className="font-bold text-[#38ae04] text-[15px] uppercase">
            <span>Free</span>
          </div>
        </div>
      </div>
      <Separator className="my-5 bg-[#DFDFDF]" />
      <div>
        <div className="flex w-full items-center justify-between ">
          <div className="text-[14px] ">
            <span className="font-bold text-[20px]">Total</span>{' '}
            <span className="text-[#7e859b] ">(Inclusive of VAT)</span>
          </div>
          <div className="font-bold text-[21px]">
            <span className="mr-1">EGP</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className="h-[48px] w-full cursor-pointer rounded-[4px] bg-[#3866df] p-[16px] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#3e72f7] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </section>
  )
}
