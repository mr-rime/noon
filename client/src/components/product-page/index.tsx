import { ProductPageGallery } from "./components/product-page-gallery";
import { ProductPageImage } from "./components/product-page-image";
import { ProductPageTitle } from "./components/product-page-title";

export default function ProductPage() {
    return (
        <div className="w-full flex items-start justify-start mt-20">
            <ProductPageImage gallery={<ProductPageGallery />} />
            <ProductPageTitle />
        </div>
    )
}
