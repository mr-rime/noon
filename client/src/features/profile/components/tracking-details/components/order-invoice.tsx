import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

interface OrderInvoiceProps {
  order: any
}

export function OrderInvoice({ order }: OrderInvoiceProps) {
  const firstItem = order?.items?.[0]
  const tracking = order?.tracking


  const shippingAddress = order?.shipping_address || 'Address not available'
  const parsedAddress = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress


  return (
    <div className="mt-5 grid w-[40%] grid-rows-[span_10] gap-[8px]">
      <div className="bg-white p-[8px_16px]">
        <span>Item ID: </span>
        <span className="font-bold text-[16px]">
          {firstItem?.id || order?.id || 'N/A'}
        </span>
      </div>

      <div className="bg-white p-[20px_16px]">
        <h2 className="font-bold text-[19px]">
          Delivery address
          <span className="ml-2 text-[#7e859b] capitalize">(home)</span>
        </h2>

        {parsedAddress ? (
          <>
            <p className="text-[14px]">
              {parsedAddress.name || 'Name not available'}
            </p>
            <p className="text-[14px]">
              {parsedAddress.address || parsedAddress.city || 'Address not available'}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-[14px]">
                {parsedAddress.phone || '+20-10-00000000'}
              </span>
              <span className="font-bold text-[#38ae04] text-[14px]">Verified</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-[14px]">Address collected during checkout</p>
            <p className="text-[14px]">Please check your email for delivery details</p>
          </>
        )}
      </div>

      {tracking && (
        <div className="bg-white p-[16px]">
          <h3 className="font-bold text-[16px] mb-2">Tracking Information</h3>
          <div className="space-y-2 text-[14px]">
            <div>
              <span className="text-gray-600">Provider: </span>
              <span className="font-medium">{tracking.shipping_provider}</span>
            </div>
            <div>
              <span className="text-gray-600">Tracking Number: </span>
              <span className="font-medium">{tracking.tracking_number}</span>
            </div>
            {tracking.estimated_delivery_date && (
              <div>
                <span className="text-gray-600">Estimated Delivery: </span>
                <span className="font-medium">
                  {new Date(tracking.estimated_delivery_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <Link to={`/orders/invoice/$invoiceId`} params={{ invoiceId: order?.id }}>
        <div className="flex items-center justify-between bg-white p-[8px_16px] cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-start">
            <span className="font-bold text-[16px]">View order/invoice summary</span>
            <span className="text-[#7e859b] text-[14px]">Find invoice, shipping details here</span>
          </div>

          <ChevronRight size={20} />
        </div>
      </Link>
    </div>
  )
}
