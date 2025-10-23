
import { ProductReview } from './review'

interface ReviewsProps {
  reviews: any[]
  total: number
}

export function Reviews({ reviews }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="w-full md:min-w-[456px] md:max-w-[68%]">
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full md:min-w-[456px] md:max-w-[68%]">
      {reviews.map((review) => (
        <ProductReview
          key={`${review.id}-${review.user_has_voted}-${review.helpful_votes_count}`}
          review={review}
        />
      ))}
    </section>
  )
}
