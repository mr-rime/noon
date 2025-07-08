import type { ProductType } from "@/types";
import { ProductPageDiscount } from "./product-page-discount";

export function ProdcutPagePrice({
	price,
	currency,
	discount_percentage,
	final_price,
}: Pick<ProductType, "currency" | "final_price" | "price" | "discount_percentage">) {
	return (
		<div className=" mt-6">
			<div className="flex max-md:flex-col items-center space-x-1">
				<div className="flex items-center space-x-1">
					<span className="text-[18px] md:text-[16px] md:text-[#101010] font-semibold">{currency}</span>
					<strong className="text-[18px] md:text-[24px] md:text-[#1d2939]">{final_price?.toFixed(2)}</strong>
				</div>
				{/* {final_price !== price && ( */}
				<ProductPageDiscount discount_percentage={discount_percentage} currency={currency} price={price} />
				{/* )} */}
			</div>
		</div>
	);
}
