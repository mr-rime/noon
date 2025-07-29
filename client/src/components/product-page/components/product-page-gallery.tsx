import { Image } from '@unpic/react'
import { Carousel } from '../../ui/carousel'

type ProductPageGalleryProps = {
  images?: string[]
}

type GalleryItemProps = {
  imgUrl: string
}

export function ProductPageGallery({ images }: ProductPageGalleryProps) {
  return (
    <Carousel showControls controlClassName="" itemWidth={76}>
      {images?.map((img) => (
        <GalleryItem key={img} imgUrl={img} />
      ))}
    </Carousel>
  )
}

function GalleryItem({ imgUrl }: GalleryItemProps) {
  return (
    <>
      <div className="flex h-fit max-h-[120px] w-full max-w-[76px] items-center justify-center rounded-[2px] border border-[#ebecf0]">
        <Image
          src={imgUrl}
          alt={imgUrl}
          className="select-none"
          draggable={false}
          width={76}
          height={120}
          layout="constrained"
        />
      </div>
    </>
  )
}
