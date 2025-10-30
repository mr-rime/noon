import { Star } from 'lucide-react'
import { formatNumber } from '@/utils/format-number'
import type { ProductType } from '@/types'

export function ProductPageRates({
  theme = 'desktop',
  product
}: {
  theme?: 'desktop' | 'mobile'
  product?: ProductType
}) {
  const rating = product?.rating || 0
  const reviewCount = product?.review_count || 0
  const formattedReviewCount = formatNumber(reviewCount)


  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const scrollToReviews = () => {
    const el = document.getElementById('product_reviews')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return theme === 'desktop' ? (
    <div className="mt-2 flex items-center space-x-2">
      <div className="font-semibold text-[14px]">{rating.toFixed(1)}</div>

      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < filledStars ? "#008000" : index === filledStars && hasHalfStar ? "#008000" : "#E5E7EB"}
            color={index < filledStars ? "#008000" : index === filledStars && hasHalfStar ? "#008000" : "#E5E7EB"}
            size={20}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={scrollToReviews}
        className="cursor-pointer space-x-[4px] font-semibold text-[#3866DF] text-[14px] underline focus:outline-none">
        <span>{formattedReviewCount} Ratings</span>
      </button>
    </div>
  ) : (
    <a
      href="#product_reviews"
      className="flex w-fit items-center justify-center space-x-2 rounded-[6px] bg-[#f3f4f8] px-[6px] py-[4px]">
      <div className="flex items-center space-x-1">
        <Star fill="#008000" color="#008000" size={14} />
        <div className="font-semibold text-[14px]">{rating.toFixed(1)}</div>
      </div>
      <div className="text-[#9ba0b1] text-[14px]">
        <span>({formattedReviewCount})</span>
      </div>
    </a>
  )
}
