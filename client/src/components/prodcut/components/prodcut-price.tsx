import { ProductDiscount } from "./product-discount";

export function ProdcutPrice({ currency, price }: { currency: string; price: number }) {
	return (
		<div className="flex items-center space-x-1 mt-1">
			<span className="text-[12px] text-[#101010] font-normal uppercase">{currency}</span>
			<div className="flex items-center space-x-1">
				<strong className="text-[18px]">{price?.toFixed(2)}</strong>
				<ProductDiscount />
			</div>
		</div>
	);
}
