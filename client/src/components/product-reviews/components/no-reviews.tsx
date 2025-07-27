import { Separator } from '../../ui/separator'
import { reviews_icons } from '../constants/icons'

export function NoReviews() {
  return (
    <section className="p-5">
      <div className="flex items-center space-x-5">
        <div>
          <h2 className="mb-4 flex min-w-[300px] items-center font-bold text-[16.8px]">
            <div className="mr-2">{reviews_icons.yellowStar}</div>
            How do I review this product?
          </h2>
          <p className="max-w-[400px] text-[14px]">
            If you recently purchased this product from noon, you can go to your Orders page and click on the Submit
            Review button
          </p>
        </div>

        <div>
          <h2 className="mb-4 flex min-w-[300px] items-center font-bold text-[16.8px]">
            <div className="mr-2">{reviews_icons.noonIcon}</div>
            Where do the reviews come from?
          </h2>
          <p className="max-w-[400px] text-[14px]">
            Our reviews are from noon customers who purchased the product and submitted a review
          </p>
        </div>
      </div>
      <Separator className="my-7" />
      <div className="flex w-full flex-col items-center justify-center">
        <div className="scale-[80%]">{reviews_icons.noReviewsFound}</div>
        <p className="mt-5 text-[#7e859b] text-[14px]">This product doesn't have any reviews yet.</p>
      </div>
    </section>
  )
}
