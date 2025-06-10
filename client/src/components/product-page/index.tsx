import { ProductReviews } from "../product-reviews";
import { Separator } from "../ui/separator";
import { ProductOverview } from "./components/product-overview";
import { ProductOverviewTabs } from "./components/product-overview-tabs";
import { ProductPageDetails } from "./components/product-page-details";
import { ProductPageFulfilmentBadge } from "./components/product-page-fulfilment-badge";
import { ProductPageGallery } from "./components/product-page-gallery";
import { ProductPageImage } from "./components/product-page-image";
import { ProductOption } from "./components/product-page-options";
import { ProdcutPagePrice } from "./components/product-page-price";
import { ProductPageRates } from "./components/product-page-rates";
import { ProductPageTitle } from "./components/product-page-title";

export default function ProductPage() {
    return (
        <main aria-label="Product Page" className="bg-white">
            <section
                aria-labelledby="product-main-section"
                className="site-container w-full flex flex-col lg:flex-row items-start justify-start pt-10 space-y-10 lg:space-y-0 lg:space-x-10 "
            >
                <h1 id="product-main-section" className="sr-only">
                    Product Main Section
                </h1>

                <ProductPageImage gallery={<ProductPageGallery />} />

                <div
                    className="flex flex-col items-start justify-center w-full lg:w-[calc(500/1200*100%)]"
                    aria-labelledby="product-info-section"
                >
                    <h2 id="product-info-section" className="sr-only">
                        Product Information
                    </h2>

                    <ProductPageTitle>
                        <ProductPageRates />
                        <ProdcutPagePrice />
                        <ProductPageFulfilmentBadge />
                    </ProductPageTitle>

                    <Separator className="my-5" />
                    <ProductOption />
                </div>

                <ProductPageDetails />
            </section>
            <section id="porduct_overview">
                <Separator className="h-[9px] mt-16 mb-5 bg-[#F3F4F8]" />
                <ProductOverviewTabs />
            </section>
            <section className="mt-10 site-container">
                <ProductOverview />
            </section>

            <Separator className="h-[9px] mt-20 mb-5 bg-[#F3F4F8]" />
            <ProductReviews />
        </main>
    );
}
