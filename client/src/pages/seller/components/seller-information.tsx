import { useNavigate } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { seller_page_icons } from '../constants/icons'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

export function SellerInformation() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-start">
      <div>
        <button
          onClick={() => navigate({ to: '.' })}
          className="cursor-pointer text-start font-bold text-[#3866df] text-[22px] underline">
          noon
        </button>
      </div>

      <div className="mt-3 flex items-center space-x-2">
        {seller_page_icons.callIcon}
        <a href="tel:+200216358" className="text-[14px]">
          +200216358
        </a>
      </div>

      <Separator className="my-5" />

      <div className="flex w-full items-center space-x-[8px]">
        <div className="relative w-1/2 rounded-[8px] border border-[#ebecf0] bg-white p-[16px]">
          <div className="flex items-center justify-between">
            <div className="text-start font-bold text-[16px]">Seller Rating</div>
            <button aria-label="Seller help" className="gray-filter cursor-pointer">{seller_page_icons.helpIcon}</button>
          </div>
          <div className="mt-1 flex items-center space-x-1.5">
            <span className="font-bold text-[1.8rem]">4.3</span>
            <Star color="#80AE04" fill="#80AE04" size={19} />
          </div>
          <div>
            <span className="font-bold text-[#404553] text-[14px]">81%</span>{' '}
            <span className="text-[#374151] text-[14px]">Positive Ratings</span>
          </div>
        </div>
        <div className="relative w-1/2 rounded-[8px] border border-[#ebecf0] bg-white p-[16px]">
          <div className="flex items-center justify-between">
            <div className="text-start font-bold text-[16px]">Customers</div>
          </div>
          <div className="mt-1 flex items-center space-x-1.5">
            <span className="font-bold text-[1.8rem]">308K+</span>
          </div>
          <div>
            <span className="text-[#374151] text-[14px]">During the last 90 days</span>
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex w-full items-center justify-start rounded-[8px] border border-[#ebecf0] bg-white p-[16px]">
        <div className="flex w-1/2 items-center space-x-1">
          <div>{seller_page_icons.greatSellerIcon}</div>
          <div className="font-bold text-[13px]">Great Recent Rating</div>
          <button aria-label="Seller help" className="gray-filter cursor-pointer">{seller_page_icons.helpIcon}</button>
        </div>
        <Separator className="mx-4 h-[100px] w-[1px]" />
        <div className="w-1/2 ">
          <span className="text-start text-[#374151] text-[14px]">
            Noon reviews these badges every day and sellers are awarded special badges based on their performence.
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex w-full flex-col items-start justify-center rounded-[8px] border border-[#ebecf0] bg-white p-[16px]">
        <div className="flex w-full items-center space-x-2">
          <div className="whitespace-nowrap text-[14px]">Product as Described</div>

          <div className="flex w-full items-center space-x-1">
            <Progress progressPercentage={90} className="h-[6px] bg-[#ebecf0]" />
            <div className="font-bold text-[#38AE04] text-[14px]">90%</div>
          </div>
        </div>
        <div className="mt-5 flex w-full items-center justify-between">
          <div className="text-[#7e859b]">What do these mean?</div>
          <button aria-label="Seller help" className="gray-filter cursor-pointer">{seller_page_icons.helpIcon}</button>
        </div>
      </div>

      <Separator className="my-5" />
      <div>
        <div className="text-[#7e859b] text-[14px]">Seller Since</div>
        <div className="font-bold text-[14px]">December, 2020</div>
      </div>
    </div>
  )
}
