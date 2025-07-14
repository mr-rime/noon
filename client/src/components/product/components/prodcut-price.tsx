import type { ProductType } from "@/types";
import { ProductDiscount } from "./product-discount";

export function ProdcutPrice({
	currency,
	price,
	discount_percentage,
	final_price,
}: Pick<ProductType, "currency" | "price" | "discount_percentage" | "final_price">) {
	return (
		<div className="flex items-center space-x-1 mt-1">
			<span className="text-[12px] text-[#101010] font-normal uppercase">{currency}</span>
			<div className="flex items-center space-x-1">
				<strong className="text-[18px]">{final_price?.toFixed(2)}</strong>
				{final_price !== price && <ProductDiscount price={price} discount_percentage={discount_percentage} />}
			</div>
		</div>
	);
}
