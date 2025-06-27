import { ImageSlider } from "../../ui/image-slider";
import { ProductPageGallery } from "./product-page-gallery";

type ProductPageImageProps = {
	images: string[];
};

export function ProductPageImage({ images }: ProductPageImageProps) {
	return (
		<div className="md:w-[calc(300/1200*100%)]  w-full">
			<ImageSlider
				images={images}
				mobileImages={images}
				autoPlay={false}
				showControls={false}
				showDots={true}
				showProductControls
				dotsTheme="theme3"
			/>

			<div className="w-full mt-7 hidden md:block">
				<ProductPageGallery images={images} />
			</div>
		</div>
	);
}
