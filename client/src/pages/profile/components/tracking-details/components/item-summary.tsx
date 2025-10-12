import { Link } from '@tanstack/react-router'
import { tarcking_icons } from '../constants/icons'
import { Image } from '@unpic/react'

interface ItemSummaryProps {
  order: any
}

export function ItemSummary({ order }: ItemSummaryProps) {
  const firstItem = order?.items?.[0]

  if (!firstItem) {
    return (
      <section className="mt-5 h-fit w-full bg-white p-[16px] transition-all">
        <h2 className="font-bold text-[19px]">Item summary</h2>
        <div className="mt-5 flex items-center justify-center py-8">
          <p className="text-gray-500">No items found in this order</p>
        </div>
      </section>
    )
  }

  const totalItems = order?.items?.length || 0
  const totalPrice = order?.total_amount || 0

  return (
    <section className="mt-5 h-fit w-full bg-white p-[16px] transition-all">
      <h2 className="font-bold text-[19px]">Item summary</h2>

      <div className="mt-5 space-y-4">
        {order.items.map((item: any, index: number) => (
          <div key={item.id || index} className="flex items-start space-x-4">
            <Link to="/$title/$productId" params={{ productId: item.product_id, title: '' }}>
              <div className="max-w-[150px]">
                <Image
                  src={item.product_image || "/media/imgs/product-img1.avif"}
                  alt={item.product_name || "product"}
                  className="w-full rounded"
                  width={150}
                  height={150}
                  layout="constrained"
                />
              </div>
            </Link>
            <div className="flex-1">
              <p className="text-[14px]">
                {item.product_name || 'Product name not available'}
              </p>
              <p className="text-[12px] text-gray-500 mt-1">
                Quantity: {item.quantity}
              </p>
              <span className="mt-2 flex items-center space-x-1 text-[#7e859b] text-[14px]">
                {tarcking_icons.returnableIcon}
                This item is returnable
              </span>

              <div className="mt-3 space-x-1 font-bold text-[16px]">
                <span>{item.currency}</span>
                <span>{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-gray-600">Total ({totalItems} items)</span>
            <div className="font-bold text-[16px]">
              <span>{order?.currency}</span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
