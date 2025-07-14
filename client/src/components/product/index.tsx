import { Link } from "@tanstack/react-router";
import type { ProductType } from "@/types";
import { ProdcutPrice } from "./components/prodcut-price";
import { ProductBadge } from "./components/product-badge";
import { ProductImage } from "./components/product-image";
import { ProductTitle } from "./components/product-title";
import { Star } from "lucide-react";

export function Product({ id, name, images, currency, price, discount_percentage, final_price }: ProductType) {
	return (
		<article className="w-full select-none max-w-[230px] h-[467px] rounded-[12px] border border-[#DDDDDD] p-2 overflow-x-hidden bg-white">
			<Link
				to="/$title/$productId"
				params={{ productId: id, title: name.replace(/\s+/g, "-") }}
				className="w-full h-full"
				preload="intent"
			>
				<ProductImage images={images?.map((img) => img.image_url)} />
				<ProductTitle name={name} />
				<div className="flex items-center justify-center w-fit space-x-2 my-2 bg-[#f3f4f8] py-[4px] px-[6px] rounded-[6px]">
					<div className="flex items-center space-x-1">
						<Star fill="#008000" color="#008000" size={14} />
						<div className="font-semibold text-[13px]">4.6</div>
					</div>
					<div className="text-[#9ba0b1] text-[13px]">
						<span>(20.6K)</span>
					</div>
				</div>
				<ProdcutPrice
					price={price}
					currency={currency}
					final_price={final_price}
					discount_percentage={discount_percentage}
				/>
				<ProductBadge />
			</Link>
		</article>
	);
}
