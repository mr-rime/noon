import { useState } from 'react'
import { reviews_icons } from '../constants/icons'
import { cn } from '@/utils/cn'
import { Check, Star } from 'lucide-react'

const CONTENT = `I recently purchased the iPhone 16 Pro Max, and I couldn't be more pleased with my experience. I got it at an
				amazing discounted price, which made the deal even sweeter. The delivery was super fast, and everything arrived in
				perfect condition, right on time. The product itself is original and feels premium as expected from Apple, with
				all the latest features and a stunning display. Overall, I'm really satisfied with my purchase—great value for
				money, excellent service, and a top-quality device. Highly recommend!`

export function ProductReview() {
  const [helpful, setHelpful] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const shortedContent = showMore ? CONTENT.slice(0) : CONTENT.slice(0, 250)

  return (
    <div className="break-words border-[#f3f4f8] border-b py-[24px]">
      <div className="mb-[8px] flex flex-row items-start gap-x-[8px] gap-y-[4px]">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eff3fd] font-bold text-[#9ba0b1] uppercase">
          M
        </div>
        <div className="flex w-full flex-col gap-[2px]">
          <div className="flex w-full items-center justify-between">
            <div>
              <div>Ahmed H.</div>
              <div className="text-[#9ba0b1] text-[12px]">Nov 26, 2024</div>
            </div>
            <div className="flex h-[20px] items-center gap-[4px] rounded-full bg-[#f3f4f8] px-[5px] text-[12px] ">
              {reviews_icons.verifiedIcon}
              <span>Verified Purchase</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 mb-3 flex items-center gap-[3px]">
        <Star color="#008000" fill="#008000" size={16} />
        <Star color="#008000" fill="#008000" size={16} />
        <Star color="#008000" fill="#008000" size={16} />
        <Star color="#008000" fill="#008000" size={16} />
        <Star color="#008000" fill="#008000" size={16} />
      </div>

      <div className="w-full break-words font-bold text-[16px]">
        Fantastic Deal on iPhone 16 Pro Max: Fast Delivery, Great Price, and Top-Notch Quality!
      </div>
      <div className="flex items-end pr-[45px]">
        <div className={cn('relative mt-1 w-full break-words text-[16px] leading-[1.5em]')}>
          {shortedContent}
          {showMore ? (
            <button onClick={() => setShowMore(false)} className="ml-2 font-bold text-[#3866df] text-[16px]">
              Less
            </button>
          ) : (
            <span
              style={{ background: 'linear-gradient(to left, rgb(255, 255, 255), rgba(255, 255, 255, 0) 100%)' }}
              className="absolute ml-[-54px] w-[100px] text-right">
              <button onClick={() => setShowMore(true)} className="font-bold text-[#3866df] text-[16px]">
                ...More
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-[4px]">
        <button
          onClick={() => setHelpful((prev) => !prev)}
          className={cn(
            'flex cursor-pointer items-center gap-[4px] rounded-[4px] border px-[5px] py-[2px] ',
            helpful ? 'border-[#3866df] text-[#3866df]' : 'border-[#7e859b] text-[#7e859b]',
          )}>
          {reviews_icons.helpfulIcon}

          <span className="text-[14px]">{helpful ? '' : 'Helpful'} (30)</span>
        </button>

        {helpful && (
          <div className="ml-2 flex items-center gap-[3px]">
            <Check color="#50B823" size={18} /> <span>Thanks for voting!</span>
          </div>
        )}
      </div>
    </div>
  )
}
