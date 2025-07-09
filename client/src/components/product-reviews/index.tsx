import { Separator } from "../ui/separator";
import { OverallRating } from "./components/overall-rating";
import { Reviews } from "./components/reviews";

export function ProductReviews() {
	return (
		<section id="porduct_reviews" className="site-container mt-10 min-h-[330px] p-5 overflow-x-hidden">
			<div className="text-[24px] font-bold">Product Ratings & Reviews</div>
			<Separator className="my-5" />

			{/* <div>
				<div className="text-[32px] font-bold">
					<span>4.2</span>
				</div>
				<div className="my-1 flex items-center gap-1">
					<Star fill="#80AE04" color="#80AE04" size={25} />
					<Star fill="#80AE04" color="#80AE04" size={25} />
					<Star fill="#80AE04" color="#80AE04" size={25} />
					<Star fill="#80AE04" color="#80AE04" size={25} />
					<Star fill="#80AE04" color="#80AE04" size={25} />
				</div>
				<div className="text-[#7e859b]">
					<span>Based on 22 ratings</span>
				</div>
			</div> */}
			<div className="block md:hidden">
				<Reviews />
			</div>
			<section className="items-start hidden md:flex">
				<OverallRating />
				<Separator className="bg-[#f3f4f8] min-h-[330px] h-auto w-[1px] rounded-full mx-10" />
				<Reviews />
			</section>
		</section>
	);
}
