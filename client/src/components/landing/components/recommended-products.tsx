import { useQuery } from "@apollo/client";
import { Product } from "@/components/product";
import { Carousel } from "@/components/ui/carousel";
import { ProductsListSkeleton } from "@/components/ui/products-list-skeleton";
import type { ProductType } from "@/types";
import { GET_HOME } from "@/graphql/home";

export default function RecommendedProducts() {
	const { data, loading } = useQuery<{
		getHome: {
			success: boolean;
			message: string;
			home: {
				recommendedForYou: ProductType[];
			};
		};
	}>(GET_HOME, { variables: { limit: 10, offset: 0, search: "" } });

	return (
		<div className="bg-white w-full flex items-center p-4 min-h-[200px]">
			<div className="w-full">
				{loading ? (
					<ProductsListSkeleton />
				) : (
					<Carousel
						className="w-full"
						controlClassName="flex items-center justify-center bg-white cursor-pointer w-[30px] h-[30px] shadow-[0_0_3px_-1px_rgba(0,0,0,.5)] border border-[#ccc]  "
					>
						{data?.getHome.home?.recommendedForYou.map((product) => (
							<Product key={product.id} {...product} />
						))}
					</Carousel>
				)}
			</div>
		</div>
	);
}
