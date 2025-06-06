import { Separator } from "../ui/separator";
import { ProductPageFulfilmentBadge } from "./components/product-page-fulfilment-badge";
import { ProductPageGallery } from "./components/product-page-gallery";
import { ProductPageImage } from "./components/product-page-image";
import { ProductOption } from "./components/product-page-options";
import { ProdcutPagePrice } from "./components/product-page-price";
import { ProductPageRates } from "./components/product-page-rates";
import { ProductPageTitle } from "./components/product-page-title";

export default function ProductPage() {
    return (
        <div className="w-full flex items-start justify-start mt-20 space-x-10">
            <ProductPageImage gallery={<ProductPageGallery />} />
            <div className="flex flex-col items-start justify-center w-[calc(500/1200*100%)]">
                <ProductPageTitle>
                    <ProductPageRates />
                    <ProdcutPagePrice />
                    <ProductPageFulfilmentBadge />
                </ProductPageTitle>
                <Separator className="my-5" />
                <ProductOption />
            </div>
        </div >

    )
}
