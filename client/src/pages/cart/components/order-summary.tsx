import { Input } from '../../../components/ui/input'
import { Separator } from '../../../components/ui/separator'
import type { CartItem } from '../types'

export function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
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
            <span>75555.00</span>
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
            <span>{cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5">
          <button className="h-[48px] w-full cursor-pointer rounded-[4px] bg-[#3866df] p-[16px] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#3e72f7]">
            Checkout
          </button>
        </div>
      </div>
    </section>
  )
}
