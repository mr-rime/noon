import { Star } from 'lucide-react'

export function ProductPageRates({ theme = 'desktop' }: { theme?: 'desktop' | 'mobile' }) {
  return theme === 'desktop' ? (
    <div className="mt-2 flex items-center space-x-2">
      <div className="font-semibold text-[14px]">4.6</div>

      <div className="flex items-center space-x-0.5">
        <Star fill="#008000" color="#008000" size={20} />
        <Star fill="#008000" color="#008000" size={20} />
        <Star fill="#008000" color="#008000" size={20} />
        <Star fill="#008000" color="#008000" size={20} />
        <Star fill="#008000" color="#008000" size={20} />
      </div>

      <div className="cursor-pointer space-x-[4px] font-semibold text-[#3866DF] text-[14px] underline">
        <span>18521 Ratings</span>
      </div>
    </div>
  ) : (
    <a
      href="#porduct_reviews"
      className="flex w-fit items-center justify-center space-x-2 rounded-[6px] bg-[#f3f4f8] px-[6px] py-[4px]">
      <div className="flex items-center space-x-1">
        <Star fill="#008000" color="#008000" size={14} />
        <div className="font-semibold text-[14px]">4.6</div>
      </div>
      <div className="text-[#9ba0b1] text-[14px]">
        <span>(20.6K)</span>
      </div>
    </a>
  )
}
