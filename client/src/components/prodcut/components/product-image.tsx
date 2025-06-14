import { ImageSlider } from "../../ui/image-slider";
import { ProductCartButton } from "./prodcut-cart-button";
import { ProductWishlistButton } from "./product-wishlist-button";

export function ProductImage() {
    return (
        <div
            className="relative w-full h-[316px] rounded-[12px] bg-[#F8F8F9]"
            aria-label="Product image section"
        >
            <div className="absolute right-2.5 top-2.5 z-10">
                <ProductWishlistButton />
            </div>

            <ImageSlider
                images={[
                    "/media/imgs/product-img1.avif",
                    "/media/imgs/product-img2.avif"
                ]}
                mobileImages={[
                    "/media/imgs/product-img1.avif",
                    "/media/imgs/product-img2.avif"
                ]}
                autoPlay={false}
                showDots={true}
                dotsTheme="theme3"
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
