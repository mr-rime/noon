import { ProductPageGallery } from "./components/product-page-gallery";
import { ProductPageImage } from "./components/product-page-image";

export default function ProductPage() {
    return (
        <div className="w-full flex items-center justify-start mt-20">
            <ProductPageImage gallery={<ProductPageGallery />} />
        </div>
    )
}
