import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ItemSummary } from './components/item-summary'
import { OrderInvoice } from './components/order-invoice'
import { OrderTimeline } from './components/order-timeline'
import { useQuery } from '@apollo/client'
import { GET_ORDER_DETAILS } from '@/graphql/orders'
import { toast } from 'sonner'

export function TrackingDetails() {
  const navigate = useNavigate()
  const { orderId } = useParams({ strict: false }) as { orderId: string }

  const { data, loading, error } = useQuery(GET_ORDER_DETAILS, {
    variables: {
      order_id: orderId
    },
  })

  if (loading) {
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

        <div className="mt-5 flex w-full items-start space-x-5">
          <section className="w-full">
            <div className="h-[400px] w-full animate-pulse rounded bg-gray-100" />
            <div className="mt-5 h-[200px] w-full animate-pulse rounded bg-gray-100" />
          </section>
          <div className="w-[300px] h-[300px] animate-pulse rounded bg-gray-100" />
        </div>
      </section>
    )
  }

  if (error) {
    toast.error('Failed to load order details')
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
        <div className="mt-5 flex w-full items-center justify-center">
          <p className="text-red-500">Failed to load order details. Please try again.</p>
        </div>
      </section>
    )
  }

  const order = data?.getOrderDetails?.order

  if (!order) {
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
        <div className="mt-5 flex w-full items-center justify-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </section>
    )
  }

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
          {order.status === 'cancelled' ? (
            <div className="mt-5 h-fit w-full bg-white p-[16px] rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
                    <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cancelled on {new Date(order.updated_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}</h3>
                  {order.cancellation_reason && (
                    <p className="text-sm text-gray-600">Reason: {order.cancellation_reason}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <OrderTimeline order={order} tracking={order.tracking} />
          )}
          <ItemSummary order={order} />
        </section>
        <OrderInvoice order={order} />
      </section>
    </section>
  )
}
