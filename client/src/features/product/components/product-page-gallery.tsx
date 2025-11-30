import { Image } from '@unpic/react'
import { Carousel } from '@/shared/components/ui/carousel'

type ProductPageGalleryProps = {
  images?: string[]
  onSelect?: (index: number) => void
  activeIndex?: number
}

type GalleryItemProps = {
  imgUrl: string
  isActive?: boolean
  onClick?: () => void
}

export function ProductPageGallery({ images, onSelect, activeIndex }: ProductPageGalleryProps) {
  return (
    <Carousel showControls controlClassName="" itemWidth={76}>
      {images?.map((img, i) => (
        <GalleryItem key={img} imgUrl={img} isActive={i === activeIndex} onClick={() => onSelect?.(i)} />
      ))}
    </Carousel>
  )
}

function GalleryItem({ imgUrl, isActive, onClick }: GalleryItemProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`flex h-fit max-h-[120px] w-full max-w-[76px] items-center justify-center rounded-[2px] border cursor-pointer transition-opacity hover:opacity-80 ${isActive ? 'border-[#34353a]' : 'border-[#ebecf0]'
          } focus:outline-none focus:ring-2 focus:ring-[#34353a]/40`}
        aria-label="Select product image thumbnail">
        <Image
          src={imgUrl}
          alt={imgUrl}
          className="select-none"
          draggable={false}
          width={76}
          height={120}
          layout="constrained"
        />
      </button>
    </>
  )
}
