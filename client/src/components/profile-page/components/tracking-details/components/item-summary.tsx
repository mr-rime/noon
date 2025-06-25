import { Link } from "@tanstack/react-router";
import { tarcking_icons } from "../constants/icons";

export function ItemSummary() {
	return (
		<section className="mt-5 bg-white h-fit transition-all p-[16px] w-full">
			<h2 className="text-[19px] font-bold">Item summary</h2>

			<div className="flex items-start mt-5 space-x-4">
				<Link to="/$title/$productId" params={{ productId: "1", title: "" }}>
					<div className="max-w-[150px]">
						<img src="/media/imgs/product-img1.avif" alt="product-img1" className="w-full" />
					</div>
				</Link>
				<div>
					<p className="text-[14px]">
						QSHOP® Professional Video Photography Studio Kit for Smartphone and Camera with Microphone, LED Light,
						Starter Kit Compatible with YouTube TikTok for Content Creators
					</p>
					<span className="flex items-center space-x-1 mt-2 text-[#7e859b] text-[14px]">
						{tarcking_icons.returnableIcon}
						This item is returnable
					</span>

					<div className="text-[16px] font-bold mt-5 space-x-1">
						<span>EGP</span>
						<span>399.00</span>
					</div>
				</div>
			</div>
		</section>
	);
}
