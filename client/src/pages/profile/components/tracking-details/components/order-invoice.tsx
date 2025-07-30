import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export function OrderInvoice() {
  return (
    <div className="mt-5 grid w-[40%] grid-rows-[span_10] gap-[8px]">
      <div className="bg-white p-[8px_16px]">
        <span>Item ID: </span> <span className="font-bold text-[16px]">NEGH60016975091</span>
      </div>
      <div className="bg-white p-[20px_16px]">
        <h2 className="font-bold text-[19px]">
          Delivery address
          <span className="ml-2 text-[#7e859b] capitalize">(home)</span>
        </h2>
        <p className="text-[14px]">Ahmed Hany</p>
        <p className="text-[14px]">Gharbia, Egypt</p>

        <div className="flex items-center space-x-2">
          <span className="text-[14px]">+20-10-33579442</span>
          <span className="font-bold text-[#38ae04] text-[14px]">Verified</span>
        </div>
      </div>

      <Link to="/orders/$orderId" params={{ orderId: '1' }}>
        <div className="flex items-center justify-between bg-white p-[8px_16px]">
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
