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
		<main aria-label="Product Page" className="bg-white overflow-x-hidden mb-32 !scroll-smooth">
			<section
				aria-labelledby="product-main-section"
				className="site-container relative w-full flex flex-col lg:flex-row items-start justify-start pt-10 space-y-10 lg:space-y-0 lg:space-x-10 px-5 "
			>
				<div className="fixed flex items-center md:hidden  z-10 left-0 bottom-0  bg-white w-full py-2 px-2">
					<button className="w-[55px] h-[60px] p-[3px] bg-white px-[10px] border text-inherit border-[#f1f3f9] flex flex-col items-center justify-center">
						<span className="text-[1rem] text-[#8d94a7]">Qty</span>
						<span className="text-[1.5rem] font-bold text-inherit">1</span>
					</button>
					<Button className="bg-[#2B4CD7] hover:bg-[#6079E1] transition-colors text-white w-full h-[48px] rounded-[4px] cursor-pointer uppercase font-bold text-[14px]">
						Add to cart
					</Button>
				</div>
				<div className="mb-0 block md:hidden">
					<ProductPageTitle className="block md:hidden text-[18px]" title={data?.getProduct.product.name as string} />
					<div className="mt-6 mb-4 flex items-center justify-between w-full ">
						<ProductPageRates theme="mobile" />
						<AddToWishlistButton />
					</div>
				</div>
				<ProductPageImage images={data?.getProduct.product.images.map((image) => image.image_url) || [""]} />

				<div
					className="flex flex-col items-start justify-center w-full lg:w-[calc(500/1200*100%)]"
					aria-labelledby="product-info-section"
				>
					<ProductPageTitle className="hidden md:block" title={data?.getProduct.product?.name as string} />
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
