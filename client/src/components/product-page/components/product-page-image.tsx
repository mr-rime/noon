import { ImageSlider } from '../../ui/image-slider'
import { ProductPageGallery } from './product-page-gallery'

type ProductPageImageProps = {
  images: string[]
}

export function ProductPageImage({ images }: ProductPageImageProps) {
  return (
    <div className="w-full md:w-[calc(300/1200*100%)]">
      <ImageSlider
        images={images}
        mobileImages={images}
        autoPlay={false}
        showControls={false}
        showDots={true}
        showProductControls
        dotsTheme="theme3"
      />

      <div className="mt-7 hidden w-full md:block">
        <ProductPageGallery images={images} />
      </div>
    </div>
  )
}
