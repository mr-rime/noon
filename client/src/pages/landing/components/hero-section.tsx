import { ImageSlider } from '@/components/ui/image-slider'
import { SlideableImages } from './slideable-images'

const images = [
  '/media/imgs/slideable-img1.avif',
  '/media/imgs/slideable-img2.avif',
  '/media/imgs/slideable-img3.avif',
  '/media/imgs/slideable-img7.avif',
]

const mobileImages = [
  '/media/imgs/slideable-img4.avif',
  '/media/imgs/slideable-img5.avif',
  '/media/imgs/slideable-img6.avif',
]

export default function HeroSection() {
  return (
    <div className="m-auto mt-10 mb-5 flex h-fit w-full max-w-[1500px] items-center justify-center overflow-hidden px-4">
      <SlideableImages>
        <ImageSlider
          images={images}
          mobileImages={mobileImages}
          autoPlay={true}
          autoPlayInterval={3000}
          height={350}
          showControls={true}
          showDots={true}
        />
      </SlideableImages>
    </div>
  )
}
