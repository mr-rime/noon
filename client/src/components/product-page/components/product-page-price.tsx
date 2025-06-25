import { ProductPageDiscount } from "./product-page-discount";

export function ProdcutPagePrice({ price, currency }: { price: number; currency: string }) {
	return (
		<div className="flex items-center space-x-1 mt-6">
			<span className="text-[16px] text-[#101010] font-semibold">{currency}</span>
			<div className="flex items-center space-x-1">
				<strong className="text-[24px] text-[#1d2939]">{price?.toFixed(2)}</strong>
				<ProductPageDiscount />
			</div>
		</div>
	);
}
