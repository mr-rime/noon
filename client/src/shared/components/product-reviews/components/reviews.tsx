
import { useEffect, useRef } from 'react'
import { ProductReview } from './review'
import type { ReviewItem } from './review'

interface ReviewsProps {
  reviews: ReviewItem[]
  total: number
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  isLoadingMore?: boolean
}

export function Reviews({ reviews, onLoadMore, hasMore, isLoadingMore }: ReviewsProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasMore || !onLoadMore) {
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore()
        }
      },
      {
        rootMargin: '200px'
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, onLoadMore])

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
      <div ref={sentinelRef} className="h-4" />
      {hasMore && (
        <div className="py-4 text-center text-sm text-gray-500">
          {isLoadingMore ? 'Loading more reviews…' : 'Scroll to load more reviews'}
        </div>
      )}
    </section>
  )
}
