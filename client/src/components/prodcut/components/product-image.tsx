import { ImageSlider } from "../../ui/image-slider";
import { ProductCartButton } from "./prodcut-cart-button";
import { ProductWishlistButton } from "./product-wishlist-button";

export function ProductImage({ images }: { images: string[] }) {
	return (
		<div className="relative w-full rounded-[12px] min-h-[200px]  bg-[#F6F6F7]" aria-label="Product image section">
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
				disableDragDesktop={true}
			/>

			<div className="absolute right-2.5 bottom-2.5 z-10">
				<ProductCartButton />
			</div>
		</div>
	);
}
