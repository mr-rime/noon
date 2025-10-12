import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useQuery } from '@apollo/client'
import { GET_USER_ORDERS } from '@/graphql/orders'
import { useState } from 'react'
import { toast } from 'sonner'

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
      <section className="h-screen w-full">
        <div className="w-full">
          <h1 className="font-bold text-[28px]">Orders</h1>
          <p className="text-[#7e859b] text-[1rem]">View the delivery status for items and your order history</p>
        </div>
        <div className="mt-5 flex w-full items-center justify-between">
          <h3 className="font-bold text-[19px]">Loading...</h3>
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
      <section className="h-screen w-full">
        <div className="w-full">
          <h1 className="font-bold text-[28px]">Orders</h1>
          <p className="text-[#7e859b] text-[1rem]">View the delivery status for items and your order history</p>
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
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-600' }
      case 'processing':
        return { text: 'Processing', color: 'text-blue-600' }
      case 'shipped':
        return { text: 'Shipped', color: 'text-purple-600' }
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
    <section className="h-screen w-full">
      <div className="w-full">
        <h1 className="font-bold text-[28px]">Orders</h1>
        <p className="text-[#7e859b] text-[1rem]">View the delivery status for items and your order history</p>
      </div>

      <div className="mt-5 flex w-full items-center justify-between">
        <h3 className="font-bold text-[19px]">
          {filteredOrders.length > 0 ? 'Your Orders' : 'No Orders Found'}
        </h3>

        <div className="flex items-center gap-2">
          <Input
            type="search"
            name="finditems"
            className="w-[360px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            input={{
              className:
                'focus:border-[#3866DF] min-h-[48px] rounded-[5px] bg-white hover:border-[#9BA0B1] transition-colors',
            }}
            icon={<Search color="#9BA0B2" size={18} />}
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
            className="min-h-[48px] w-[170px] rounded-[5px] px-5 text-[16px] transition-colors hover:border-[#9BA0B1]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const firstItem = order.items?.[0]
            const statusDisplay = getStatusDisplay(order.status)

            return (
              <div
                key={order.id}
                className="flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-[8px] border border-[#dadce3] bg-white px-8 py-10 transition-colors hover:border-[#9ba0b1]"
                onClick={() => {

                  window.location.href = `/orders/track/order/${order.id}`
                }}
              >
                <div className="z-[2]">
                  <div className="flex items-center space-x-1">
                    <span className={`font-bold text-[16px] ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                    <div>
                      <span>on {formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    {firstItem?.product_image && (
                      <img
                        src={firstItem.product_image}
                        alt="product"
                        className="h-[89px] w-[64px] object-cover rounded"
                      />
                    )}
                    <div className="max-w-[270px]">
                      <p className="line-clamp-3 text-left text-[12px]">
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

                <div className="z-[2] flex min-h-[115px] flex-col items-center justify-between">
                  <div />
                  <div className="text-[#9ba0b1] text-[12px]">
                    <span>Order ID</span> <strong>{order.id}</strong>
                  </div>
                </div>
              </div>
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
