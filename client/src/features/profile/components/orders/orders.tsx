import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Select } from '@/shared/components/ui/select'
import { useQuery } from '@apollo/client'
import { GET_USER_ORDERS } from '@/features/orders/api/orders'
import { useState } from 'react'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('last_3_months')

  const { data, loading, error } = useQuery(GET_USER_ORDERS, {
    variables: {
      limit: 20,
      offset: 0
    }
  })

  if (loading) {
    return (
      <section className="h-full w-full">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-[#374151] text-sm sm:text-base mt-1">View the delivery status for items and your order history</p>
        </div>
        <div className="mt-5 flex w-full items-center justify-between">
          <h3 className="font-bold text-lg sm:text-xl">Loading...</h3>
        </div>
        <div className="mt-5 flex flex-col space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[115px] w-full animate-pulse rounded-[8px] border border-[#dadce3] bg-gray-100" />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    toast.error('Failed to load orders')
    return (
      <section className="h-full w-full">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-[#374151] text-sm sm:text-base mt-1">View the delivery status for items and your order history</p>
        </div>
        <div className="mt-5 flex w-full items-center justify-center">
          <p className="text-red-500">Failed to load orders. Please try again.</p>
        </div>
      </section>
    )
  }

  const orders = data?.getUserOrders?.orders || []
  const filteredOrders = orders.filter((order: any) => {
    if (searchTerm) {
      return order.items?.some((item: any) =>
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'placed':
        return { text: 'Placed', color: 'text-yellow-600' }
      case 'processing':
        return { text: 'Processing', color: 'text-blue-600' }
      case 'confirmed':
        return { text: 'Confirmed', color: 'text-purple-600' }
      case 'dispatched':
        return { text: 'Dispatched', color: 'text-indigo-600' }
      case 'delivered':
        return { text: 'Delivered', color: 'text-green-600' }
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-red-600' }
      default:
        return { text: status, color: 'text-gray-600' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  return (
    <section className="h-full w-full">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-[#7e859b] text-sm sm:text-base mt-1">View the delivery status for items and your order history</p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="font-bold text-lg sm:text-xl">
          {filteredOrders.length > 0 ? 'Your Orders' : 'No Orders Found'}
        </h3>

        <div className="flex items-center gap-2">
          <Input
            type="search"
            name="finditems"
            className="w-full sm:w-[360px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            input={{
              className:
                'focus:border-[#3866DF] min-h-[48px] rounded-[5px] bg-white hover:border-[#374151] transition-colors',
            }}
            icon={<Search color="#6B7280" size={18} />}
            placeholder="Find items"
            iconDirection="left"
          />
          <Select
            defaultValue={timeFilter}
            onChange={(value) => setTimeFilter(value)}
            options={[
              { label: 'Last 3 months', value: 'last_3_months' },
              { label: 'Last 6 months', value: 'last_6_months' },
              { label: '2025', value: '2025' },
            ]}
            className="min-h-[48px] w-[170px] rounded-[5px] px-5 text-[16px] transition-colors hover:border-[#374151]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const firstItem = order.items?.[0]
            const statusDisplay = getStatusDisplay(order.status)

            return (
              <Link to='/orders/track/order/$orderId' params={{ orderId: order.id }}>
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between w/full cursor-pointer overflow-hidden rounded-[8px] border border-[#dadce3] bg-white p-4 sm:p-6 lg:px-8 lg:py-10 transition-colors hover:border-[#374151]"
                >
                  <div className="z-[2] flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-3">
                      <span className={`font-bold text-sm sm:text-base ${statusDisplay.color}`}>
                        {statusDisplay.text}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <span>on {formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-5">
                      {firstItem?.product_image && (
                        <img
                          src={firstItem.product_image}
                          alt="product"
                          className="h-[89px] w-[64px] object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0 max-w-[270px]">
                        <p className="line-clamp-3 text-left text-xs sm:text-[12px]">
                          {firstItem?.product_name || 'Product name not available'}
                        </p>
                        {order.items && order.items.length > 1 && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="z-[2] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0 sm:min-h-[115px]">
                    <div className="text-center sm:text-right">
                      <div className="text-[#374151] text-[12px] mb-2">
                        <div>
                          <span>Order ID</span> <strong className="font-mono">{order.id}</strong>
                        </div>
                        {order.tracking?.tracking_number && (
                          <div className="mt-1">
                            <span>Tracking</span> <strong className="font-mono">{order.tracking.tracking_number}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Start shopping to see your orders here'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
