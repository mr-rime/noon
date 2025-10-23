import { Separator } from '../ui/separator'
import { OverallRating } from './components/overall-rating'
import { Reviews } from './components/reviews'
import { NoReviews } from './components/no-reviews'
import { GET_PRODUCT_REVIEWS } from '@/graphql/review'
import { useQuery } from '@apollo/client'

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data, loading, error } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: {
      productId,
      limit: 10,
      offset: 0
    },
    skip: !productId,
    fetchPolicy: 'cache-and-network'
  })

  if (loading) {
    return (
      <section id="product_reviews" className="site-container mt-10 min-h-[330px] overflow-x-hidden p-5">
        <div className="font-bold text-[24px]">Product Ratings & Reviews</div>
        <Separator className="my-5" />
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading reviews...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="product_reviews" className="site-container mt-10 min-h-[330px] overflow-x-hidden p-5">
        <div className="font-bold text-[24px]">Product Ratings & Reviews</div>
        <Separator className="my-5" />
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading reviews</div>
        </div>
      </section>
    )
  }

  const reviewsData = data?.getProductReviews
  const hasReviews = reviewsData?.reviews?.length > 0


  return (
    <section id="product_reviews" className="site-container mt-10 min-h-[330px] overflow-x-hidden p-5">
      <div className="font-bold text-[24px]">Product Ratings & Reviews</div>
      <Separator className="my-5" />

      {!hasReviews ? (
        <NoReviews />
      ) : (
        <>
          <div className="block md:hidden">
            <Reviews
              reviews={reviewsData.reviews}
              total={reviewsData.total}
            />
          </div>
          <section className="hidden items-start md:flex">
            <OverallRating
              averageRating={reviewsData.average_rating}
              totalReviews={reviewsData.total}
              ratingDistribution={calculateRatingDistribution(reviewsData.reviews)}
            />
            <Separator className="mx-10 h-auto min-h-[330px] w-[1px] rounded-full bg-[#f3f4f8]" />
            <Reviews
              reviews={reviewsData.reviews}
              total={reviewsData.total}
            />
          </section>
        </>
      )}
    </section>
  )
}


function calculateRatingDistribution(reviews: any[]) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const total = reviews.length

  reviews.forEach(review => {
    const rating = parseInt(review.rating.toString()) as keyof typeof distribution
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++
    }
  })


  return Object.keys(distribution).reduce((acc, rating) => {
    const ratingNum = parseInt(rating) as keyof typeof distribution
    acc[ratingNum] = total > 0 ? Math.round((distribution[ratingNum] / total) * 100) : 0
    return acc
  }, {} as typeof distribution)
}
