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

	console.log(data?.getProduct.product.productOptions);
	return (
		<main aria-label="Product Page" className="bg-white">
			<section
				aria-labelledby="product-main-section"
				className="site-container w-full flex flex-col lg:flex-row items-start justify-start pt-10 space-y-10 lg:space-y-0 lg:space-x-10 "
			>
				<h1 id="product-main-section" className="sr-only">
					Product Main Section
				</h1>

				<ProductPageImage images={data?.getProduct.product.images.map((image) => image.image_url) || [""]} />

				<div
					className="flex flex-col items-start justify-center w-full lg:w-[calc(500/1200*100%)]"
					aria-labelledby="product-info-section"
				>
					<h2 id="product-info-section" className="sr-only">
						Product Information
					</h2>

					<ProductPageTitle title={data?.getProduct.product.name as string}>
						<ProductPageRates />
						<ProdcutPagePrice
							price={data?.getProduct.product.price as number}
							currency={data?.getProduct.product.currency as string}
						/>
						<ProductPageFulfilmentBadge />
					</ProductPageTitle>

					<Separator className="my-5" />
					<div className="flex flex-col items-start justify-center space-y-5">
						{data?.getProduct.product.productOptions.map((option) => (
							<ProductOption key={option.id} {...option} />
						))}
					</div>
				</div>

				<ProductPageDetails />
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
