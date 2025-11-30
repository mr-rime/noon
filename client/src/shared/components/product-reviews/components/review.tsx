import { useState, useEffect } from 'react'
import { reviews_icons } from '../constants/icons'
import { cn } from '@/shared/utils/cn'
import { Check, Star } from 'lucide-react'
import { VOTE_REVIEW_HELPFUL, REMOVE_REVIEW_VOTE } from '@/features/product/api/review'
import { useMutation } from '@apollo/client'
import { toast } from 'sonner'

export interface ReviewItem {
  id: number
  rating: number
  title?: string
  comment: string
  created_at: string
  verified_purchase: boolean
  user: {
    first_name: string
    last_name: string
  }
  helpful_votes_count: number
  user_has_voted: boolean
}

interface ProductReviewProps {
  review: ReviewItem
}

export function ProductReview({ review }: ProductReviewProps) {
  const [helpful, setHelpful] = useState(review.user_has_voted || false)
  const [showMore, setShowMore] = useState(false)
  const [votesCount, setVotesCount] = useState(review.helpful_votes_count || 0)
  const [isVoting, setIsVoting] = useState(false)


  useEffect(() => {
    setHelpful(review.user_has_voted || false)
    setVotesCount(review.helpful_votes_count || 0)
  }, [review.id, review.user_has_voted, review.helpful_votes_count])

  const [voteHelpful] = useMutation(VOTE_REVIEW_HELPFUL)
  const [removeVote] = useMutation(REMOVE_REVIEW_VOTE)

  const shortedContent = showMore ? review.comment : review.comment.slice(0, 250)

  const handleHelpfulClick = async () => {
    if (isVoting) return

    setIsVoting(true)
    try {
      if (helpful) {

        const result = await removeVote({
          variables: { reviewId: review.id }
        })

        if (result.data?.removeReviewVote?.success) {
          setHelpful(false)
          setVotesCount(result.data.removeReviewVote.votesCount)
        } else {
          console.error('Failed to remove vote:', result.data?.removeReviewVote?.message)
        }
      } else {

        const result = await voteHelpful({
          variables: { reviewId: review.id }
        })

        if (result.data?.voteReviewHelpful?.success) {
          setHelpful(true)
          setVotesCount(result.data.voteReviewHelpful.votesCount)
        } else {
          console.error('Failed to add vote:', result.data?.voteReviewHelpful?.message)


          if (result.data?.voteReviewHelpful?.message?.includes('already voted')) {
            console.log('Syncing state with backend - user has already voted')
            setHelpful(true)
            setVotesCount(result.data.voteReviewHelpful.votesCount)
          }
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} color="#008000" fill="#008000" size={16} />)
      } else {
        stars.push(<Star key={i} color="#E5E7EB" fill="none" size={16} />)
      }
    }
    return stars
  }

  return (
    <div className="break-words border-[#f3f4f8] border-b py-[24px]">
      <div className="mb-[8px] flex flex-row items-start gap-x-[8px] gap-y-[4px]">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eff3fd] font-bold text-[#374151] uppercase">
          {getUserInitials(review.user.first_name, review.user.last_name)}
        </div>
        <div className="flex w-full flex-col gap-[2px]">
          <div className="flex w-full items-center justify-between">
            <div>
              <div>{review.user.first_name} {review.user.last_name.charAt(0)}.</div>
              <div className="text-[#374151] text-[12px]">{formatDate(review.created_at)}</div>
            </div>
            {review.verified_purchase && (
              <div className="flex h-[20px] items-center gap-[4px] rounded-full bg-[#f3f4f8] px-[5px] text-[12px] ">
                {reviews_icons.verifiedIcon}
                <span>Verified Purchase</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-1 mb-3 flex items-center gap-[3px]">
        {renderStars(review.rating)}
      </div>

      {review.title && (
        <div className="mb-2">
          <h4 className="font-semibold text-[16px] text-gray-900">{review.title}</h4>
        </div>
      )}

      {review.comment && (
        <div className="flex items-end pr-[45px]">
          <div className={cn('relative mt-1 w-full break-words text-[16px] leading-[1.5em]')}>
            {shortedContent}
            {review.comment.length > 250 && (
              showMore ? (
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
              )
            )}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-[4px]">
        <button
          onClick={handleHelpfulClick}
          disabled={isVoting}
          className={cn(
            'flex cursor-pointer items-center gap-[4px] rounded-[4px] border px-[5px] py-[2px] transition-colors',
            helpful
              ? 'border-[#3866df] bg-[#3866df] text-white'
              : 'border-[#374151] text-[#374151] hover:border-[#3866df] hover:text-[#3866df]',
            isVoting && 'opacity-50 cursor-not-allowed'
          )}>
          {reviews_icons.helpfulIcon}

          <span className="text-[14px]">{helpful ? '' : 'Helpful'} ({votesCount})</span>
        </button>

        {helpful && (
          <div className="ml-2 flex items-center gap-[3px] text-[#50B823]">
            <Check color="#50B823" size={18} />
            <span className="text-[14px]">Thanks for voting!</span>
          </div>
        )}
      </div>
    </div>
  )
}
