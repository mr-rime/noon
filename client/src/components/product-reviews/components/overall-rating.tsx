import { Star } from 'lucide-react'
import { Progress } from '../../ui/progress'

interface OverallRatingProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number }
}

export function OverallRating({ averageRating, totalReviews, ratingDistribution }: OverallRatingProps) {
  const renderStars = (rating: number, size: number = 25) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} fill="#80AE04" color="#80AE04" size={size} />)
      } else if (i - rating < 1) {

        stars.push(<Star key={i} fill="#80AE04" color="#80AE04" size={size} />)
      } else {
        stars.push(<Star key={i} fill="none" color="#E5E7EB" size={size} />)
      }
    }
    return stars
  }

  return (
    <section className="min-w-[456px] max-w-[32%]">
      <div className="mb-2 font-bold text-[19px]">Overall Rating</div>

      <div className="font-bold text-[32px]">
        <span>{averageRating.toFixed(1)}</span>
      </div>
      <div className="my-1 flex items-center gap-1">
        {renderStars(averageRating)}
      </div>
      <div className="text-[#7e859b]">
        <span>Based on {totalReviews} ratings</span>
      </div>
      <div className="mt-3 mb-5 w-full ">
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage = ratingDistribution[rating as keyof typeof ratingDistribution]
          const getStarColor = (rating: number) => {
            switch (rating) {
              case 5:
                return '#008000'
              case 4:
                return '#80AE04'
              case 3:
                return '#F2AA31'
              case 2:
                return '#F36C31'
              case 1:
                return '#F36C31'
              default:
                return '#E5E7EB'
            }
          }
          const getProgressColor = (rating: number) => {
            switch (rating) {
              case 5:
                return '#008000'
              case 4:
                return '#82ae04'
              case 3:
                return '#F3AC30'
              case 2:
                return '#F36C32'
              case 1:
                return '#F36C32'
              default:
                return '#E5E7EB'
            }
          }

          return (
            <div key={rating} className="mt-2 flex w-full items-center space-x-1">
              <div className="flex items-center">
                <div className="mr-1 w-[8px] font-bold text-[14px]">
                  <span>{rating}</span>
                </div>
                <Star fill={getStarColor(rating)} color={getStarColor(rating)} size={15} />
              </div>
              <Progress
                progressPercentage={percentage}
                progressColor={getProgressColor(rating) as any}
              />
              <div className="ml-1 font-bold text-[14px]">
                <span>{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
