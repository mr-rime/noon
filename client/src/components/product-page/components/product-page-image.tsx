import { ImageSlider } from "../../ui/image-slider";
import { ProductPageGallery } from "./product-page-gallery";

type ProductPageImageProps = {
	images: string[];
};

export function ProductPageImage({ images }: ProductPageImageProps) {
	return (
		<div className="w-[calc(300/1200*100%)]">
			<ImageSlider
				height={480}
				images={images}
				mobileImages={images}
				showProductControls
				autoPlay={false}
				showControls={false}
				showDots={false}
			/>

			<div className="w-full mt-7">
				<ProductPageGallery images={images} />
			</div>
		</div>
	);
}
