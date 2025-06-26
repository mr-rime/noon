import type { ProductType } from "@/types";
import { ProductPageDiscount } from "./product-page-discount";

export function ProdcutPagePrice({
	price,
	currency,
	discount_percentage,
	final_price,
}: Pick<ProductType, "currency" | "final_price" | "price" | "discount_percentage">) {
	return (
		<div className="flex items-center space-x-1 mt-6">
			<span className="text-[16px] text-[#101010] font-semibold">{currency}</span>
			<div className="flex items-center space-x-1">
				<strong className="text-[24px] text-[#1d2939]">{final_price?.toFixed(2)}</strong>
				{final_price !== price && (
					<ProductPageDiscount discount_percentage={discount_percentage} currency={currency} price={price} />
				)}
			</div>
		</div>
	);
}
