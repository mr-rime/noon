import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ItemSummary } from './components/item-summary'
import { OrderInvoice } from './components/order-invoice'
import { OrderTimeline } from './components/order-timeline'

export function TrackingDetails() {
  const navigate = useNavigate()
  return (
    <section className="h-screen w-full">
      <button
        onClick={() => navigate({ to: '/orders' })}
        className="flex cursor-pointer items-center space-x-1 text-[#7e859b] text-[14px] hover:underline">
        <ArrowLeft size={18} color="#7e859b" />
        <span>Back to orders</span>
      </button>
      <h1 className="font-bold text-[28px]">Tracking details</h1>
      <p className="text-[#7e859b] text-[1rem]">View and update delivery information for your item</p>

      <section className="flex w-full items-start space-x-5">
        <section className="w-full">
          <OrderTimeline />
          <ItemSummary />
        </section>
        <OrderInvoice />
      </section>
    </section>
  )
}
