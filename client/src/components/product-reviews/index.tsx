import { Separator } from "../ui/separator";
import { OverallRating } from "./components/overall-rating";
import { Reviews } from "./components/reviews";

export function ProductReviews() {
	return (
		<section id="porduct_reviews" className="site-container mt-10 min-h-[330px]">
			<div className="text-[24px] font-bold">Product Ratings & Reviews</div>
			<Separator className="my-5" />
			<section className="flex items-start">
				<OverallRating />
				<Separator className="bg-[#f3f4f8] min-h-[330px] h-auto w-[1px] rounded-full mx-10" />
				<Reviews />
			</section>
		</section>
	);
}
