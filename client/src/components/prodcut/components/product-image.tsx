import { ImageSlider } from "../../ui/image-slider";
import { ProductCartButton } from "./prodcut-cart-button";
import { ProductWishlistButton } from "./product-wishlist-button";

export function ProductImage({ images }: { images: string[] }) {
    return (
        <div
            className="relative w-full h-[316px] rounded-[12px] overflow-hidden bg-[#F8F8F9]"
            aria-label="Product image section"
        >
            <div className="absolute right-2.5 top-2.5 z-10">
                <ProductWishlistButton />
            </div>

            <ImageSlider
                images={images}
                mobileImages={images}
                autoPlay={false}
                showDots={true}
                dotsTheme="theme2"
                showControls={false}
                showProductControls={true}
                showProductDots={true}
                scaleOnHover={true}
                height={330}
                disableDrag
            />

            <div className="absolute right-2.5 bottom-2.5 z-10">
                <ProductCartButton />
            </div>
        </div >
    );
}
