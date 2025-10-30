import { useState } from 'react'
import { ImageSlider } from '../../../components/ui/image-slider'
import { ProductPageGallery } from './product-page-gallery'

type ProductPageImageProps = {
  images: string[]
}

export function ProductPageImage({ images }: ProductPageImageProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <div className="w-full md:w-[calc(300/1200*100%)] ">
      <ImageSlider
        images={images}
        mobileImages={images}
        autoPlay={false}
        showControls={false}
        height={500}
        showDots={true}
        showProductControls
        dotsTheme="theme3"
        activeIndex={activeIndex}
      />

      <div className="mt-7 hidden w-full md:block">
        <ProductPageGallery images={images} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </div>
    </div>
  )
}
