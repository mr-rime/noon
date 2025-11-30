import { Suspense, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ACTIVE_BANNERS_BY_PLACEMENT } from '@/features/landing/api/banner-display';
import { ImageSlider } from '@/shared/components/ui/image-slider'
import { SlideableImages } from './slideable-images'
import { type Banner } from '@/shared/types/banner'
import { Skeleton } from '@/shared/components/ui/skeleton'

function HeroSkeleton() {
  return (
    <div className="m-auto mt-10 mb-5 flex h-fit w-full max-w-[1500px] items-center justify-center overflow-hidden px-4">
      <Skeleton className="w-full h-[350px] rounded-xl" />
    </div>
  )
}

function HeroSlider() {
  const { data, loading } = useQuery(GET_ACTIVE_BANNERS_BY_PLACEMENT, {
    variables: { placement: 'image_slider' },
    errorPolicy: 'ignore'
  })

  const banners: Banner[] = useMemo(() => data?.getActiveBannersByPlacement || [], [data?.getActiveBannersByPlacement])

  const images = useMemo(() =>
    banners.map(banner => banner.image_url).filter(Boolean) as string[],
    [banners]
  )

  const mobileImages = useMemo(() =>
    banners.map(banner => banner.mobile_image_url || banner.image_url).filter(Boolean) as string[],
    [banners]
  )

  const handleSlideClick = (index: number) => {
    const banner = banners[index]
    if (banner?.target_url) {
      window.location.href = banner.target_url
    }
  }

  if (loading) {
    return <HeroSkeleton />
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="m-auto mt-10 mb-5 flex h-fit w-full max-w-[1500px] items-center justify-center overflow-hidden px-4">
      <SlideableImages>
        <ImageSlider
          images={images}
          mobileImages={mobileImages}
          autoPlay={true}
          autoPlayInterval={5000}
          height={350}
          showControls={true}
          showDots={true}
          onSlideClick={handleSlideClick}
        />
      </SlideableImages>
    </div>
  )
}

export default function HeroSection() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroSlider />
    </Suspense>
  )
}
