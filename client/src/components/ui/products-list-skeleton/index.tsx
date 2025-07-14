import { ProductSkeleton } from "@/components/product/components/product-skeleton";

export function ProductsListSkeleton() {
	return (
		<div className="flex w-full overflow-hidden items-center gap-[16px] ">
			{Array.from({ length: 5 }).map((_, idx) => (
				<ProductSkeleton key={idx} />
			))}
		</div>
	);
}
