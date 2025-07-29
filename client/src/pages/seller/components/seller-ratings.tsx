import { Star } from 'lucide-react'
import { Button } from '../../ui/button'
import { RatingsBar } from '../../ui/ratings-bar'
import { Separator } from '../../ui/separator'
import { SellerReview } from './seller-review'

export function SellerRatings() {
  return (
    <section className="max-w-[50%] flex-auto bg-white p-[36px_36px_16px]">
      <div className="font-bold text-[1.4rem]">Seller Ratings & Reviews</div>
      <div className="mt-5 flex w-full items-center gap-[10px_20px]">
        <div>
          <div className="font-bold text-[32px]">
            <span>4.3</span>
          </div>
          <div className="my-1 flex items-center gap-1">
            <Star fill="#80AE04" color="#80AE04" size={25} />
            <Star fill="#80AE04" color="#80AE04" size={25} />
            <Star fill="#80AE04" color="#80AE04" size={25} />
            <Star fill="#80AE04" color="#80AE04" size={25} />
            <Star fill="#80AE04" color="#80AE04" size={25} />
          </div>
          <div className="text-[#7e859b]">
            <span>Based on 169299 ratings</span>
          </div>
        </div>
        <div className="w-full max-w-[300px]">
          <RatingsBar />
        </div>
      </div>
      <div className="mt-[17px]">
        <Separator className="my-2" />
        <div className="text-[#9ba0b1] text-[14px]">There are 169299 ratings and 79576 reviews for this seller</div>
        <Separator className="my-2" />
      </div>

      <div className="flex flex-col items-start">
        <SellerReview />
        <SellerReview />
        <SellerReview />
        <Button className="mt-5 h-[32px] rounded-[4px] border border-[#3866df] bg-transparent px-[16px] font-bold text-[#3866df] text-[12px] hover:bg-transparent hover:opacity-[.8]">
          View All Reviews
        </Button>
      </div>
    </section>
  )
}
