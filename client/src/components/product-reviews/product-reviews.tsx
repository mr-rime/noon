import { useCallback } from 'react'
import { Separator } from '../ui/separator'
import { OverallRating } from './components/overall-rating'
import { Reviews } from './components/reviews'
import { NoReviews } from './components/no-reviews'
import { GET_PRODUCT_REVIEWS } from '@/graphql/review'
import { NetworkStatus, useQuery } from '@apollo/client'
import type { ReviewItem } from './components/review'

const REVIEWS_PAGE_SIZE = 10

interface ProductReviewsProps {
  productId: string
}

interface ProductReviewsResponse {
  getProductReviews?: {
    success: boolean
    message: string
    reviews: ReviewItem[]
    total: number
    average_rating: number
  }
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data, loading, error, fetchMore, networkStatus } = useQuery<ProductReviewsResponse>(GET_PRODUCT_REVIEWS, {
    variables: {
      productId,
      limit: REVIEWS_PAGE_SIZE,
      offset: 0
    },
    skip: !productId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  const reviewsData = data?.getProductReviews
  const reviews: ReviewItem[] = reviewsData?.reviews ?? []
  const total = reviewsData?.total ?? 0
  const averageRating = reviewsData?.average_rating ?? 0
  const hasReviews = total > 0
  const isLoadingMore = networkStatus === NetworkStatus.fetchMore
  const hasMoreReviews = reviews.length < total

  const loadMoreReviews = useCallback(async () => {
    if (!hasMoreReviews || isLoadingMore) {
      return
    }

    try {
      await fetchMore({
        variables: {
          productId,
          limit: REVIEWS_PAGE_SIZE,
          offset: reviews.length
        },
        updateQuery: (previousResult: ProductReviewsResponse, { fetchMoreResult }: { fetchMoreResult?: ProductReviewsResponse }) => {
          if (!fetchMoreResult?.getProductReviews) {
            return previousResult
          }

          if (!previousResult?.getProductReviews) {
            return fetchMoreResult
          }

          const previousReviews: ReviewItem[] = previousResult.getProductReviews.reviews ?? []
          const incomingReviews: ReviewItem[] = fetchMoreResult.getProductReviews.reviews ?? []

          const mergedReviews = [
            ...previousReviews,
            ...incomingReviews.filter(
              (incomingReview: ReviewItem) =>
                !previousReviews.some((prevReview: ReviewItem) => prevReview.id === incomingReview.id)
            )
          ]

          return {
            getProductReviews: {
              ...fetchMoreResult.getProductReviews,
              reviews: mergedReviews
            }
          }
        }
      })
    } catch (fetchMoreError) {
      console.error('Failed to load more reviews', fetchMoreError)
    }
  }, [fetchMore, hasMoreReviews, isLoadingMore, productId, reviews.length])

  if (loading && !reviews.length) {
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
              reviews={reviews}
              total={total}
              onLoadMore={loadMoreReviews}
              hasMore={hasMoreReviews}
              isLoadingMore={isLoadingMore}
            />
          </div>
          <section className="hidden items-start md:flex">
            <OverallRating
              averageRating={averageRating}
              totalReviews={total}
              ratingDistribution={calculateRatingDistribution(reviews)}
            />
            <Separator className="mx-10 h-auto min-h-[330px] w-[1px] rounded-full bg-[#f3f4f8]" />
            <Reviews
              reviews={reviews}
              total={total}
              onLoadMore={loadMoreReviews}
              hasMore={hasMoreReviews}
              isLoadingMore={isLoadingMore}
            />
          </section>
        </>
      )}
    </section>
  )
}


function calculateRatingDistribution(reviews: ReviewItem[]) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const total = reviews.length

  reviews.forEach((review) => {
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
