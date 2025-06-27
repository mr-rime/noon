import { useQuery } from "@apollo/client";
import { useParams } from "@tanstack/react-router";
import { GET_PRODUCT } from "@/graphql/product";
import type { ProductSpecification, ProductType } from "@/types";
import { ProductReviews } from "../product-reviews";
import { Separator } from "../ui/separator";
import { ProductOverview } from "./components/product-overview";
import { ProductOverviewTabs } from "./components/product-overview-tabs";
import { ProductPageDetails } from "./components/product-page-details";
import { ProductPageFulfilmentBadge } from "./components/product-page-fulfilment-badge";
import { ProductPageImage } from "./components/product-page-image";
import { ProductOption } from "./components/product-page-options";
import { ProdcutPagePrice } from "./components/product-page-price";
import { ProductPageRates } from "./components/product-page-rates";
import { ProductPageTitle } from "./components/product-page-title";
import { getMergedOptions } from "./utils/get-merged-options";
import { Button } from "../ui/button";
import { AddToWishlistButton } from "./components/add-to-wishlist-button";

export function ProductPage() {
	const { productId } = useParams({
		from: "/(main)/_homeLayout/$title/$productId/",
	});
	const { data } = useQuery<{
		getProduct: {
			success: boolean;
			message: string;
			product: ProductType;
		};
	}>(GET_PRODUCT, { variables: { id: productId } });

	return (
		<main aria-label="Product Page" className="bg-white overflow-x-hidden">
			<section
				aria-labelledby="product-main-section"
				className="site-container relative w-full flex flex-col lg:flex-row items-start justify-start pt-10 space-y-10 lg:space-y-0 lg:space-x-10 px-5 "
			>

				<ProductPageImage images={data?.getProduct.product.images.map((image) => image.image_url) || [""]} />

				<div
					className="flex flex-col items-start justify-center w-full lg:w-[calc(500/1200*100%)]"
					aria-labelledby="product-info-section"
				>
					<ProductPageTitle className="hidden md:block" title={data?.getProduct.product.name as string} />
					<div className="hidden md:block">
						<ProductPageRates />
					</div>
					<ProdcutPagePrice
						price={data?.getProduct.product.price as number}
						currency={data?.getProduct.product.currency as string}
						discount_percentage={data?.getProduct.product.discount_percentage}
						final_price={data?.getProduct.product.final_price}
					/>
					<ProductPageFulfilmentBadge />
					<Separator className="my-5" />
					<div className="flex flex-col items-start justify-center space-y-5">
						{getMergedOptions(data?.getProduct.product.productOptions || []).map((option) => (
							<ProductOption key={option.name} name={option.name} values={option.values} />
						))}
					</div>
				</div>
				<div className="flex flex-col  md:hidden items-start justify-center w-full">
					<div className="w-full">
						<ProductPageDetails theme="mobile" />
					</div>
				</div>
				<div className="max-md:hidden">
					<ProductPageDetails />
				</div>

			</section>
			<section id="porduct_overview">
				<Separator className="h-[9px] mt-16 mb-5 bg-[#F3F4F8]" />
				<ProductOverviewTabs />
			</section>
			<section className="mt-10 site-container">
				<ProductOverview
					overview={data?.getProduct.product.product_overview as string}
					specs={data?.getProduct.product.productSpecifications as ProductSpecification[]}
				/>
			</section>

			<Separator className="h-[9px] mt-20 mb-5 bg-[#F3F4F8]" />
			<ProductReviews />
		</main>
	);
}
