import { Star } from 'lucide-react'
import { seller_page_icons } from '../constants/icons'

export function SellerReview() {
  return (
    <div className="w-full break-words border-[#f3f4f8] border-b py-[24px]">
      <div className="mb-[8px] flex items-start gap-[4px_8px] ">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eff3fd] font-bold text-[#9ba0b1] text-[14px]">
          A
        </div>
        <div className="flex items-start justify-between space-x-[20px]">
          <div className="flex flex-col items-start">
            <div className="text-[14px]">Ahmed H.</div>
            <div className="text-[#9ba0b1] text-[12px]">Jun 17, 2025</div>
          </div>
          <div className="spcae-x-[5px] flex h-[20px] min-w-[120px] items-center rounded-full bg-[#f3f4f8] px-[5px] text-[12px]">
            {seller_page_icons.virifiedIcon}
            <div className="ml-1.5">Verified Purchase</div>
          </div>
        </div>
      </div>
      <div className="my-1 flex items-center gap-1">
        <Star fill="#008000" color="#008000" size={16} />
        <Star fill="#008000" color="#008000" size={16} />
        <Star fill="#008000" color="#008000" size={16} />
        <Star fill="#DBDDE3" color="#DBDDE3" size={16} />
        <Star fill="#DBDDE3" color="#DBDDE3" size={16} />
      </div>
      <div className="mt-3 block h-[2.5em] w-full break-words pr-[45px] font-cairo text-[14px]">Expired product</div>

      <div className="flex items-center space-x-1">
        {seller_page_icons.reportIcon}
        <button className="cursor-pointer font-bold text-[#7e859b] text-[14px] hover:opacity-[.8]">Report</button>
      </div>
    </div>
  )
}
