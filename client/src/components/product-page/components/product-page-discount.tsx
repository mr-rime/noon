import type { ProductType } from "@/types";

export function ProductPageDiscount({
	currency,
	price,
	discount_percentage,
}: Pick<ProductType, "currency" | "price" | "discount_percentage">) {
	return (
		<div aria-label="Product discount information" className="flex items-center space-x-1">
			<span aria-label="Discounted price" className="text-[#7e859b] text-[14px] line-through">
				<span className="text-[15px]">{currency}</span> {price}
			</span>
			<span aria-label="Discount percentage" className="text-[#298A08] font-bold text-[14px]">
				{discount_percentage}% <span>Off</span>
			</span>
		</div>
	);
}
